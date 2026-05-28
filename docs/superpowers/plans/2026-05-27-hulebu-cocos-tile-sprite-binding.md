# 胡了卜 Cocos 牌面 SpriteFrame 绑定第一版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 Cocos 牌山优先使用 `assets/resources/ui/mahjong-tiles/` 中已归档的麻将图片 SpriteFrame，并在加载失败时保留当前程序化占位牌。

**Architecture:** 新增一个很薄的 Cocos 资源 catalog，负责把 `tile.wan.2`、`tile.tong.9` 等 `prefabKey` 映射到 `resources.load` 可读取的 SpriteFrame 路径。`BoardLayerBinder` 继续负责牌节点创建和交互，只在现有程序化底牌之上增加 `TileArt` 子节点；图片加载成功后隐藏文字标签，失败时显示原文字牌面。

**Tech Stack:** Cocos Creator 3.8.8、TypeScript、Cocos `resources.load`、`SpriteFrame`、Vitest 结构测试。

---

### Task 1: Lock The Sprite Catalog Contract

**Files:**
- Modify: `packages/shared/src/mahjong-cocos-project.test.ts`

- [ ] **Step 1: Write the failing test**

Add a test that requires `assets/scripts/assets/HulebuTileSpriteCatalog.ts`, checks that it maps representative tile keys to `ui/mahjong-tiles/.../spriteFrame`, and checks that `BoardLayerBinder` references `TileArt`, `Sprite`, `SpriteFrame`, `prefabKey`, and fallback label logic.

- [ ] **Step 2: Run the focused test**

Run: `npm run test -w packages/shared -- mahjong-cocos-project`

Expected: the new test fails because `HulebuTileSpriteCatalog.ts` does not exist yet.

### Task 2: Add The Cocos Sprite Catalog

**Files:**
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets.meta`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`
- Create: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts.meta`

- [ ] **Step 1: Implement the minimal catalog**

Create a static `HULEBU_TILE_SPRITE_FRAME_PATHS` map for all 27 number tiles and 7 honor tiles. Convert manifest targets such as `tiles/numbered/tong/tong-09.png` into Cocos resource paths such as `ui/mahjong-tiles/tiles/numbered/tong/tong-09/spriteFrame`.

- [ ] **Step 2: Add cached asynchronous loading**

Expose `loadTileSpriteFrame(tileKey, callback)` using Cocos `resources.load(path, SpriteFrame, callback)`. Cache successful loads and coalesce duplicate pending callbacks.

### Task 3: Render Board Tiles With Image-First Fallback

**Files:**
- Modify: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`

- [ ] **Step 1: Add a `TileArt` child node**

Ensure each board tile has a `TileArt` child with a `Sprite` and `UITransform` sized to the current tile bounds.

- [ ] **Step 2: Load by `model.prefabKey`**

When applying a tile, reset the art node, show the label, then call the catalog with `model.prefabKey`. If a SpriteFrame arrives and the node still represents the same key, set `sprite.spriteFrame`, show `TileArt`, and hide the label.

- [ ] **Step 3: Preserve gameplay fallback**

If the key is missing or the asset load fails, leave the original drawn tile and label visible so clicks, dimming, and button state still work.

### Task 4: Verify And Document

**Files:**
- Modify: `docs/tasks/items/T073-hulebu-cocos-tile-sprite-binding.md`
- Modify: `docs/tasks/claims/T073-codex.md`
- Modify: `docs/modules/mahjong-roguelike/PROGRESS.md`
- Modify: `docs/modules/mahjong-roguelike/HANDOFF.md`
- Modify: `docs/progress/2026-05-27.md`
- Create: `docs/completion/2026-05-27-task-T073-hulebu-cocos-tile-sprite-binding.md`

- [ ] **Step 1: Run automated verification**

Run:

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run test -w packages/shared -- mahjong
npm run typecheck -w packages/shared
npm run docs:sync
git diff --check
```

- [ ] **Step 2: Run Cocos Preview verification**

In Cocos Web Preview mobile viewport, confirm that the first level still opens, visible board tiles use image-backed art where resources exist, clicking the top `9筒` tiles still enters the 8-slot tray, `碰` still clears them, and the lower `2万` tiles become clickable.

- [ ] **Step 3: Update task docs**

Mark T073 as `待验收`, record verification results and remaining work. Keep remaining work limited to full Tile prefab polish, slot image replacement, reward flow, Boss progress, and 20-level runtime.
