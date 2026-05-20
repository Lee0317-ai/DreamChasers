import { ChannelPage } from "@/components/ChannelPage";
import { gameItems } from "@/components/portal-data";

export default function GamesPage() {
  return (
    <ChannelPage
      description="碎片时间玩一局，益智解压不沉迷。全部免费，无需下载。"
      emptyDescription="换个筛选条件，或使用 AI 搜索描述你想玩的游戏。"
      emptyTitle="未找到匹配的游戏"
      filters={[
        { label: "全部", value: "all" },
        { label: "益智", value: "puzzle" },
        { label: "休闲", value: "casual" },
        { label: "策略", value: "strategy" }
      ]}
      items={gameItems}
      searchPlaceholder="搜索游戏，例如：麻将"
      title="休闲游戏"
    />
  );
}
