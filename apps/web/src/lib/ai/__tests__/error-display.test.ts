import { describe, expect, it } from "vitest";
import { getAiGatewayErrorDisplay } from "../error-display";

describe("error-display", () => {
  it("returns human-readable copy for standardized error codes", () => {
    expect(getAiGatewayErrorDisplay("insufficient_credits")).toEqual({
      description: "平台积分不足，当前请求未被执行。",
      label: "平台积分不足"
    });

    expect(getAiGatewayErrorDisplay("provider_misconfigured")).toEqual({
      description: "Provider 环境变量不完整，暂时不能发起真实调用。",
      label: "Provider 配置不完整"
    });

    expect(getAiGatewayErrorDisplay("input_invalid")).toEqual({
      description: "当前请求参数不符合该能力的输入契约。",
      label: "输入不合法"
    });
  });

  it("falls back gracefully for unknown or missing codes", () => {
    expect(getAiGatewayErrorDisplay(undefined)).toEqual({
      description: "请求失败，但未返回可解析的错误码。",
      label: "未返回失败原因"
    });

    expect(getAiGatewayErrorDisplay("odd_error_code")).toEqual({
      description: "请求失败，但错误码还没有接入统一翻译层。",
      label: "odd_error_code"
    });
  });
});
