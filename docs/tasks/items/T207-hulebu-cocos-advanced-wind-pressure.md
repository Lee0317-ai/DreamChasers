# T207 胡了卜 Cocos 高阶风场压力基础

- 任务编号：T207
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T205 已在 Cocos 胡了卜中加入高阶入口和东/南/西/北四档 profile，但进入局内后四档只改变关卡轮换，没有形成实际玩法压力。Web 侧高阶规划已明确存在减少工具、禁洗牌、禁看山等压力规则，Cocos 需要补齐基础版本。

## 目标

1. 为东风场、南风场、西风场、北风场定义稳定的压力配置。
2. 高阶模式每一关开局自动叠加对应风场压力。
3. 工具数量和禁用状态通过现有 HUD/runtime 自然反映。
4. 补充静态回归测试，锁定配置和控制器接入点。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-207-hulebu-cocos-advanced-wind-pressure.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页。
- 不改账号存档、联网同步或排行榜。
- 不新增完整高阶奖励/能力系统。
- 不替换 Cocos 美术资源。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 四个风场都有明确压力配置。
- 高阶开局后每一关都会合并风场压力与关前事件。
- 南风及以上能体现禁用/扣减工具的差异。
- 回归测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- 完成时间：2026-06-29
- 实现内容：新增东/南/西/北四档高阶风场压力配置，并在 Cocos 关卡启动时把风场压力与本关特殊事件合并传入 runtime。
- 规则效果：东风看山 -1；南风禁洗牌并看山 -1；西风禁洗牌并撤回/看山 -1；北风禁洗牌和看山，并撤回/打牌 -1。
- 验证结果：专项测试和 Cocos TypeScript 编译已通过，文档同步与 diff 检查在收尾命令执行。
