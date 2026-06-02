# T087 完成记录：胡了卜原型模板随机、全牌种覆盖和竖屏牌桌

- 任务编号：T087
- 负责人：Lee
- 状态：待验收
- 完成日期：2026-05-30

## 修改文件

- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- `packages/shared/src/mahjong-config.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T087-hulebu-varied-portrait-mountain.md`
- `docs/tasks/claims/T087-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/superpowers/plans/2026-05-30-hulebu-varied-portrait-mountain.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-05-30.md`
- `docs/completion/2026-05-30-task-T087-hulebu-varied-portrait-mountain.md`

## 实现内容

- 将配置试玩原型的密集牌山坐标系改为 640x860 竖屏基准，并修正 390px 移动端横向截断。
- 新增 8 个本地模板：中心塔、双翼、十字、环形、长墙、群岛、峡谷、阶梯。
- 默认按关卡稳定轮换模板，调牌器支持通过下拉框和 `template=` URL 参数指定模板。
- 修正调牌器固定模板的误导：从 `template=ring` 等固定模板页切换关卡、进入下一关或重开一轮时恢复 `auto`，避免所有关都延续同一种形状；重开本关仍保留当前调参。
- 默认 240 张牌仍保持首轮约 8-12 张可点击，栈顶牌显示隐藏深度角标。
- 牌面分配从四类花色覆盖升级为 34 个具体牌面覆盖，保证 `万1-9 / 条1-9 / 筒1-9 / 东南西北中发白` 都出现。
- 洗牌覆盖队列和填充牌型，减少首轮栈顶视觉上过度单一的问题。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `node --check /tmp/hulebu-config-playable-script.js`
- Kimi WebBridge 打开默认玩家页和调牌器页检查桌面端。
- 临时 headless Chrome 390x844 截图检查移动端。
- `npm run docs:sync`
- `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T087-hulebu-varied-portrait-mountain.md docs/tasks/claims/T087-lee.md docs/superpowers/plans/2026-05-30-hulebu-varied-portrait-mountain.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`
- `git diff --check`

## 验证结果

- 共享包静态测试通过：1 个测试文件、4 个测试。
- 共享包配置/VM 测试通过：`mahjong-config.test.ts` 17 个测试；`mahjong-config-playable-prototype.test.ts` 4 个测试。
- JS 语法检查通过。
- Kimi WebBridge 桌面检查通过：第 1 关玩家页 10 张可点击、10 个栈深角标、生成 240 张牌；第 4 关调牌器 `template=ring` 下拉生效。
- Kimi WebBridge 验收补丁检查通过：从 `template=ring` 的第 4 关调牌器点击第 5 关后，模板变为 `long-wall`，调参选择框回到 `auto`。
- 移动端截图通过：`/tmp/hulebu-t087-mobile-fixed.png`。

## 遗留问题

- 当前只改 HTML 配置试玩原型，不修改 Cocos 正式工程。
- 后续需要 Lee 试玩第 1-8 关，确认 8 个模板的读牌压力、栈深角标和字牌权重是否需要继续微调。
