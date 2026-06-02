import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../..");

function readWebFile(relativePath: string) {
  return readFileSync(path.join(webRoot, relativePath), "utf8");
}

describe("hulebu web game publishing", () => {
  it("exposes a Next.js game route that embeds the static demo", () => {
    const route = readWebFile("src/app/games/hulebu/page.tsx");
    const component = readWebFile("src/modules/games/hulebu/HulebuGamePage.tsx");

    expect(route).toContain("HulebuGamePage");
    expect(component).toContain('src="/games/hulebu-demo/index.html"');
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
