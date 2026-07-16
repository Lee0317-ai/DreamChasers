import { describe, expect, it } from "vitest";
import { createSceneBlendTask, getSceneBlendTask, getSceneBlendTaskResult } from "../scene-blend-task-store";

describe("scene-blend-task-store", () => {
  it("stores a scene blend result returned by AI Gateway", async () => {
    const productImage = new File([new Uint8Array([1, 2, 3])], "product.png", { type: "image/png" });
    const backgroundImage = new File([new Uint8Array([4, 5, 6])], "mountain.jpg", { type: "image/jpeg" });
    const task = createSceneBlendTask(productImage, backgroundImage, "雪山户外", {
      runAiGatewayTask: async (input) => {
        expect(input.toolSlug).toBe("ai-photo-editor-scene-blend");
        expect(input.input.imageBase64).toBe("AQID");
        expect(input.input.backgroundImageBase64).toBe("BAUG");
        expect(input.input.prompt).toContain("雪山户外");

        return {
          creditCost: 3,
          result: {
            contentType: "image/png",
            imageBase64: "CQgH"
          },
          status: "succeeded",
          taskId: "gateway_log_scene_1"
        };
      },
      userId: "user_1"
    });

    let current = getSceneBlendTask(task.taskId);

    for (let index = 0; index < 10 && current?.status !== "succeeded"; index += 1) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      current = getSceneBlendTask(task.taskId);
    }

    expect(current?.status).toBe("succeeded");
    expect(getSceneBlendTaskResult(task.taskId)).toEqual({
      contentType: "image/png",
      data: Buffer.from([9, 8, 7])
    });
  });
});
