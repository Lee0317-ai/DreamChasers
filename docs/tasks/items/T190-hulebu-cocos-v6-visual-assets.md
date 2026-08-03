# T190：胡了卜 Cocos 首轮视觉资源接入

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 来源：IDEA-20260628-02

## 背景

T189 已确认旧 Cocos Creator 3.8.8 工程可复用。用户要求开始接入 Cocos，本任务先做第一步：将 Web 当前 v6 UI 资源接入 Cocos resources，并让 Cocos 牌面 catalog 使用 v6 全量牌面。

## 目标

1. 复制 Web v6 牌面、按钮、HUD 和槽位 PNG 到 Cocos resources。
2. 将 Cocos `HulebuTileSpriteCatalog` 切到 v6 牌面 SpriteFrame 路径。
3. 用测试锁定 34 张牌面资源、关键 UI 资源和 `6条` 路径。
4. 保持点击入槽、组合消除、遮挡解锁既有链路不回退。

## 不做

- 不追平 Boss、事件、无尽、每日、高阶和账号局外成长。
- 不重建 Cocos 项目。
- 不改 Web 玩法或原型逻辑。
- 不改 PDF、AI 修图、TimePick 或部署。

## 允许修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/**`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-28-lee.md`
- `docs/superpowers/plans/2026-06-28-hulebu-cocos-v6-visual-assets.md`

## 禁止修改文件

- `apps/web/**`，除非只读取资源来源。
- `apps/game/mahjong-roguelike/prototypes/**`
- `apps/web/prisma/**`
- PDF、AI 修图、TimePick、部署相关文件

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run docs:sync
git diff --check
```

## 完成记录

- 完成时间：2026-06-28
- 完成内容：Cocos 新增 `assets/resources/ui/v6/` 资源树；牌面 catalog 切到 v6；组合按钮加载 v6 图片并保留 fallback；共享测试覆盖 34 张牌面和关键 UI 资源。
- 验证结果：全部验证命令通过。
