# T277：胡了卜 Cocos 完整局外 UI 接入完成记录

- 任务编号：T277
- 负责人：Lee
- 完成时间：2026-08-12
- 状态：已完成

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/formal-v1/meta-flow/**`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuMetaFlowUiCatalog.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T277-hulebu-cocos-meta-flow-ui-integration.md`
- `docs/tasks/claims/T277-lee.md`

## 实现内容

- 将 T273-T275 交付的 40 个透明 PNG 组件导入 Cocos `resources`，补齐 Creator 3.8.8 资源元数据并建立统一目录表。
- 将无进行中牌局时的首屏替换为正式标题页，接通游客和账号入口到正式大厅。
- 接入正式大厅、模式选择、主线章节地图和成功结算页面；复用原有存档、无尽、每日、高阶、图鉴、成长及新手教学逻辑。
- 主线入口先进入章节地图，当前节点进入既有流派选择流程，锁定节点保持不可进入。
- 使用单一全屏触摸目标和显式命中区域分发局外页面交互，避免 Cocos 子节点事件重复触发最后一个按钮。
- 修正所有局外资源的竖屏顶部坐标换算、模式卡标题和状态标签对比度。

## 验证命令

- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm exec -w packages/shared vitest -- run mahjong-cocos-project --reporter=json --outputFile=.codex-tmp/t277-vitest.json`
- `npm run game:hulebu:build`
- `npm run game:hulebu:verify-build`
- `git diff --check`

## 验证结果

- Cocos TypeScript 检查通过。
- `mahjong-cocos-project` 41 项测试全部通过。
- exact-commit production build 通过，构建 ID：`577ca485e380-20260811T194230Z`，源码状态为 `clean`，资源 smoke check 全部返回 200。
- verify-only 通过。
- 在 `390×844` 浏览器中完成标题页、大厅、空白区域、模式选择、主线地图、当前节点和有存档大厅入口的逐项点击验证，无误触、遮挡或文字不可见问题。
- UTF-8 无 BOM 与 `git diff --check` 通过。

## 遗留问题

- 当前游戏控制器没有可触发的失败结算事件，因此失败印章、失败标题和次级按钮仅完成资源导入与目录登记，未虚构失败流程；后续失败状态落地时可直接复用这些资源。
- 本任务未修改关卡数值、牌山生成、组合判定、计分、存档协议、横屏和微信小游戏 SDK。
