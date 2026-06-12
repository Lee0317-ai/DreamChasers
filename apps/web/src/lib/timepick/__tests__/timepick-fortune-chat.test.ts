import { describe, expect, it } from "vitest";
import {
  buildTimePickFortuneChatGatewayInput,
  buildTimePickFortuneChatOutput
} from "../timepick-fortune-chat";

describe("timepick-fortune-chat", () => {
  it("builds a stable AI Gateway request for TimePick fortune chat", () => {
    expect(
      buildTimePickFortuneChatGatewayInput({
        message: "今天适合推进什么？",
        userId: "user_1"
      })
    ).toEqual({
      capability: "text_generation",
      credentialSource: "platform_pool",
      input: {
        message: "今天适合推进什么？",
        prompt:
          "你是 TimePick 的轻量运势与决策陪伴助手。请基于用户提问，给出简短、温和、可执行的中文建议。避免神秘断言，强调把问题收敛到今天最值得推进的一件事。"
      },
      modelId: "mock-structured-fast",
      productSlug: "timepick",
      toolSlug: "timepick-fortune-chat",
      userId: "user_1"
    });
  });

  it("normalizes gateway results back to the legacy TimePick response shape", () => {
    expect(
      buildTimePickFortuneChatOutput({
        result: {
          summary: "Mock AI gateway response",
          text: "建议先收敛到今天最重要的一件事。"
        }
      })
    ).toEqual({
      output: {
        text: "建议先收敛到今天最重要的一件事。"
      }
    });
  });
});
