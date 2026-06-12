import { describe, expect, it } from "vitest";
import { getProviderReadiness } from "../provider-readiness";

describe("provider-readiness", () => {
  it("marks mock as dry-run only", () => {
    expect(getProviderReadiness("mock")).toEqual({
      providerId: "mock",
      reason: "当前仅用于本地 dry run 和稳定测试，不发真实第三方请求。",
      status: "dry_run_only"
    });
  });

  it("marks openai-compatible as disabled when env opt-out is set", () => {
    expect(
      getProviderReadiness("openai_compatible", {
        AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY: "sk-test",
        AI_GATEWAY_OPENAI_COMPATIBLE_ENABLED: "0"
      })
    ).toEqual({
      providerId: "openai_compatible",
      reason: "当前已被环境配置显式关闭。",
      status: "disabled"
    });
  });

  it("marks openai-compatible as misconfigured when api key is missing", () => {
    expect(
      getProviderReadiness("openai_compatible", {
        AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY: "",
        AI_GATEWAY_OPENAI_COMPATIBLE_ENABLED: "1"
      })
    ).toEqual({
      providerId: "openai_compatible",
      reason: "缺少 `AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY`，暂时不能发真实调用。",
      status: "misconfigured"
    });
  });

  it("marks openai-compatible as enabled when required env is present", () => {
    expect(
      getProviderReadiness("openai_compatible", {
        AI_GATEWAY_OPENAI_COMPATIBLE_API_KEY: "sk-test",
        AI_GATEWAY_OPENAI_COMPATIBLE_ENABLED: "1"
      })
    ).toEqual({
      providerId: "openai_compatible",
      reason: "环境变量已就绪，可作为真实 provider 候选入口。",
      status: "enabled"
    });
  });

  it("accepts legacy image provider config as a temporary readiness fallback", () => {
    expect(
      getProviderReadiness("openai_compatible", {
        AI_IMAGE_ACTIVE_PROVIDER: "pptoken",
        AI_IMAGE_PROVIDER_PPTOKEN_API_KEY: "sk-image",
        AI_IMAGE_PROVIDER_PPTOKEN_BASE_URL: "https://api.pptoken.org/v1",
        AI_IMAGE_PROVIDER_PPTOKEN_PROTOCOL: "openai-compatible"
      })
    ).toEqual({
      providerId: "openai_compatible",
      reason: "环境变量已就绪，可作为真实 provider 候选入口。",
      status: "enabled"
    });
  });
});
