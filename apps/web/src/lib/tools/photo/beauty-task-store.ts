import { randomUUID } from "node:crypto";
import { runNaturalPortraitBeauty, type ImageEditResult } from "./ai-image-provider";

export type BeautyTaskStatus = "queued" | "processing" | "succeeded" | "failed";

export type BeautyTaskPublicState = {
  createdAt: number;
  error?: string;
  message: string;
  status: BeautyTaskStatus;
  taskId: string;
  updatedAt: number;
};

type BeautyTask = BeautyTaskPublicState & {
  result?: ImageEditResult;
};

const beautyTasks = new Map<string, BeautyTask>();
const taskTtlMs = 30 * 60 * 1000;

export function createBeautyTask(image: File) {
  cleanupBeautyTasks();

  const now = Date.now();
  const taskId = randomUUID();
  const task: BeautyTask = {
    createdAt: now,
    message: "已提交，等待 AI 图片服务处理。",
    status: "queued",
    taskId,
    updatedAt: now
  };

  beautyTasks.set(taskId, task);
  void processBeautyTask(taskId, image);

  return toPublicState(task);
}

export function getBeautyTask(taskId: string) {
  cleanupBeautyTasks();

  const task = beautyTasks.get(taskId);

  return task ? toPublicState(task) : null;
}

export function getBeautyTaskResult(taskId: string) {
  cleanupBeautyTasks();

  const task = beautyTasks.get(taskId);

  if (!task || task.status !== "succeeded" || !task.result) {
    return null;
  }

  return task.result;
}

async function processBeautyTask(taskId: string, image: File) {
  updateTask(taskId, {
    message: "正在进行自然人像增强。",
    status: "processing"
  });

  try {
    const result = await runNaturalPortraitBeauty(image);
    updateTask(taskId, {
      message: "AI 美颜已完成。",
      result,
      status: "succeeded"
    });
  } catch (error) {
    updateTask(taskId, {
      error: error instanceof Error ? error.message : "AI 美颜生成失败，请稍后再试。",
      message: "AI 美颜生成失败。",
      status: "failed"
    });
  }
}

function updateTask(taskId: string, patch: Partial<BeautyTask>) {
  const task = beautyTasks.get(taskId);

  if (!task) {
    return;
  }

  beautyTasks.set(taskId, {
    ...task,
    ...patch,
    updatedAt: Date.now()
  });
}

function toPublicState(task: BeautyTask): BeautyTaskPublicState {
  return {
    createdAt: task.createdAt,
    error: task.error,
    message: task.message,
    status: task.status,
    taskId: task.taskId,
    updatedAt: task.updatedAt
  };
}

function cleanupBeautyTasks() {
  const expiresBefore = Date.now() - taskTtlMs;

  for (const [taskId, task] of beautyTasks.entries()) {
    if (task.updatedAt < expiresBefore) {
      beautyTasks.delete(taskId);
    }
  }
}
