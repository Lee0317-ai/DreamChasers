export const aiGatewayCredentialSources = [
  "platform_pool",
  "user_ephemeral_key",
  "external_gateway_byok",
  "user_encrypted_vault",
  "local_connector"
] as const;

export type AiGatewayCredentialSource = (typeof aiGatewayCredentialSources)[number];

export function isAiGatewayCredentialSource(value: string): value is AiGatewayCredentialSource {
  return aiGatewayCredentialSources.includes(value as AiGatewayCredentialSource);
}
