import { describe, expect, it } from "vitest";
import {
  buildApiKeyHint,
  canCreateProductSession,
  computeCreditBalance,
  generatePlatformApiKeySecret,
  hashPlatformApiKey,
  sanitizeReturnUrl
} from "../account-security";

describe("account-security", () => {
  it("keeps safe internal return URLs and falls back for unsafe URLs", () => {
    expect(sanitizeReturnUrl("/account/api-keys")).toBe("/account/api-keys");
    expect(sanitizeReturnUrl("https://evil.example/account")).toBe("/account");
    expect(sanitizeReturnUrl("//evil.example/account")).toBe("/account");
    expect(sanitizeReturnUrl("javascript:alert(1)")).toBe("/account");
    expect(sanitizeReturnUrl("")).toBe("/account");
  });

  it("hashes platform API keys without exposing the secret", () => {
    const secret = "dc_live_1234567890abcdef";

    expect(buildApiKeyHint(secret)).toBe("dc_l...cdef");
    expect(hashPlatformApiKey(secret)).toMatch(/^[a-f0-9]{64}$/);
    expect(hashPlatformApiKey(secret)).not.toContain(secret);
  });

  it("generates platform API keys with the expected prefix", () => {
    const secret = generatePlatformApiKeySecret();

    expect(secret).toMatch(/^dc_live_[a-f0-9]{48}$/);
  });

  it("computes credit balances from immutable ledger entries", () => {
    const balance = computeCreditBalance([
      { amount: 100, type: "grant" },
      { amount: -25, type: "usage" },
      { amount: 10, type: "adjustment" }
    ]);

    expect(balance).toBe(85);
  });

  it("rejects product sessions for unknown products and unsafe return URLs", () => {
    expect(
      canCreateProductSession({
        productSlug: "timepick",
        registeredProductSlugs: ["timepick", "wonderland"],
        returnUrl: "/account"
      })
    ).toBe(true);
    expect(
      canCreateProductSession({
        productSlug: "unknown",
        registeredProductSlugs: ["timepick", "wonderland"],
        returnUrl: "/account"
      })
    ).toBe(false);
    expect(
      canCreateProductSession({
        productSlug: "timepick",
        registeredProductSlugs: ["timepick", "wonderland"],
        returnUrl: "https://evil.example"
      })
    ).toBe(false);
  });
});
