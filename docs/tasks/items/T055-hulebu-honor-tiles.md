# T055：胡了卜加入字牌基础支持

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：当前胡了卜原型只包含 `万 / 条 / 筒` 三种数字花色，用户反馈玩法仍然偏简单，麻将辨识度不足，需要加入 `东 / 南 / 西 / 北 / 中 / 发 / 白板`。
- 目标：扩展基础牌型支持字牌。第一版加入风牌和箭牌配置、规则识别和原型显示；字牌支持 `碰 / 杠`，不参与 `吃`。
- 不做：不实现完整麻将胡牌算法，不做花牌季节牌，不扩展完整 20 关，不创建 Cocos/GDevelop 正式工程，不接 Web 站点路由。
- 依赖：T054
- 主要文件范围：`packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T055-hulebu-honor-tiles.md`, `docs/tasks/claims/T055-codex.md`
- 验证方式：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /tmp/hulebu-prototype-script.js`; 原型 VM 检查字牌渲染和候选；`npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-24：开始任务，准备扩展字牌类型、配置和原型显示。
  - 2026-05-24：已在共享规则模型加入 `honor` 字牌类型，`东 / 南 / 西 / 北 / 中 / 发 / 白` 可碰可杠，且不会参与 `吃`。
  - 2026-05-24：已在 `tiles.json` 补齐字牌基础牌库，并让配置加载测试校验字牌集合。
  - 2026-05-24：已让配置试玩页和密集牌山生成器支持字牌显示、余牌统计和组合包生成；字牌按关卡轮换混入，数牌素材保持更高权重，桌面端与 390px 移动端均已检查。
  - 2026-05-24：验证通过 `npm run test -w packages/shared -- mahjong`、`npm run typecheck -w packages/shared`、`node --check /private/tmp/hulebu-config-playable-script.js` 和浏览器烟测；待文档同步和最终验收。
