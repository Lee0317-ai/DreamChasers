export type AiCredentialSourceId =
  | "platform_pool"
  | "user_ephemeral_key"
  | "external_gateway_byok"
  | "user_encrypted_vault"
  | "local_connector";

export type AiCredentialSourceView = {
  description: string;
  id: AiCredentialSourceId;
  label: string;
  phase: 2 | 3;
  status: "available-in-phase-two" | "future-mode";
  storesProviderKey: boolean;
};

export const aiCredentialSources: AiCredentialSourceView[] = [
  {
    description: "用户使用平台额度调用 AI 能力，真实 provider 和 key 池由 AI Gateway 管理。",
    id: "platform_pool",
    label: "平台额度",
    phase: 2,
    status: "available-in-phase-two",
    storesProviderKey: false
  },
  {
    description: "用户在单次请求中输入 Key，请求结束后丢弃，不入库、不写日志。",
    id: "user_ephemeral_key",
    label: "临时 Key",
    phase: 2,
    status: "available-in-phase-two",
    storesProviderKey: false
  },
  {
    description: "用户在外部 Gateway 托管 provider key，平台只保存 route 或 credential reference。",
    id: "external_gateway_byok",
    label: "外部 Gateway BYOK",
    phase: 2,
    status: "available-in-phase-two",
    storesProviderKey: false
  },
  {
    description: "平台加密保存用户 provider key，需要 KMS、轮换、删除和审计能力。",
    id: "user_encrypted_vault",
    label: "加密 Key Vault",
    phase: 3,
    status: "future-mode",
    storesProviderKey: true
  },
  {
    description: "用户运行本地连接器，由本地服务读取环境变量并代理模型请求。",
    id: "local_connector",
    label: "本地连接器",
    phase: 3,
    status: "future-mode",
    storesProviderKey: false
  }
];

export function getPhaseTwoCredentialSources() {
  return aiCredentialSources.filter((source) => source.phase === 2);
}
