import { ChannelPage } from "@/components/ChannelPage";
import { gameItems } from "@/components/portal-data";

export default function GamesPage() {
  return (
    <ChannelPage
      description="益智解谜、策略挑战、休闲放松……无需下载，打开浏览器就能玩。工作累了？来一局。"
      emptyDescription="换个筛选条件，或使用 AI 搜索描述你想玩的游戏。"
      emptyTitle="未找到匹配的游戏"
      filters={[
        { label: "全部", value: "all" },
        { label: "益智", value: "puzzle" },
        { label: "休闲", value: "casual" },
        { label: "策略", value: "strategy" }
      ]}
      kicker="独立游戏站"
      items={gameItems}
      searchPlaceholder="搜索游戏，例如：麻将"
      title="碎片时间，玩个痛快"
      variant="games"
    />
  );
}
