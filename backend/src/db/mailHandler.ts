import { newmailType, fromType, mailType } from "../appTypes";

import { pool } from './pool';

const STATIC_MAILBOX = ["Inbox", "Sent", "Trash"];

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
// usermail - user requesting the mailbox
// mailbox  - name of the mailbox
export async function checkBox(usermail: string, mailbox: string) {
  const boxcode = mailbox + "@" + usermail;
  const search = "SELECT * FROM mailbox WHERE boxcode = $1";
  const query = {
    text: search,
    values: [boxcode],
  };
  const queryBox = await pool.query(query);
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
  return rows.length == 1 ? rows[0].mail : undefined;
}

// accessMailbox:
//
// retrieves mail from the chosen mailbox
//
// usermail - user requesting the mailbox
// mailbox  - name of the mailbox
export async function accessMailbox(usermail: string, mailbox: string) {
  const boxcode = mailbox + "@" + usermail;
  const search = "SELECT mid, mail FROM mail WHERE boxcode = $1";
  const query = {
    text: search,
    values: [boxcode],
  };

  const receivedMail = [];
  try {
    const queryMail = await pool.query(query);

    if (queryMail.rows[0]) {
      for (const row of queryMail.rows) {
        row.mail.id = row.mid;
        row.mail.preview = row.mail.content.slice(0, 18) + "...";
        delete row.mail.content;
        receivedMail.push(row.mail);
      }
    }
  } catch {}
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
  let id: string = "";

  try {
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
    id = mailSlip["id"] ?? "";
  } catch (e) {
    await client.query("ROLLBACK");
    client.release();
    if (e === 404) {
      return 404;
    }
    return 500;
  }

  client.release();
  return id;
}
