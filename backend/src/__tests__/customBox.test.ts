import app from "../app";
import http from "http";
import supertest from "supertest";
import { startDatabase, end } from "./testDatabase";

let request: supertest.SuperTest<supertest.Test>;
let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return startDatabase();
});

afterAll((done) => {
  server.close(done);
  end();
});

const user = {
  email: "Abigail",
  password: "abi123",
};

let token = "";
// Login Set-Up
test("Successful Login", async () => {
  await request
    .post("/login")
    .send(user)
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.token).toBeDefined();
      token = data.body.token;
    });
});

// Create New Custom Mailbox
test("Custom Mailbox", async () => {
  await request
    .post("/mailbox")
    .set({ authorization: "Bearer " + token })
    .send({ boxName: "Custom" })
    .expect(201);
});

// Check to Make Sure New Mailbox was Added
test("Get Mailboxes", async () => {
  await request
    .get("/mailbox")
    .set({ authorization: "Bearer " + token })
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.length).toBeDefined();
      expect(data.body.length).toStrictEqual(4);
    });
});

test("Delete Forbidden Mailbox", async () => {
  await request
    .delete("/mailbox")
    .set({ authorization: "Bearer " + token })
    .send({ boxName: "Inbox" })
    .expect(403);
});

// Delete Custom Mailbox
test("Delete Custom Mailbox", async () => {
  await request
    .delete("/mailbox")
    .set({ authorization: "Bearer " + token })
    .send({ boxName: "Custom" })
    .expect(200);
});

// Check to Make Sure Mailbox was Deleted
test("Get Mailboxes", async () => {
  await request
    .get("/mailbox")
    .set({ authorization: "Bearer " + token })
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.length).toBeDefined();
      expect(data.body.length).toStrictEqual(3);
    });
});
