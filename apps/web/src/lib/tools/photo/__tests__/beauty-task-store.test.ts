import { describe, expect, it } from "vitest";
import { createBeautyTask, getBeautyTask, getBeautyTaskResult } from "../beauty-task-store";

describe("beauty-task-store", () => {
  it("stores a successful beauty result returned by AI Gateway", async () => {
    const image = new File([new Uint8Array([1, 2, 3])], "portrait.png", { type: "image/png" });
    const task = createBeautyTask(image, {
      runAiGatewayTask: async () => ({
        creditCost: 3,
        result: {
          contentType: "image/png",
          imageBase64: "AQID"
        },
        status: "succeeded",
        taskId: "gateway_log_1"
      }),
      userId: "user_1"
    });

    let current = getBeautyTask(task.taskId);

    for (let index = 0; index < 10 && current?.status !== "succeeded"; index += 1) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      current = getBeautyTask(task.taskId);
    }

    expect(current?.status).toBe("succeeded");
    expect(getBeautyTaskResult(task.taskId)).toEqual({
      contentType: "image/png",
      data: Buffer.from([1, 2, 3])
    });
  });
});
