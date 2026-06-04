import { describe, expect, it } from "vitest";
import {
  buildProductSessionExpiry,
  canConsumeProductSession,
  generateProductSessionToken,
  hashProductSessionToken,
  isRegisteredProductSlug,
  productSessionTtlMs
} from "../product-session";

describe("product-session", () => {
  it("recognizes the default product slugs", () => {
    expect(isRegisteredProductSlug("timepick")).toBe(true);
    expect(isRegisteredProductSlug("wonderland")).toBe(true);
    expect(isRegisteredProductSlug("unknown")).toBe(false);
  });

  it("generates product session tokens with the expected prefix", () => {
    expect(generateProductSessionToken()).toMatch(/^dc_product_[a-f0-9]{48}$/);
  });

  it("hashes product session tokens for storage", () => {
    const token = "dc_product_1234567890abcdef1234567890abcdef1234567890abcdef";

    expect(hashProductSessionToken(token)).toMatch(/^[a-f0-9]{64}$/);
    expect(hashProductSessionToken(token)).not.toContain(token);
  });

  it("builds a ten minute product session expiry", () => {
    const now = new Date("2026-06-03T10:00:00.000Z");

    expect(productSessionTtlMs).toBe(10 * 60 * 1000);
    expect(buildProductSessionExpiry(now).toISOString()).toBe("2026-06-03T10:10:00.000Z");
  });

  it("allows consuming only matching unused and unexpired product sessions", () => {
    const now = new Date("2026-06-03T10:00:00.000Z");
    const expiresAt = new Date("2026-06-03T10:01:00.000Z");

    expect(
      canConsumeProductSession({
        consumedAt: null,
        expiresAt,
        productSlug: "timepick",
        requestedProductSlug: "timepick",
        now
      })
    ).toBe(true);
    expect(
      canConsumeProductSession({
        consumedAt: now,
        expiresAt,
        productSlug: "timepick",
        requestedProductSlug: "timepick",
        now
      })
    ).toBe(false);
    expect(
      canConsumeProductSession({
        consumedAt: null,
        expiresAt: new Date("2026-06-03T09:59:59.000Z"),
        productSlug: "timepick",
        requestedProductSlug: "timepick",
        now
      })
    ).toBe(false);
    expect(
      canConsumeProductSession({
        consumedAt: null,
        expiresAt,
        productSlug: "timepick",
        requestedProductSlug: "wonderland",
        now
      })
    ).toBe(false);
  });
});
