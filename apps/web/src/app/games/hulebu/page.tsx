import type { Metadata } from "next";
import { HulebuGamePage } from "@/modules/games/hulebu/HulebuGamePage";

export const metadata: Metadata = {
  title: "胡了卜 | 休闲游戏馆",
  description: "堆叠麻将、有限牌河、吃碰杠胡组合消除。打开网页即可试玩。"
};

export default function Page() {
  return <HulebuGamePage />;
}
