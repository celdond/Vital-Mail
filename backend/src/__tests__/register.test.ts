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
  await request.post("/register").send().expect(400);
});

const missingField = {
  username: "string",
  email: "wakka",
};

test("FAIL - Missing One Field", async () => {
  await request.post("/register").send(missingField).expect(400);
});
