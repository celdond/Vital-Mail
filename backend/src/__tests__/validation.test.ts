import { validatePassword, validateName } from "../db/accountHandler";

test("Validation Name - Success", async () => {
  const name = await validateName("Hello66");
  expect(name).toBe(true);
});

test("Validation Name - Fail Special Characters", async () => {
  const name = await validateName("Hello66!");
  expect(name).toBe(false);
});

test("Validation Name - Fail Special @", async () => {
  const name = await validateName("str@ing@@");
  expect(name).toBe(false);
});

test("Validation Password - Success", async () => {
  const password = await validatePassword("Hello66");
  expect(password).toBe(true);
});

test("Validation Password - Fail @", async () => {
  const password = await validatePassword("H@@66");
  expect(password).toBe(false);
});

test("Validation Password - Success Special Characters", async () => {
  const password = await validatePassword("!!Hell!?o66");
  expect(password).toBe(true);
});

test("Validation Password - Only Special Characters", async () => {
  const password = await validatePassword("!#%$");
  expect(password).toBe(true);
});
