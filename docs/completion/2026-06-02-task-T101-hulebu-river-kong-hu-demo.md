# T101 胡了卜有限牌河、补杠和胡牌奖励试玩 Demo 完成记录

- 任务编号：T101
- 负责人：Lee
- 完成日期：2026-06-02
- 状态：待验收

## 修改文件

- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- `packages/shared/src/mahjong-config.test.ts`
- `docs/tasks/items/T101-hulebu-river-kong-hu-demo.md`
- `docs/tasks/claims/T101-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-02-lee.md`
- `docs/completion/2026-06-02-task-T101-hulebu-river-kong-hu-demo.md`

## 实现内容

- 默认玩家 Demo 新增 `明牌` 和 `牌河` 面板，牌河容量当前为 `3`。
- `丢弃` 改为选择模式，玩家可以点击任意槽位牌打入牌河，不再自动丢末尾牌。
- `碰` 后组合进入明牌区；后续第 4 张同牌会出现 `补杠` 候选，并升级为 4 张明杠。
- `补杠` 只作为孤张出口，不触发强开山；直接 4 张 `杠` 会触发开山，震落 1 张压顶牌为可选桌面牌。
- `胡` 会清空手牌、震落 3 张压顶牌，并清理牌河 1 张。
- 满槽失败判定纳入牌河容量：槽满但牌河未满时继续提示打牌；槽满、无组合、牌河满且无救场时才失败。
- 根据第 5 关试玩反馈修正正式关生成节奏：第 5-10 关自然明杠包提高到每关 2 个；明杠目标牌面从普通填充组中保留出来，避免同一牌面被拆成多个 3 张组。
- 补齐简化听牌提示：距离 `3 + 3 + 2` 胡牌差 1 张显示 `听`，差 2 张显示 `差 ... 可胡`；记牌器高亮牌山仍有的目标牌，目标牌已空时提示降级。
- 第 5-10 关 profile 新增孤张预算，生成器产出后统计未归类解法组风险并校验不超过预算。
- 按 Lee 反馈修正 `杠开山`：明杠和胡牌开山会把压顶牌震落到桌面平铺层，保留为可点击入槽的 `board` 牌，同时解除对下层牌的阻挡，不再直接移出局。
- 按 Lee 继续试玩反馈修正记牌器口径：记牌器只统计牌山 `board` 牌；卡槽、牌河、明牌区和移除区不再计入，震落到桌面的牌仍计入，点入卡槽后立即扣除。
- 将 `吃 / 碰 / 杠 / 补杠 / 胡` 从卡槽行拆出为独立动作栏；卡槽行只保留 8 格卡槽，390px 移动端补底部留白，避免固定道具栏遮盖卡槽。
- 根据 Lee 发布前反馈控制开山强度和可读性：`杠` 震落 1 张，`胡` 震落 3 张；默认玩家页隐藏内部标题栏，修正旧 grid 行撑高记牌器的问题，牌面回到 390px 下约 `40x54`，记牌器改成每个牌面格上方显示牌面、下方显示余牌数量。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`
- Kimi WebBridge 默认玩家页 smoke test：打开 `http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- Kimi WebBridge 第 5 关生成器复测：打开 `http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html?level=5`
- Kimi WebBridge 听牌提示复测：构造槽内差 1 张和差 2 张胡牌状态，读取 `#huHint` 和 `.rank-dot.hu-wait`
- Kimi WebBridge 震落开山复测：构造直接明杠和 2 张压顶牌，执行 `杠` 后读取震落牌状态并点击入槽
- Kimi WebBridge 记牌器和动作栏复测：构造牌山/卡槽/牌河/明牌区混合状态，读取记牌器入槽前后 DOM 和动作栏/卡槽 DOM 结构
- 390px headless Chrome 移动端布局复测：读取动作栏、卡槽、底部道具栏、牌面和记牌器矩形，检查无横向溢出、按钮文字不挤出、底部道具栏不遮盖卡槽，且牌面和记牌器数字可读

## 验证结果

- `mahjong-config-playable-prototype`：11 tests passed。
- `mahjong-config`：33 tests passed，新增覆盖第 5-10 关每关 2 个自然明杠包、第 5 关明杠目标不被普通 3 张组稀释、简化 `听/差` 提示、孤张预算检查、杠/胡震落数量和上下两层记牌器 DOM。
- HTML 内联脚本 `node --check`：通过。
- Kimi WebBridge smoke test：页面可打开；明牌区和牌河区存在；牌河显示 `0/3`；任选槽位打牌可进入牌河；正式关构造态下补杠候选出现，补杠后明牌区升级为 4 张杠。截图保存到 `/tmp/hulebu-t101-smoke.png`。
- Kimi WebBridge 第 5 关复测：页面生成 72 张，存在 `wan-6` 和 `wan-3` 两条无同面 3 张组干扰的自然明杠路线；按释放步骤推进到第 3 步出现真实 `杠 wan-6` 候选。截图保存到 `/tmp/hulebu-t101-level5-kong-routes.png`。
- Kimi WebBridge 听牌提示复测：DOM 返回 `听：9筒` 和 `差：2条 / 9筒 可胡`，记牌器只高亮牌山仍有的目标牌；第 5 关重新生成后仍有 2 条干净明杠路线，孤张风险为 `1/1`。截图保存到 `/tmp/hulebu-t101-hu-hint-scrolled.png`。
- Kimi WebBridge / VM 震落开山复测：直接 `杠` 后仅 1 张压顶牌带 `looseMountainTile`，压顶牌保持 `location: board` 且可点；`胡` 后震落 3 张可选牌并清理牌河 1 张。
- Kimi WebBridge 记牌器和动作栏复测：构造混合状态时，入槽前记牌器显示 `万 1`、`条 1`，点击牌山 `1万` 入槽后变为 `万 0`、`条 1`；`.slot-line` 子节点仅为 `slot-grid`，`.action-strip` 子节点为 `combo-actions`。截图保存到 `/tmp/hulebu-t101-counter-layout-v2.png`。
- 390px headless Chrome 移动端布局复测：无横向溢出，`吃 / 碰 / 杠 / 补杠 / 胡` 按钮文字均未挤出，动作栏位于卡槽上方，底部道具栏不遮盖卡槽；牌面约 `40x54`，记牌器每格上方牌面、下方余牌数量。截图保存到 `/tmp/hulebu-t102-mobile-counter-split-final.png`。

## 遗留问题

- 本任务未做残局收官整合和正式动画反馈。
- 本任务未修改 Cocos 正式工程；是否沉淀到 Cocos 需要等 Lee 试玩默认 Demo 后再决定。
- 牌河容量、补杠收益、`杠` 震落 1 张、`胡` 震落 3 张、动作栏位置和第 5 关 `杠` 的 UI 显眼程度仍需朋友试玩后调参。
