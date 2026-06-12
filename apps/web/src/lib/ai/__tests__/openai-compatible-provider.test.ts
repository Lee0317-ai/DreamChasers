import { afterEach, describe, expect, it, vi } from "vitest";
import { createOpenAiCompatibleProvider } from "../providers/openai-compatible-provider";

const originalFetch = global.fetch;

describe("openai-compatible-provider", () => {
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("uses the image edit endpoint for image_edit capability", async () => {
    const json = vi.fn().mockResolvedValue({
      data: [
        {
          b64_json: "AQID"
        }
      ]
    });

    global.fetch = vi.fn().mockResolvedValue({
      json,
      ok: true
    } as unknown as Response);

    const provider = createOpenAiCompatibleProvider({
      apiKey: "sk-test",
      baseUrl: "https://example.com/v1"
    });

    const response = await provider.execute({
      capability: "image_edit",
      credentialSource: "platform_pool",
      input: {
        beautyType: "natural_portrait",
        contentType: "image/png",
        imageBase64: "AQID"
      },
      model: {
        capabilities: ["image_edit"],
        credentialSources: ["platform_pool"],
        creditCost: 3,
        displayName: "OpenAI-Compatible Image Edit",
        modelId: "openai-compatible-image-edit",
        providerId: "openai_compatible",
        qualityTier: "high",
        recommended: true,
        speedTier: "balanced"
      },
      productSlug: "dreamchasers",
      toolSlug: "ai-photo-editor-beauty",
      userId: "user_1"
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/v1/images/edits",
      expect.objectContaining({
        method: "POST"
      })
    );
    expect(response.result).toEqual({
      contentType: "image/png",
      imageBase64: "AQID"
    });
  });
});
