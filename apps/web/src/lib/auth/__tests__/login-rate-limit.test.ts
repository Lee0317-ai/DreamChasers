import { describe, expect, it } from "vitest";
import { buildLoginCooldownMessage, getLoginCooldownState } from "../login-rate-limit-rules";

describe("login-rate-limit", () => {
  it("allows login emails when there is no previous request", () => {
    expect(getLoginCooldownState(null, new Date("2026-06-03T10:00:00.000Z"))).toEqual({
      allowed: true,
      retryAfterSeconds: 0
    });
  });

  it("blocks repeated login emails inside the cooldown window", () => {
    expect(
      getLoginCooldownState(new Date("2026-06-03T10:00:30.000Z"), new Date("2026-06-03T10:01:00.000Z"))
    ).toEqual({
      allowed: false,
      retryAfterSeconds: 30
    });
  });

  it("allows login emails after the cooldown window", () => {
    expect(
      getLoginCooldownState(new Date("2026-06-03T10:00:00.000Z"), new Date("2026-06-03T10:01:01.000Z"))
    ).toEqual({
      allowed: true,
      retryAfterSeconds: 0
    });
  });

  it("builds a clear cooldown message", () => {
    expect(buildLoginCooldownMessage(30)).toBe("请求过于频繁，请 30 秒后再试。");
  });
});
