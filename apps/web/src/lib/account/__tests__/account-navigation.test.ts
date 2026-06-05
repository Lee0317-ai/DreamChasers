import { describe, expect, it } from "vitest";
import { accountNavGroups, findActiveAccountNavItem } from "../account-navigation";

describe("account-navigation", () => {
  it("keeps only phase-one usable account entries in the main navigation", () => {
    expect(accountNavGroups.map((group) => group.label)).toEqual(["账号", "AI 能力", "开发者和产品"]);
    expect(accountNavGroups.flatMap((group) => group.items.map((item) => item.href))).toEqual([
      "/account",
      "/account/profile",
      "/account/security",
      "/account/ai/credits",
      "/account/api-keys",
      "/account/products"
    ]);
  });

  it("marks nested account routes through the nearest parent item", () => {
    expect(findActiveAccountNavItem("/account/security")?.href).toBe("/account/security");
    expect(findActiveAccountNavItem("/account/security/events")?.href).toBe("/account/security");
    expect(findActiveAccountNavItem("/account/ai/credits/history")?.href).toBe("/account/ai/credits");
    expect(findActiveAccountNavItem("/account/ai/recharge")?.href).toBeUndefined();
    expect(findActiveAccountNavItem("/tools")?.href).toBeUndefined();
  });
});
