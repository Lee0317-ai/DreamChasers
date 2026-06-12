import { describe, expect, it } from "vitest";
import {
  buildTimePickUrlRecognitionGatewayInput,
  buildTimePickUrlRecognitionOutput
} from "../timepick-recognition";

describe("timepick-recognition", () => {
  it("builds a stable AI Gateway request for URL recognition", () => {
    expect(
      buildTimePickUrlRecognitionGatewayInput({
        url: "https://www.example.com/articles/alpha?ref=timepick",
        userId: "user_1"
      })
    ).toEqual({
      capability: "structured_extraction",
      credentialSource: "platform_pool",
      input: {
        prompt:
          "你是 TimePick 的资源录入助手。请根据给定 URL 返回适合资源卡片的简短标题、一句中文摘要，以及可选的缩略图链接。不要编造未给出的细节；拿不准时保守输出。",
        url: "https://www.example.com/articles/alpha?ref=timepick"
      },
      modelId: "mock-structured-fast",
      productSlug: "timepick",
      toolSlug: "timepick-url-recognition",
      userId: "user_1"
    });
  });

  it("normalizes gateway extraction output back to the TimePick recognition shape", () => {
    expect(
      buildTimePickUrlRecognitionOutput({
        result: {
          summary: "这是一篇关于时间管理的文章。",
          thumbnailUrl: "https://cdn.example.com/thumb.png",
          title: "Example"
        },
        url: "https://www.example.com/articles/alpha?ref=timepick"
      })
    ).toEqual({
      recognition: {
        content: "这是一篇关于时间管理的文章。",
        img: "https://cdn.example.com/thumb.png",
        title: "Example"
      }
    });
  });

  it("falls back to hostname and source link when gateway output is sparse", () => {
    expect(
      buildTimePickUrlRecognitionOutput({
        result: {},
        url: "https://www.example.com/articles/alpha?ref=timepick"
      })
    ).toEqual({
      recognition: {
        content: "来源链接：https://www.example.com/articles/alpha?ref=timepick",
        img: "",
        title: "example.com"
      }
    });
  });
});
