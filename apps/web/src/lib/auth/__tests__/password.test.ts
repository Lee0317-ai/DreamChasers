import { describe, expect, it } from "vitest";
import { hashPassword, isPasswordLongEnough, verifyPassword } from "../password";

describe("password auth", () => {
  it("requires at least eight characters for account passwords", () => {
    expect(isPasswordLongEnough("1234567")).toBe(false);
    expect(isPasswordLongEnough("12345678")).toBe(true);
  });

  it("hashes passwords without storing the plain text", async () => {
    const hash = await hashPassword("correct horse battery staple");

    expect(hash).toMatch(/^scrypt\$/);
    expect(hash).not.toContain("correct horse battery staple");
    await expect(verifyPassword("correct horse battery staple", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong password", hash)).resolves.toBe(false);
  });
});
