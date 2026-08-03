# T226 胡了卜 Cocos 账号进度桥接基础

- 任务编号：T226
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T215-T225 已让 Cocos 正式工程具备本地 `activeRun / lastSettlement / metaProfile / metaProgress / achievements` 闭环，但这些状态仍只写本地存储。Web `/games/hulebu` 已有登录账号下的 `HulebuProgress` 读写 API，继续把现有体验搬进 Cocos 时，下一步最值当的是先接一条账号进度桥。

## 目标

1. 为 Cocos 增加浏览器环境下的账号进度同步 helper。
2. 复用现有 `/api/games/hulebu/progress`，桥接局外铜钱、六轴成长、无尽最高层、每日最佳/连续参与、成就和当前本轮快照。
3. 大厅启动或返回局外时尝试拉取账号进度并合并到本地。
4. 本地长期状态变化时尝试把映射后的最小字段推回账号。
5. 未登录、离线或接口失败时保持本地档正常可玩。
6. 补共享静态测试和回归验证。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-226-hulebu-cocos-account-progress-bridge-foundation.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或站内静态 Demo。
- 不修改 `apps/web/prisma/**`、`apps/web/src/app/api/games/hulebu/progress/route.ts` 或账号中心页面。
- 不新增服务端 `lastSettlement / bestMainlineLevel` 字段。
- 不做完整跨设备中局冲突解决，只桥接当前可映射的最小账号字段。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- Cocos 在浏览器环境下可尝试调用 `/api/games/hulebu/progress`。
- 本地 `metaCoins / metaUpgrades / metaProgress / achievements / activeRun` 与账号字段完成最小映射。
- 大厅启动或回到局外时会尝试拉取账号进度并合并；本地状态变化时会尝试推回。
- 未登录、接口不可用或请求失败时，不阻断本地 run、局外成长和继续本轮。
- 共享静态测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成情况

- `GameSceneController` 已新增浏览器环境下的账号进度同步 helper，并复用现有 `/api/games/hulebu/progress`。
- Cocos 现在会在大厅启动或回到局外时尝试拉取账号进度，并将局外铜钱、六轴成长、无尽最高层、每日最佳/连续参与、成就与当前本轮快照做最小合并。
- 本地 `metaProfile / metaProgress / achievements / activeRun` 变化时会做轻量防抖推送；未登录或接口不可用时会回退本地档，不阻断游玩。
- 生涯总览已补一个轻量账号同步状态文案，便于判断当前是账号档还是本地档。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
