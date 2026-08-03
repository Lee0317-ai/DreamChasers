# T191：胡了卜 Cocos v6 HUD 槽位和工具按钮绑定

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 来源：IDEA-20260628-03

## 背景

T190 已完成 v6 资源复制、牌面 catalog 切换和组合按钮 Sprite 接入。本任务继续把剩余首屏 UI 接到 Cocos：手牌槽、HUD 徽章、记牌器宽条和右侧工具按钮。

## 目标

1. `SlotLayerBinder` 使用 v6 `hand_slots_8` 做主槽背板。
2. `HudBinder` 使用 v6 `tile_counter_wide / level_badge / score_badge` 做 HUD 背板。
3. `GameSceneController` 右侧工具按钮优先加载 v6 `tool_shuffle / tool_undo / tool_hint`。
4. 所有新 Sprite 绑定保留程序化 fallback。
5. 共享测试锁定脚本引用和资源路径。

## 不做

- 不实现工具按钮真实道具逻辑。
- 不追 Boss、事件、无尽、每日、高阶和账号局外成长。
- 不重建 Cocos 项目。
- 不改 Web 玩法或原型逻辑。

## 允许修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/HudBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-28-lee.md`

## 禁止修改文件

- `apps/web/**`
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
- 完成内容：Cocos 主槽背板、HUD 背板和右侧工具按钮已接 v6 Sprite，且保留程序化 fallback。
- 验证结果：全部验证命令通过。
