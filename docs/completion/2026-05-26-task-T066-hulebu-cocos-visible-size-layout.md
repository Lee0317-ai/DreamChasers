# T066：胡了卜 Cocos 真实可见尺寸自适应完成记录

- 任务编号：T066
- 负责人：Codex / 开发 B
- 完成日期：2026-05-26

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuSampleSceneModel.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/ComboBarBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/HudBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T066-hulebu-cocos-visible-size-layout.md`
- `docs/tasks/claims/T066-codex.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-05-26.md`
- `docs/completion/2026-05-26-task-T066-hulebu-cocos-visible-size-layout.md`

## 实现内容

- 新增 Cocos 运行时布局解析：读取 `game.canvas.clientWidth/clientHeight`、`view.getVisibleSize()` 和 DPR，输出统一布局宽高、CSS 宽高和缩放值。
- `GameSceneController` 改为按运行时可见尺寸设置 Canvas host，避免固定设计分辨率和 Web Preview 实际 CSS 尺寸不一致。
- Board、Slot、Combo、HUD Binder 统一使用运行时布局和缩放值，保证 iPhone 预览中 HUD、牌山、组合按钮和 8 格主槽保持可读。
- 处理 Cocos 预览中新增脚本目录导致的资产缓存残留，最终把布局工具收回既有 `HulebuSampleSceneModel.ts`，避免预览出现新的 `Missing class`。
- 补充 `mahjong-cocos-project` 测试，保护运行时布局、Binder 接入和移动布局口径。

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run test -w packages/shared -- mahjong
npm run typecheck -w packages/shared
npm run docs:sync
git diff --check
```

## 验证结果

- `mahjong-cocos-project`：1 个测试文件、4 个测试通过。
- Cocos 工程脚本 TypeScript 检查通过。
- `mahjong` 回归：5 个测试文件、35 个测试通过。
- `packages/shared` 类型检查通过。
- `docs:sync` 已同步 32 个任务分片和 32 个领取分片。
- `git diff --check` 通过。
- 已在 Cocos Web Preview 的 iPhone 机型中人工复核，HUD 位于顶部、牌山居中、组合按钮和 8 格主槽位于底部且可读；浏览器错误日志未出现新的 `Missing class`。

## 遗留问题

- 当前仍是占位视觉和本地测试 scene model，尚未接入最终概念图美术、真实牌面 prefab、动画和音效。
- 下一步建议新开任务做目标图方向的 Cocos 首屏视觉壳，再接真实配置和点击入槽链路。
