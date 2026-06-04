import { describe, expect, it } from "vitest";
import {
  buildPasswordResetIdentifier,
  createPasswordResetToken,
  hashPasswordResetToken,
  normalizeAuthEmail,
  validatePasswordPair
} from "../recovery";

describe("account recovery helpers", () => {
  it("normalizes auth emails before token operations", () => {
    expect(normalizeAuthEmail("  Lee@Example.COM ")).toBe("lee@example.com");
    expect(normalizeAuthEmail("")).toBe("");
  });

  it("builds a scoped password reset token identifier", () => {
    expect(buildPasswordResetIdentifier(" Lee@Example.COM ")).toBe("password-reset:lee@example.com");
  });

  it("creates reset tokens with a hashed database value and expiry", () => {
    const now = new Date("2026-06-04T10:00:00.000Z");
    const token = createPasswordResetToken(now);

    expect(token.plainToken).toMatch(/^[a-f0-9]{64}$/);
    expect(token.hashedToken).toMatch(/^[a-f0-9]{64}$/);
    expect(token.hashedToken).toBe(hashPasswordResetToken(token.plainToken));
    expect(token.hashedToken).not.toBe(token.plainToken);
    expect(token.expires).toEqual(new Date("2026-06-04T11:00:00.000Z"));
  });

  it("validates reset password pairs", () => {
    expect(validatePasswordPair("1234567", "1234567")).toBe("password-too-short");
    expect(validatePasswordPair("12345678", "87654321")).toBe("password-mismatch");
    expect(validatePasswordPair("12345678", "12345678")).toBeNull();
  });
});
