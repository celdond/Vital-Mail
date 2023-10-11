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
    .post("/mailbox")
    .set({ authorization: "Bearer " + token })
    .send({ boxName: "Custom" })
    .expect(201);
});

// Get Mailboxes
test("GET Missing Mailbox", async () => {
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
