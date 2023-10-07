import { newmailType, fromType, mailType } from "../appTypes";

import { PoolClient } from "pg";
import { pool } from "./pool";

// accessBoxes:
//
// Retrieve all mailboxes for a user
//
// usermail - the username requesting their boxes
export async function accessBoxes(usermail: string) {
  const search = "SELECT * FROM mailbox WHERE email = $1";
  const query = {
    text: search,
    values: [usermail],
  };

  const { rows } = await pool.query(query);
  const mailboxes = [];
  for (const row of rows) {
    mailboxes.push(row.mailbox);
  }
  return mailboxes;
}

// checkBox
//
// ensures that the mailbox exists for the user
//
// client   - PoolClient Instance
// usermail - user requesting the mailbox
// mailbox  - name of the mailbox
export async function checkBox(
  client: PoolClient,
  usermail: string,
  mailbox: string,
) {
  const boxcode = mailbox + "@" + usermail;
  const search = "SELECT * FROM mailbox WHERE boxcode = $1";
  const query = {
    text: search,
    values: [boxcode],
  };
  const queryBox = await client.query(query);
  if (queryBox.rows[0]) {
    return 0;
  } else {
    return -1;
  }
}

// accessMail:
//
// retrieve mail content for the specified id
//
// id - desired mail id
export async function accessMail(id: string) {
  const select = "SELECT mid, mail FROM mail WHERE mid = $1";
  const query = {
    text: select,
    values: [id],
  };
  const { rows } = await pool.query(query);
  if (rows[0]) {
    rows[0].mail.id = rows[0].mid;
  }

  const returnObject = {
    content: rows.length == 1 ? rows[0].mail : undefined,
    status: rows.length == 1 ? 200 : 404,
  };
  return returnObject;
}

// accessMailbox:
//
// retrieves mail from the chosen mailbox
//
// usermail - user requesting the mailbox
// mailbox  - name of the mailbox
export async function accessMailbox(usermail: string, mailbox: string) {
  const client = await pool.connect();
  const boxcode = mailbox + "@" + usermail;
  const search = "SELECT mid, mail FROM mail WHERE boxcode = $1";
  const query = {
    text: search,
    values: [boxcode],
  };
  const receivedMail = [];
  try {
    await client.query("BEGIN");
    const mailboxCheck = await checkBox(client, usermail, mailbox);
    if (mailboxCheck != 0) {
      throw 404;
    }
    const queryMail = await pool.query(query);
    if (queryMail.rows[0]) {
      for (const row of queryMail.rows) {
        row.mail.id = row.mid;
        row.mail.preview = row.mail.content.slice(0, 18) + "...";
        delete row.mail.content;
        receivedMail.push(row.mail);
      }
    }
    await client.query("COMMIT");
  } catch {
    await client.query("ROLLBACK");
    client.release();
    return 404;
  }
  client.release();
  return receivedMail;
}

// createMail:
//
// creates a new mail entry to send another user
//
// from     - object describing who is sending the message
// newMail  - object being sent to reciever
export async function createMail(from: fromType, newMail: newmailType) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    // Search to ensure reciever exists
    const search = `SELECT username, email
      FROM usermail WHERE email = $1`;
    const loginSearch = {
      text: search,
      values: [newMail.to],
    };
    const targetUser = await client.query(loginSearch);
    if (targetUser.rowCount === 0) {
      throw 404;
    }

    const to: fromType = {
      name: targetUser.rows[0].username ?? "",
      email: targetUser.rows[0].email ?? "",
    };

    // Set Timestamp
    const today = new Date();
    const mailSlip: mailType = {
      from: from,
      to: to,
      timestamp: today.toISOString().split(".")[0] + "Z",
      content: newMail.content,
      subject: newMail.subject,
      seen: 0,
    };

    // Send message to sender's sent mailbox
    let boxcode = "Sent@" + from.email;
    const insert =
      "INSERT INTO mail(boxcode, mail) VALUES ($1, $2) RETURNING mid";
    const query = {
      text: insert,
      values: [boxcode, mailSlip],
    };
    const r = await client.query(query);

    // Send message to recipient's inbox
    boxcode = "Inbox@" + to.email;
    mailSlip.seen = 1;
    const receivingQuery = {
      text: insert,
      values: [boxcode, mailSlip],
    };

    await client.query(receivingQuery);
    mailSlip["id"] = r.rows[0].mid;
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    client.release();
    if (e === 404) {
      return 404;
    }
    return 500;
  }

  client.release();
  return 201;
}

