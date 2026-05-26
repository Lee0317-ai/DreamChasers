import type { Metadata } from "next";
import { PhotoEditorWorkspace } from "@/components/tools/photo/PhotoEditorWorkspace";

export const metadata: Metadata = {
  title: "AI 修图工具 | DreamChasers",
  description: "DreamChasers AI 修图工具前端工作台，支持基础编辑、创意元素和 AI 修图能力占位。"
};

export default function AiPhotoEditorPage() {
  return <PhotoEditorWorkspace />;
}
