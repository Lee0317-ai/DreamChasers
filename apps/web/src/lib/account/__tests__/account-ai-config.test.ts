import { describe, expect, it } from "vitest";
import { aiCredentialSources, getPhaseTwoCredentialSources } from "../account-ai-config";

describe("account-ai-config", () => {
  it("keeps T108 credential sources in the expected order", () => {
    expect(aiCredentialSources.map((source) => source.id)).toEqual([
      "platform_pool",
      "user_ephemeral_key",
      "external_gateway_byok",
      "user_encrypted_vault",
      "local_connector"
    ]);
  });

  it("limits phase two to sources that avoid stored provider keys", () => {
    expect(getPhaseTwoCredentialSources().map((source) => source.id)).toEqual([
      "platform_pool",
      "user_ephemeral_key",
      "external_gateway_byok"
    ]);
    expect(getPhaseTwoCredentialSources().every((source) => source.storesProviderKey === false)).toBe(true);
  });
});
