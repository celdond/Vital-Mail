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

// Get Mailboxes
test("GET Missing Mailbox", async () => {
  await request
    .get("/mail?mailbox=Nuna")
    .set({ authorization: "Bearer " + token })
    .expect(404);
});

test("GET Inbox Mailbox", async () => {
  await request
    .get("/mail?mailbox=Inbox")
    .set({ authorization: "Bearer " + token })
    .expect(200)
    .expect("Content-Type", /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
    });
});