// changeBox:
//
// Function to update the mailbox a message is in
//
// client - PoolClient instance
// id     - id of the message to move
// box    - boxcode to move to
async function changeBox(client: PoolClient, id: string, boxcode: string) {
  const update = "UPDATE mail SET boxcode = $1 WHERE mid = $2 RETURNING mail";
  const query = {
    text: update,
    values: [boxcode, id],
  };
  try {
    await client.query(query);
  } catch (e) {
    console.log(e);
    return 500;
  }
  return 200;
}

// moveBox:
//
// move an message to another box
//
// ids      - ids of the messages to move
// usermail - user moving the messages
// mailbox  - mailbox to send message to
export async function moveBox(
  ids: string[],
  usermail: string,
  mailbox: string,
) {
  const client = await pool.connect();
  const boxcode = mailbox + "@" + usermail;
  // SQL Transaction
  try {
    await client.query("BEGIN");

    // Check to ensure mailbox exists
    const mailboxCheck = await checkBox(client, usermail, mailbox);
    if (mailboxCheck != 0) {
      throw 404;
    }

    for (const id of ids) {
      // Find Mail and Current Mailbox
      const select =
        "SELECT m.mid, m.boxcode, m.mail FROM mail m WHERE m.mid = $1 AND m.boxcode IN (SELECT b.boxcode FROM mailbox b WHERE b.email = $2)";
      const query = {
        text: select,
        values: [id, usermail],
      };
      let { rows } = await client.query(query);
      const currentBox = rows.length == 1 ? rows[0].boxcode : undefined;

      // Check the current mailbox for validity
      if (!currentBox) {
        throw 404;
      } else if (currentBox != "Sent@" + usermail && mailbox === "Sent") {
        throw 409;
      } else if (currentBox === boxcode) {
        continue;
      } else {
        // Change mailbox of message if valid
        const change = await changeBox(client, id, boxcode);
        if (change != 200) {
          throw change;
        }
      }
    }
    await client.query("COMMIT");
    client.release();
    return 200;
  } catch (e) {
    // Send Error if any issue occurs in SQL Transaction
    await client.query("ROLLBACK");
    client.release();
    if (typeof e == "number") {
      return e;
    } else {
      return 500;
    }
  }
}

// deleteIDs:
//
// deletes messages
//
// ids      - ids of the messages to delete
// usermail - user moving the messages
export async function deleteIDs(ids: string[], usermail: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const id of ids) {
      const select =
        "DELETE FROM mail m WHERE m.mid = $1 AND m.boxcode IN (SELECT b.boxcode FROM mailbox b WHERE b.email = $2)";
      const query = {
        text: select,
        values: [id, usermail],
      };
      await client.query(query);
    }
    await client.query("COMMIT");
    client.release();
    return 200;
  } catch (e) {
    // Send Error if any issue occurs in SQL Transaction
    await client.query("ROLLBACK");
    client.release();
    if (typeof e == "number") {
      return e;
    } else {
      return 500;
    }
  }
}

// insertBox:
//
// create custom mailbox
//
// boxName  - name of the new custom mailbox
// usermail - user creating the box
export async function insertBox(boxName: string, usermail: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("COMMIT");
    client.release();
    return 201;
  } catch (e) {
    await client.query("ROLLBACK");
    client.release();
    if (typeof e == "number") {
      return e;
    } else {
      return 500;
    }
  }
}
