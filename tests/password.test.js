const bcrypt = require("bcryptjs");
const { hashPassword, validatePassword } = require("../utils/password");

describe("hashpassword function", () => {
  it("should hash to the password using bcrypt", async () => {
    const password = "test123";

    const hashedPass = await hashPassword(password);

    const passwordMatch = await bcrypt.compare(password, hashedPass);
    expect(passwordMatch).toBe(true);
  });
});

describe("validatepassword function", () => {
  it("should validate the password using bcrypt", async () => {
    const password = "password";

    const hashedPass = await bcrypt.hash(password, 10);

    const passwordMatch = await validatePassword(password, hashedPass);
    expect(passwordMatch).toBe(true);
  });

  it("should not match wrong password", async () => {
    const password = "test123";

    const hashedPass = await hashPassword(password);

    const passwordMatch = await bcrypt.compare("mynameis", hashedPass);
    expect(passwordMatch).toBe(false);
  });
});

describe("both function should work with reach other: hashPassword and validatePassword", () => {
  it("should work with each other", async () => {
    const password = "gomugomunomi";

    const hashedPass = await hashPassword(password);

    const passwordMatch = await validatePassword(password, hashedPass);
    expect(passwordMatch).toBe(true);
  });
});
