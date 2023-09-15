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

// Failed Logins
test("FAIL - Send Nothing", async () => {
  await request.post("/login").send().expect(400);
});

const wrongObject = {
  no: "yes",
  yes: "no",
};

test("FAIL - Send Wrong Object", async () => {
  await request.post("/login").send(wrongObject).expect(400);
});

const zeroLength = {
  email: "",
  password: "",
};

test("FAIL - Send Object with empty strings", async () => {
  await request.post("/login").send(zeroLength).expect(400);
});

const wrongPassword = {
  email: "Abigail",
  password: "baba",
};

test("FAIL - Send the wrong password", async () => {
  await request.post("/login").send(wrongPassword).expect(401);
});
