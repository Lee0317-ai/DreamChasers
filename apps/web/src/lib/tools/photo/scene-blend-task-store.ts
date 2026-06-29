import { randomUUID } from "node:crypto";
import { runAiGatewayTask } from "../../ai/ai-gateway";
import { buildSceneBlendGatewayInput, readImageEditGatewayResult, type ImageEditResult } from "./ai-image-provider";

export type SceneBlendTaskStatus = "queued" | "processing" | "succeeded" | "failed";

export type SceneBlendTaskPublicState = {
  createdAt: number;
  error?: string;
  message: string;
  status: SceneBlendTaskStatus;
  taskId: string;
  updatedAt: number;
};

type SceneBlendTask = SceneBlendTaskPublicState & {
  result?: ImageEditResult;
};

const sceneBlendTasks = new Map<string, SceneBlendTask>();
const taskTtlMs = 30 * 60 * 1000;

type CreateSceneBlendTaskOptions = {
  runAiGatewayTask?: typeof runAiGatewayTask;
  userId: string;
};

export function createSceneBlendTask(productImage: File, backgroundImage: File, prompt: string, options: CreateSceneBlendTaskOptions) {
  cleanupSceneBlendTasks();

  const now = Date.now();
  const taskId = randomUUID();
  const task: SceneBlendTask = {
    createdAt: now,
    message: "已提交，等待 AI 场景融合处理。",
    status: "queued",
    taskId,
    updatedAt: now
  };

  sceneBlendTasks.set(taskId, task);
  void processSceneBlendTask(taskId, productImage, backgroundImage, prompt, options);

  return toPublicState(task);
}

export function getSceneBlendTask(taskId: string) {
  cleanupSceneBlendTasks();

  const task = sceneBlendTasks.get(taskId);

  return task ? toPublicState(task) : null;
}

export function getSceneBlendTaskResult(taskId: string) {
  cleanupSceneBlendTasks();

  const task = sceneBlendTasks.get(taskId);

  if (!task || task.status !== "succeeded" || !task.result) {
    return null;
  }

  return task.result;
}

async function processSceneBlendTask(
  taskId: string,
  productImage: File,
  backgroundImage: File,
  prompt: string,
  options: CreateSceneBlendTaskOptions
) {
  updateTask(taskId, {
    message: "正在融合产品和背景光影。",
    status: "processing"
  });

  try {
    const gatewayTask = await (options.runAiGatewayTask ?? runAiGatewayTask)(
      await buildSceneBlendGatewayInput({ backgroundImage, productImage, prompt }, options.userId)
    );
    const result = readImageEditGatewayResult(gatewayTask.result);
    updateTask(taskId, {
      message: "AI 溶图已完成。",
      result,
      status: "succeeded"
    });
  } catch (error) {
    updateTask(taskId, {
      error: error instanceof Error ? error.message : "AI 溶图生成失败，请稍后再试。",
      message: "AI 溶图生成失败。",
      status: "failed"
    });
  }
}

function updateTask(taskId: string, patch: Partial<SceneBlendTask>) {
  const task = sceneBlendTasks.get(taskId);

  if (!task) {
    return;
  }

  sceneBlendTasks.set(taskId, {
    ...task,
    ...patch,
    updatedAt: Date.now()
  });
}

function toPublicState(task: SceneBlendTask): SceneBlendTaskPublicState {
  return {
    createdAt: task.createdAt,
    error: task.error,
    message: task.message,
    status: task.status,
    taskId: task.taskId,
    updatedAt: task.updatedAt
  };
}

function cleanupSceneBlendTasks() {
  const expiresBefore = Date.now() - taskTtlMs;

  for (const [taskId, task] of sceneBlendTasks.entries()) {
    if (task.updatedAt < expiresBefore) {
      sceneBlendTasks.delete(taskId);
    }
  }
}
