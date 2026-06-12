export type AiGatewayDisplayErrorCode =
  | "capability_not_supported"
  | "credential_source_not_supported"
  | "execution_failed"
  | "input_invalid"
  | "insufficient_credits"
  | "model_not_allowed"
  | "provider_misconfigured"
  | "provider_unavailable"
  | "unauthorized";

type AiGatewayErrorDisplay = {
  description: string;
  label: string;
};

const aiGatewayErrorDisplayMap: Record<AiGatewayDisplayErrorCode, AiGatewayErrorDisplay> = {
  capability_not_supported: {
    description: "当前产品能力还没有注册到平台 Gateway。",
    label: "能力未接入"
  },
  credential_source_not_supported: {
    description: "当前模型不支持所选凭据来源。",
    label: "凭据来源不支持"
  },
  execution_failed: {
    description: "模型执行链路失败，请稍后重试。",
    label: "执行失败"
  },
  input_invalid: {
    description: "当前请求参数不符合该能力的输入契约。",
    label: "输入不合法"
  },
  insufficient_credits: {
    description: "平台积分不足，当前请求未被执行。",
    label: "平台积分不足"
  },
  model_not_allowed: {
    description: "当前能力不允许使用这个模型。",
    label: "模型不可用"
  },
  provider_misconfigured: {
    description: "Provider 环境变量不完整，暂时不能发起真实调用。",
    label: "Provider 配置不完整"
  },
  provider_unavailable: {
    description: "Provider 当前被关闭或不可用。",
    label: "Provider 不可用"
  },
  unauthorized: {
    description: "当前请求缺少有效登录态。",
    label: "未登录"
  }
};

export function getAiGatewayErrorDisplay(code: string | null | undefined): AiGatewayErrorDisplay {
  if (!code) {
    return {
      description: "请求失败，但未返回可解析的错误码。",
      label: "未返回失败原因"
    };
  }

  return (
    aiGatewayErrorDisplayMap as Record<string, AiGatewayErrorDisplay>
  )[code] ?? {
    description: "请求失败，但错误码还没有接入统一翻译层。",
    label: code
  };
}
