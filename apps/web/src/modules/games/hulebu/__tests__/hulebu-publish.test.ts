import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../..");

function readWebFile(relativePath: string) {
  return readFileSync(path.join(webRoot, relativePath), "utf8");
}

describe("hulebu web game publishing", () => {
  it("exposes a Next.js game route with an outer shell around the static demo", () => {
    const route = readWebFile("src/app/games/hulebu/page.tsx");
    const component = readWebFile("src/modules/games/hulebu/HulebuGamePage.tsx");

    expect(route).toContain("HulebuGamePage");
    expect(component).toContain('"use client"');
    expect(component).toContain("开始挑战");
    expect(component).toContain("继续本轮");
    expect(component).toContain("升级");
    expect(component).toContain("备用槽");
    expect(component).toContain("满槽护符");
    expect(component).toContain("初始道具");
    expect(component).toContain("购买");
    expect(component).toContain("无尽");
    expect(component).toContain("每日");
    expect(component).toContain("结算");
    expect(component).toContain("/games/hulebu-demo/index.html");
    expect(component).toContain('embed: "shell"');
    expect(component).toContain("reserveBonus");
    expect(component).toContain("shieldBonus");
    expect(component).toContain("toolBonus");
    expect(component).toContain("bestEndlessLayer");
    expect(component).toContain("开始无尽");
    expect(component).toContain("无尽最高");
    expect(component).toContain('runMode: "endless"');
    expect(component).toContain('mode: "endless"');
    expect(component).toContain('startLayer: "21"');
    expect(component).toContain("dailyBestLevels");
    expect(component).toContain("buildDailyFrameSrc");
    expect(component).toContain("开始今日牌局");
    expect(component).toContain('runMode: "daily"');
    expect(component).toContain('mode: "daily"');
    expect(component).toContain("dailySeed");
    expect(component).toContain("今日最佳");
    expect(component).toContain("achievements");
    expect(component).toContain("成就图鉴");
    expect(component).toContain("mainline-first-clear");
    expect(component).toContain("endless-first-step");
    expect(component).toContain("daily-first-checkin");
    expect(component).toContain("高阶周目");
    expect(component).toContain("bestAscensionLevel");
    expect(component).toContain("东风场");
    expect(component).toContain("南风场");
    expect(component).toContain("/api/games/hulebu/progress");
    expect(component).toContain("账号进度同步失败");
    expect(component).toContain("账号进度保存失败");
    expect(component).not.toContain("图鉴现在先作为完整体验版壳层入口保留");
    expect(component).toContain("<iframe");
  });

  it("publishes the current playable HTML demo as static web assets", () => {
    const demo = readWebFile("public/games/hulebu-demo/index.html");
    const tuner = readWebFile("public/games/hulebu-demo/tuner.html");

    expect(demo).toContain("<title>胡了卜玩家试玩</title>");
    expect(demo).toContain('<body class="play-view" data-prototype-view="play">');
    expect(demo).toContain('href="./tuner.html"');
    expect(demo).toContain('fetch("/games/hulebu-demo/config/levels.json")');
    expect(demo).toContain('fetch("/games/hulebu-demo/config/rewards.json")');
    expect(demo).toContain("embed-shell");
    expect(demo).toContain('source: "hulebu-demo-shell"');
    expect(demo).toContain("hulebu:run-progress");
    expect(demo).toContain("hulebu:run-complete");
    expect(demo).toContain("hulebu:run-failed");
    expect(demo).toContain("reserveBonus");
    expect(demo).toContain("shieldBonus");
    expect(demo).toContain("toolBonus");
    expect(demo).toContain("ENDLESS_START_LAYER = 21");
    expect(demo).toContain('runMode: "mainline"');
    expect(demo).toContain("function isEndlessMode()");
    expect(demo).toContain("function isDailyMode()");
    expect(demo).toContain("function getDailyDifficultyProfile");
    expect(demo).toContain("function getDailyLevelIndex");
    expect(demo).toContain("function getEndlessLayerOrder");
    expect(demo).toContain("function advanceAfterEndlessClear");
    expect(demo).toContain("endlessLayer");
    expect(demo).toContain('requestedMode === "daily"');
    expect(demo).toContain("dailySeed");
    expect(demo).toContain("每日牌局");
    expect(demo).toContain("reward-route");
    expect(demo).toContain("胡流");
    expect(demo).toContain("信息流");
    expect(demo).toContain("吃流");
    expect(demo).toContain("道具流");
    expect(demo).toContain("ascension");
    expect(demo).toContain("高阶周目");
    expect(demo).toContain("东风场");
    expect(demo).toContain("南风场");
    expect(tuner).toContain("<title>胡了卜调牌器</title>");
    expect(readWebFile("public/games/hulebu-demo/config/levels.json")).toContain('"displayName": "胡了卜"');
    expect(readWebFile("public/games/hulebu-demo/config/rewards.json")).toContain('"rewards"');
  });

  it("links the games station and search entry to the playable page", () => {
    const portalData = readWebFile("src/components/portal-data.ts");
    const appHeader = readWebFile("src/components/AppHeader.tsx");

    expect(portalData).toContain('href: "/games/hulebu"');
    expect(portalData).toContain('href: "/games/hulebu",\n    icon: "M"');
    expect(appHeader).toContain('pathname.startsWith("/games/hulebu")');
  });
});
