# Hulebu Cocos V6 Visual Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 接入 Web v6 视觉资源到 Cocos，并用测试锁定全量牌面与关键 UI 资源映射。

**Architecture:** 复用现有 Cocos Creator 3.8.8 工程和 `resources.load(.../spriteFrame)` 机制，在 `assets/resources/ui/v6/` 下放置 Web v6 PNG。Cocos 运行时仍通过 `HulebuTileSpriteCatalog` 获取牌面 SpriteFrame，BoardLayer 继续保留程序化 fallback。

**Tech Stack:** Cocos Creator 3.8.8、TypeScript、Vitest、Node.js。

---

### Task 1: 复制 v6 资源并生成 Cocos meta

**Files:**
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/**`

- [ ] **Step 1: Copy resources**

Run a Node script to copy PNG files from `apps/web/public/games/hulebu-demo/assets/ui-v6/` to Cocos `assets/resources/ui/v6/`.

- [ ] **Step 2: Generate meta files**

Generate directory `.meta` and PNG `.meta` files so Cocos can expose each PNG as a SpriteFrame under `resources`.

### Task 2: Switch tile catalog to v6

**Files:**
- Modify: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`

- [ ] **Step 1: Replace path table**

Map `tile.wan.*`, `tile.tiao.*`, `tile.tong.*` and `tile.honor.*` to `ui/v6/tiles/mahjong/.../spriteFrame`.

### Task 3: Keep stack hints behind v6 tile art

**Files:**
- Modify: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`

- [ ] **Step 1: Adjust sibling order**

Ensure `StackDepthHint` does not draw above the full v6 tile image.

### Task 4: Add regression coverage

**Files:**
- Modify: `packages/shared/src/mahjong-cocos-project.test.ts`

- [ ] **Step 1: Update expected catalog paths**

Replace old refreshed path assertions with v6 path assertions.

- [ ] **Step 2: Add v6 asset existence and dimension checks**

Assert all 34 tile PNGs exist, have `.meta`, are RGBA PNGs, and that `tile.tiao.6` maps to `tile_bamboo_06`.

### Task 5: Verify and document

**Files:**
- Modify: `docs/modules/mahjong-roguelike/README.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-06-28-lee.md`

- [ ] **Step 1: Run validation**

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run docs:sync
git diff --check
```

- [ ] **Step 2: Record result**

Record the resource import and verification result in module docs and daily progress.
