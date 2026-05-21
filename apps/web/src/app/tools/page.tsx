import { ChannelPage } from "@/components/ChannelPage";
import { toolItems } from "@/components/portal-data";

export default function ToolsPage() {
  return (
    <ChannelPage
      description="PDF 处理、图像编辑、格式转换……全部免费，浏览器内完成，无需上传服务器。"
      emptyDescription="换个筛选条件，或使用 AI 搜索描述你的需求。"
      emptyTitle="未找到匹配的工具"
      filters={[
        { label: "全部", value: "all" },
        { label: "文档处理", value: "doc" },
        { label: "图像处理", value: "img" },
        { label: "AI 能力", value: "ai" },
        { label: "格式转换", value: "convert" }
      ]}
      kicker="Free · Browser-based · Privacy-first"
      items={toolItems}
      searchPlaceholder="搜索工具，例如：PDF 转 Word"
      title="工作效率，一键搞定"
      variant="tools"
    />
  );
}
