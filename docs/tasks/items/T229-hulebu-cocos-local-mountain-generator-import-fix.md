# T229：胡了卜 Cocos 预览跨工作区生成器导入修复

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 来源：IDEA-20260629-17

## 背景

Cocos Web Preview 报错：以 `HulebuLevelConfig.ts` 为入口找不到 `../../../../../../../../packages/shared/src/mahjong-mountain-generator`。当前 Cocos 配置层直接 import 工作区外 shared TS 源文件，本地 `tsc` 能解析，但 Cocos 预览运行时不会把工程外 `packages/shared` 纳入模块图。

## 目标

1. Cocos 配置层不再直接 import `packages/shared/src/mahjong-mountain-generator`。
2. Cocos 工程内提供可被 Creator/Web Preview 解析的本地牌山生成器模块。
3. 保留当前 `generateHulebuMountain()` 输入输出口径，让现有关卡配置生成逻辑继续工作。
4. 共享静态测试覆盖此类跨工作区 import，避免后续复发。

## 不做

- 不改 Web 原型、站内静态 Demo、Prisma 或账号接口。
- 不重做完整牌山生成算法或调参体系。
- 不扩大到 UI 美术、动效或场景树重建。

## 允许修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuMountainGenerator.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/**`

## 禁止修改文件

- `apps/web/**`
- `apps/game/mahjong-roguelike/prototypes/**`
- `apps/web/public/games/hulebu-demo/**`
- `apps/web/prisma/**`
- PDF、AI 修图、TimePick、部署相关文件

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run docs:sync
git diff --check
```

## 当前进展

- 已完成修复。Cocos 工程内新增 `assets/scripts/config/HulebuMountainGenerator.ts`，`HulebuLevelConfig.ts` 改为导入本地模块，不再跨出工程引用 `packages/shared/src/mahjong-mountain-generator`。
- 已补共享静态测试扫描 Cocos 脚本，防止后续再次直接 import `packages/shared/src/`。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`rg -n "packages/shared/src|mahjong-mountain-generator" apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts || true` 无结果。
