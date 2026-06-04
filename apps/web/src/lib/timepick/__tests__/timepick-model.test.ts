import { describe, expect, it } from "vitest";
import { canAccessTimePickOwnerRecord, defaultTimePickSections } from "../timepick-model";

describe("timepick model rules", () => {
  it("keeps the four legacy TimePick sections in stable order", () => {
    expect(defaultTimePickSections.map((section) => section.type)).toEqual(["webpage", "document", "image", "video"]);
    expect(defaultTimePickSections.map((section) => section.sortOrder)).toEqual([1, 2, 3, 4]);
  });

  it("allows records only for the same DreamChasers user id", () => {
    expect(canAccessTimePickOwnerRecord({ ownerUserId: "user_a", requesterUserId: "user_a" })).toBe(true);
    expect(canAccessTimePickOwnerRecord({ ownerUserId: "user_a", requesterUserId: "user_b" })).toBe(false);
  });
});
