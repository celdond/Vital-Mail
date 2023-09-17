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
  email: "wakka",
};

test("FAIL - Missing One Field", async () => {
  await request.post("/register").send(missingField).expect(400);
});

const passwordEmpty = {
  username: "string",
  email: "wakka",
  password: "",
};

test("FAIL - Empty Password", async () => {
  await request.post("/register").send(passwordEmpty).expect(400);
});

const correct = {
  username: "string",
  email: "wakka",
  password: "wakkawakka",
};

// Successful Register
test("FAIL - Empty Password", async () => {
  await request.post("/register").send(correct).expect(201);
});
