import { describe, expect, it } from "vitest";
import { createPhotoEditTask, getPhotoEditTask, getPhotoEditTaskResult } from "../photo-edit-task-store";
import type { PhotoEditMode } from "../ai-image-provider";

describe("photo-edit-task-store", () => {
  it.each([
    ["repair", "ai-photo-editor-repair", "去掉右下角遮挡"],
    ["enhance", "ai-photo-editor-enhance", ""],
    ["prompt_edit", "ai-photo-editor-prompt-edit", "把背景换成浅灰色"]
  ] satisfies Array<[PhotoEditMode, string, string]>)("stores a %s result returned by AI Gateway", async (mode, toolSlug, prompt) => {
    const image = new File([new Uint8Array([1, 2, 3])], "photo.png", { type: "image/png" });
    const task = createPhotoEditTask(image, {
      mode,
      prompt,
      runAiGatewayTask: async (input) => {
        expect(input.toolSlug).toBe(toolSlug);
        expect(input.input.imageBase64).toBe("AQID");
        expect(input.input.editMode).toBe(mode);

        if (prompt) {
          expect(input.input.prompt).toContain(prompt);
        }

        return {
          creditCost: 3,
          result: {
            contentType: "image/png",
            imageBase64: "CQgH"
          },
          status: "succeeded",
          taskId: `gateway_log_${mode}`
        };
      },
      userId: "user_1"
    });

    let current = getPhotoEditTask(task.taskId);

    for (let index = 0; index < 10 && current?.status !== "succeeded"; index += 1) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      current = getPhotoEditTask(task.taskId);
    }

    expect(current?.status).toBe("succeeded");
    expect(getPhotoEditTaskResult(task.taskId)).toEqual({
      contentType: "image/png",
      data: Buffer.from([9, 8, 7])
    });
  });
});
