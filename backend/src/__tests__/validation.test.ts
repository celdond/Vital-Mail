import {validatePassword, validateName} from "../db/accountHandler";

test("Validation Name - Success", async () => {
    const name = await validateName("Hello66");
    expect(name).toBe(true);
});

test("Validation Name - Success", async () => {
    const name = await validateName("Hello66!");
    expect(name).toBe(false);
});

test("Validation Password - Success", async () => {
    const password = await validatePassword("Hello66");
    expect(password).toBe(true);
});

test("Validation Password - Special Characters", async () => {
    const password = await validatePassword("!#%$");
    expect(password).toBe(true);
});
