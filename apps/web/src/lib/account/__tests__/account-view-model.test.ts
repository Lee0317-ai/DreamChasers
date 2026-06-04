import { describe, expect, it } from "vitest";
import { buildAccountInitial, buildSecuritySummary, formatAccountDate, toDeviceRows } from "../account-view-model";

describe("account-view-model", () => {
  it("builds a stable avatar initial from display name or email", () => {
    expect(buildAccountInitial("李明远", "lee@example.com")).toBe("李");
    expect(buildAccountInitial("", "lee@example.com")).toBe("L");
    expect(buildAccountInitial("", "")).toBe("U");
  });

  it("summarizes phase-one security without claiming password or phone support", () => {
    expect(buildSecuritySummary({ auditLogCount: 3, emailVerified: true })).toEqual({
      description: "邮箱验证已启用，最近有 3 条安全记录。",
      level: "基础",
      score: 2
    });
    expect(buildSecuritySummary({ auditLogCount: 0, emailVerified: false })).toEqual({
      description: "邮箱仍在等待验证，请重新登录确认邮箱。",
      level: "待确认",
      score: 0
    });
  });

  it("formats account dates for zh-CN screens", () => {
    expect(formatAccountDate(new Date("2026-06-04T10:20:00.000Z"), "Asia/Shanghai")).toContain("2026");
  });

  it("turns audit logs into device-like rows for phase one", () => {
    const rows = toDeviceRows([
      { action: "session_created", createdAt: new Date("2026-06-04T10:00:00.000Z"), id: "a1" },
      { action: "api_key_created", createdAt: new Date("2026-06-04T11:00:00.000Z"), id: "a2" }
    ]);

    expect(rows).toEqual([
      {
        id: "a1",
        location: "位置未记录",
        name: "网页登录",
        status: "当前或近期会话",
        time: new Date("2026-06-04T10:00:00.000Z")
      },
      {
        id: "a2",
        location: "位置未记录",
        name: "账号安全事件",
        status: "已记录",
        time: new Date("2026-06-04T11:00:00.000Z")
      }
    ]);
  });
});
