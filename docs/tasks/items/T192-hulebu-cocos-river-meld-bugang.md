# T192：胡了卜 Cocos 有限牌河、明牌组和补杠基础迁移

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 来源：IDEA-20260628-04

## 背景

T190/T191 已完成 Cocos 首屏 v6 视觉资源接入。当前 Cocos runtime 仍缺 Web 版本已有的有限牌河、明牌区和补杠结构。本任务把这些核心玩法状态先迁进 Cocos。

## 目标

1. Scene model 增加 `riverNodes` 和 `openMeldNodes`。
2. Runtime 增加 `river / riverLimit / openMelds` 状态。
3. Combo 增加 `bugang` 类型。
4. 执行 `碰 / 杠 / 补杠 / 胡` 时更新明牌和牌河基础状态。
5. 新增 Cocos Binder 渲染明牌区和牌河。

## 不做

- 不实现完整工具按钮交互。
- 不追 Boss、事件、无尽、每日、高阶和账号局外成长。
- 不重建 Cocos 项目。
- 不改 Web 玩法或原型逻辑。

## 允许修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`
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
- 完成内容：Cocos scene model/runtime 已接有限牌河、明牌组和补杠基础结构；新增 `MeldRiverLayerBinder` 渲染牌河和明牌区。
- 验证结果：全部验证命令通过。
