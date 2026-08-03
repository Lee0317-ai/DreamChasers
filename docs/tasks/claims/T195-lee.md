# T195 领取记录：胡了卜 Cocos 洗牌和撤回真实交互

- 任务编号：T195
- 任务名称：胡了卜 Cocos 洗牌和撤回真实交互
- 负责人：Lee
- 领取时间：2026-06-28
- 状态：已完成

## 文件范围

允许修改：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-28-lee.md`

禁止修改：

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
- 结果：已完成 Cocos 洗牌和撤回真实交互。
