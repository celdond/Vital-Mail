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

// Failed Registers
test("FAIL - Send Nothing", async () => {
  await request.post("/register").send().expect(415);
});

const missingField = {
  username: "string",
  email: "wacca",
};

test("FAIL - Missing One Field", async () => {
  await request.post("/register").send(missingField).expect(400);
});

const passwordEmpty = {
  username: "string",
  email: "warra",
  password: "",
};

test("FAIL - Empty Password", async () => {
  await request.post("/register").send(passwordEmpty).expect(400);
});

const specialName = {
  username: "str!ing!!",
  email: "wadda",
  password: "passwordyay",
};

test("FAIL - Special Character in Name", async () => {
  await request.post("/register").send(specialName).expect(400);
});

const correct = {
  username: "string",
  email: "wakka",
  password: "wakkawakka",
};

// Successful Register
test("Successful Register", async () => {
  await request.post("/register").send(correct).expect(201);
});

const newAccount = {
  email: "wakka",
  password: "wakkawakka",
};

let token = "";
// Login Set-Up
test("Login to New Account", async () => {
  await request
    .post("/login")
    .send(newAccount)
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.token).toBeDefined();
      token = data.body.token;
    });
});

// Successful Deletion
test("Successful Account Deletion", async () => {
  await request
    .delete("/account")
    .set({ authorization: "Bearer " + token })
    .expect(200);
});

// Check to Make Sure Account is Gone
test("Login Attempt to Deleted Account", async () => {
  await request.post("/login").send(newAccount).expect(401);
});
