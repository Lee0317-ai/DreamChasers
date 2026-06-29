import { randomUUID } from "node:crypto";
import { runAiGatewayTask } from "../../ai/ai-gateway";
import { buildBrandWatermarkGatewayInput, readImageEditGatewayResult, type ImageEditResult } from "./ai-image-provider";

export type BrandWatermarkTaskStatus = "queued" | "processing" | "succeeded" | "failed";

export type BrandWatermarkTaskPublicState = {
  createdAt: number;
  error?: string;
  message: string;
  status: BrandWatermarkTaskStatus;
  taskId: string;
  updatedAt: number;
};

type BrandWatermarkTask = BrandWatermarkTaskPublicState & {
  result?: ImageEditResult;
};

const brandWatermarkTasks = new Map<string, BrandWatermarkTask>();
const taskTtlMs = 30 * 60 * 1000;

type CreateBrandWatermarkTaskOptions = {
  logoSize: number;
  runAiGatewayTask?: typeof runAiGatewayTask;
  userId: string;
};

export function createBrandWatermarkTask(image: File, logo: File, options: CreateBrandWatermarkTaskOptions) {
  cleanupBrandWatermarkTasks();

  const now = Date.now();
  const taskId = randomUUID();
  const task: BrandWatermarkTask = {
    createdAt: now,
    message: "已提交，等待 AI 生成 Logo 水印图。",
    status: "queued",
    taskId,
    updatedAt: now
  };

  brandWatermarkTasks.set(taskId, task);
  void processBrandWatermarkTask(taskId, image, logo, options);

  return toPublicState(task);
}

export function getBrandWatermarkTask(taskId: string) {
  cleanupBrandWatermarkTasks();

  const task = brandWatermarkTasks.get(taskId);

  return task ? toPublicState(task) : null;
}

export function getBrandWatermarkTaskResult(taskId: string) {
  cleanupBrandWatermarkTasks();

  const task = brandWatermarkTasks.get(taskId);

  if (!task || task.status !== "succeeded" || !task.result) {
    return null;
  }

  return task.result;
}

async function processBrandWatermarkTask(taskId: string, image: File, logo: File, options: CreateBrandWatermarkTaskOptions) {
  updateTask(taskId, {
    message: "正在生成右下角 Logo 水印图。",
    status: "processing"
  });

  try {
    const gatewayTask = await (options.runAiGatewayTask ?? runAiGatewayTask)(
      await buildBrandWatermarkGatewayInput({ image, logo, logoSize: options.logoSize }, options.userId)
    );
    const result = readImageEditGatewayResult(gatewayTask.result);
    updateTask(taskId, {
      message: "AI Logo 水印图已完成。",
      result,
      status: "succeeded"
    });
  } catch (error) {
    updateTask(taskId, {
      error: error instanceof Error ? error.message : "AI Logo 水印生成失败，请稍后再试。",
      message: "AI Logo 水印生成失败。",
      status: "failed"
    });
  }
}

function updateTask(taskId: string, patch: Partial<BrandWatermarkTask>) {
  const task = brandWatermarkTasks.get(taskId);

  if (!task) {
    return;
  }

  brandWatermarkTasks.set(taskId, {
    ...task,
    ...patch,
    updatedAt: Date.now()
  });
}

function toPublicState(task: BrandWatermarkTask): BrandWatermarkTaskPublicState {
  return {
    createdAt: task.createdAt,
    error: task.error,
    message: task.message,
    status: task.status,
    taskId: task.taskId,
    updatedAt: task.updatedAt
  };
}

function cleanupBrandWatermarkTasks() {
  const expiresBefore = Date.now() - taskTtlMs;

  for (const [taskId, task] of brandWatermarkTasks.entries()) {
    if (task.updatedAt < expiresBefore) {
      brandWatermarkTasks.delete(taskId);
    }
  }
}
