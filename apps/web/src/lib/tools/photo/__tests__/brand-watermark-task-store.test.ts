import { describe, expect, it } from "vitest";
import { createBrandWatermarkTask, getBrandWatermarkTask, getBrandWatermarkTaskResult } from "../brand-watermark-task-store";

describe("brand-watermark-task-store", () => {
  it("stores a brand watermark result returned by AI Gateway", async () => {
    const image = new File([new Uint8Array([1, 2, 3])], "photo.png", { type: "image/png" });
    const logo = new File([new Uint8Array([4, 5, 6])], "logo.png", { type: "image/png" });
    const task = createBrandWatermarkTask(image, logo, {
      logoSize: 18,
      runAiGatewayTask: async (input) => {
        expect(input.toolSlug).toBe("ai-photo-editor-brand-watermark");
        expect(input.input.imageBase64).toBe("AQID");
        expect(input.input.backgroundImageBase64).toBe("BAUG");
        expect(input.input.prompt).toContain("bottom-right corner");
        expect(input.input.prompt).toContain("Edit this photo by adding the uploaded logo");
        expect(input.input.prompt).toContain("Do not redraw the logo");
        expect(input.input.prompt).toContain("Keep all logo text");

        return {
          creditCost: 3,
          result: {
            contentType: "image/png",
            imageBase64: "CQgH"
          },
          status: "succeeded",
          taskId: "gateway_log_brand_1"
        };
      },
      userId: "user_1"
    });

    let current = getBrandWatermarkTask(task.taskId);

    for (let index = 0; index < 10 && current?.status !== "succeeded"; index += 1) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      current = getBrandWatermarkTask(task.taskId);
    }

    expect(current?.status).toBe("succeeded");
    expect(getBrandWatermarkTaskResult(task.taskId)).toEqual({
      contentType: "image/png",
      data: Buffer.from([9, 8, 7])
    });
  });
});
