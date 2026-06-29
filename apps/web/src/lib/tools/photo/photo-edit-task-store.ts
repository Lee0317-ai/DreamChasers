import { randomUUID } from "node:crypto";
import { runAiGatewayTask } from "../../ai/ai-gateway";
import { buildPhotoEditGatewayInput, readImageEditGatewayResult, type ImageEditResult, type PhotoEditMode } from "./ai-image-provider";

export type PhotoEditTaskStatus = "queued" | "processing" | "succeeded" | "failed";

export type PhotoEditTaskPublicState = {
  createdAt: number;
  error?: string;
  message: string;
  status: PhotoEditTaskStatus;
  taskId: string;
  updatedAt: number;
};

type PhotoEditTask = PhotoEditTaskPublicState & {
  result?: ImageEditResult;
};

const photoEditTasks = new Map<string, PhotoEditTask>();
const taskTtlMs = 30 * 60 * 1000;

type CreatePhotoEditTaskOptions = {
  mode: PhotoEditMode;
  prompt?: string;
  runAiGatewayTask?: typeof runAiGatewayTask;
  userId: string;
};

export function createPhotoEditTask(image: File, options: CreatePhotoEditTaskOptions) {
  cleanupPhotoEditTasks();

  const now = Date.now();
  const taskId = randomUUID();
  const task: PhotoEditTask = {
    createdAt: now,
    message: getQueuedMessage(options.mode),
    status: "queued",
    taskId,
    updatedAt: now
  };

  photoEditTasks.set(taskId, task);
  void processPhotoEditTask(taskId, image, options);

  return toPublicState(task);
}

export function getPhotoEditTask(taskId: string) {
  cleanupPhotoEditTasks();

  const task = photoEditTasks.get(taskId);

  return task ? toPublicState(task) : null;
}

export function getPhotoEditTaskResult(taskId: string) {
  cleanupPhotoEditTasks();

  const task = photoEditTasks.get(taskId);

  if (!task || task.status !== "succeeded" || !task.result) {
    return null;
  }

  return task.result;
}

async function processPhotoEditTask(taskId: string, image: File, options: CreatePhotoEditTaskOptions) {
  updateTask(taskId, {
    message: getProcessingMessage(options.mode),
    status: "processing"
  });

  try {
    const gatewayTask = await (options.runAiGatewayTask ?? runAiGatewayTask)(
      await buildPhotoEditGatewayInput({ image, mode: options.mode, prompt: options.prompt }, options.userId)
    );
    const result = readImageEditGatewayResult(gatewayTask.result);
    updateTask(taskId, {
      message: getSucceededMessage(options.mode),
      result,
      status: "succeeded"
    });
  } catch (error) {
    updateTask(taskId, {
      error: error instanceof Error ? error.message : getFailedFallback(options.mode),
      message: getFailedMessage(options.mode),
      status: "failed"
    });
  }
}

function updateTask(taskId: string, patch: Partial<PhotoEditTask>) {
  const task = photoEditTasks.get(taskId);

  if (!task) {
    return;
  }

  photoEditTasks.set(taskId, {
    ...task,
    ...patch,
    updatedAt: Date.now()
  });
}

function toPublicState(task: PhotoEditTask): PhotoEditTaskPublicState {
  return {
    createdAt: task.createdAt,
    error: task.error,
    message: task.message,
    status: task.status,
    taskId: task.taskId,
    updatedAt: task.updatedAt
  };
}

function cleanupPhotoEditTasks() {
  const expiresBefore = Date.now() - taskTtlMs;

  for (const [taskId, task] of photoEditTasks.entries()) {
    if (task.updatedAt < expiresBefore) {
      photoEditTasks.delete(taskId);
    }
  }
}

function getQueuedMessage(mode: PhotoEditMode) {
  return mode === "enhance"
    ? "已提交，等待 AI 高清增强处理。"
    : mode === "repair"
      ? "已提交，等待 AI 细节修复处理。"
      : "已提交，等待 AI 对话修图处理。";
}

function getProcessingMessage(mode: PhotoEditMode) {
  return mode === "enhance"
    ? "正在增强清晰度与细节。"
    : mode === "repair"
      ? "正在修复局部细节。"
      : "正在按指令编辑图片。";
}

function getSucceededMessage(mode: PhotoEditMode) {
  return mode === "enhance" ? "高清增强已完成。" : mode === "repair" ? "AI 细节修复已完成。" : "AI 对话修图已完成。";
}

function getFailedMessage(mode: PhotoEditMode) {
  return mode === "enhance" ? "高清增强生成失败。" : mode === "repair" ? "AI 细节修复生成失败。" : "AI 对话修图生成失败。";
}

function getFailedFallback(mode: PhotoEditMode) {
  return mode === "enhance"
    ? "高清增强生成失败，请稍后再试。"
    : mode === "repair"
      ? "AI 细节修复生成失败，请稍后再试。"
      : "AI 对话修图生成失败，请稍后再试。";
}
