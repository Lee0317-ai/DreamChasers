import { describe, expect, it } from "vitest";
import { canUsePasswordLogin, shouldReplaceExistingAccountPassword } from "../auth-rules";

describe("auth rules", () => {
  it("allows password login without requiring email verification", () => {
    expect(
      canUsePasswordLogin({
        emailVerified: null,
        passwordMatches: true
      })
    ).toBe(true);
  });

  it("still rejects password login when the password does not match", () => {
    expect(
      canUsePasswordLogin({
        emailVerified: new Date("2026-06-04T00:00:00.000Z"),
        passwordMatches: false
      })
    ).toBe(false);
  });

  it("does not let registration replace an existing password", () => {
    expect(
      shouldReplaceExistingAccountPassword({
        emailVerified: new Date("2026-06-04T00:00:00.000Z"),
        hasPasswordHash: true
      })
    ).toBe(false);
  });

  it("lets registration add a password for a legacy account without one", () => {
    expect(
      shouldReplaceExistingAccountPassword({
        emailVerified: null,
        hasPasswordHash: false
      })
    ).toBe(true);
  });
});
