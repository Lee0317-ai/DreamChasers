import { PdfToolbox } from "@/modules/tools/pdf-toolbox";

export const metadata = {
  title: "PDF 工具箱 | DreamChasers",
  description: "浏览器内完成 PDF 合并、拆分、删除、排序和旋转。"
};

export default function PdfToolboxPage() {
  return <PdfToolbox />;
}
