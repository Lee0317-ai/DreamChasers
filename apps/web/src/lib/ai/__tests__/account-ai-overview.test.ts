import { describe, expect, it } from "vitest";
import {
  buildAccountAiCapabilityCards,
  buildAccountAiRuntimeProviderCards,
  getAccountAiRequestFailureReason,
  summarizeAccountAiGatewayStatus
} from "../account-ai-overview";

describe("account-ai-overview", () => {
  it("builds stable capability cards from the model catalog", () => {
    const cards = buildAccountAiCapabilityCards();

    expect(cards.map((card) => card.capability)).toContain("structured_extraction");
    expect(cards.find((card) => card.capability === "structured_extraction")?.models[0]?.modelId).toBe(
      "mock-structured-fast"
    );
    expect(cards.find((card) => card.capability === "moderation")).toBeUndefined();
  });

  it("summarizes current gateway coverage for the account page", () => {
    expect(
      summarizeAccountAiGatewayStatus({
        availableBalance: 12,
        recentRequestCount: 3
      })
    ).toEqual({
      activeCapabilityCount: 6,
      availableBalance: 12,
      readyProviderCount: 0,
      recentRequestCount: 3,
      runtimeProviderCount: 2
    });
  });

  it("builds runtime provider cards with readable statuses", () => {
    const cards = buildAccountAiRuntimeProviderCards({
      AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY: "",
      AI_GATEWAY_OPENAI_COMPATIBLE_ENABLED: "1"
    });

    expect(cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          providerId: "mock",
          status: "dry_run_only"
        }),
        expect.objectContaining({
          providerId: "openai_compatible",
          status: "misconfigured"
        })
      ])
    );
  });

  it("translates known request failure reasons", () => {
    expect(getAccountAiRequestFailureReason("insufficient_credits")).toBe("平台积分不足");
    expect(getAccountAiRequestFailureReason("execution_failed")).toBe("执行失败");
    expect(getAccountAiRequestFailureReason(undefined)).toBe("未返回失败原因");
  });
});
