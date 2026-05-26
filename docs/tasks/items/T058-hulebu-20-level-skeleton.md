# T058：胡了卜 20 关节奏骨架和第二 Boss

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T057 已完成 `胡` 重点关卡和密集牌山胡牌包，但当前配置仍只有 10 关。用户已明确奖励节点为 `3 / 6 / 9 / 13 / 16 / 19`，Boss 关为 `10 / 20`，需要把 20 关主线骨架落进配置和试玩页，方便继续设计后半程内容。
- 目标：将 `levels.json` 扩展到 20 关，建立第 11-20 关的二阶段节奏草案；第 20 关加入第二 Boss 目标雏形；配置测试覆盖 20 关数量、奖励节点、Boss 节点和第 20 关复合目标；配置试玩页能切换 20 关。
- 不做：不做最终 20 关数值精调，不新增完整 20 奖励池，不做完整听牌/番型，不创建 Cocos/GDevelop 正式工程，不接 Web 站点路由。
- 依赖：T057
- 主要文件范围：`packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/docs/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T058-hulebu-20-level-skeleton.md`, `docs/tasks/claims/T058-codex.md`
- 验证方式：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端检查第 20 关配置模式和密集牌山模式；浏览器 390px 移动端检查；`npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-25：开始任务，先用配置测试锁定 20 关、奖励节点和 Boss 节点，再补 11-20 关配置。
  - 2026-05-25：已将 `levels.json` 扩展到 20 关，新增第 11-20 关二阶段节奏草案。
  - 2026-05-25：已固定奖励节点为第 3/6/9/13/16/19 关，Boss 节点为第 10/20 关。
  - 2026-05-25：第 20 关已加入复合 Boss 目标：吃、碰、杠、胡、万筒条字四类目标和积分目标。
  - 2026-05-25：原型 Boss 目标追踪已支持 `胡`，密集牌山 Boss 解法校验也能识别 `胡` 包。
  - 2026-05-25：已修复第 20 关密集牌山中重点 `胡` 包和 Boss `胡 1` 目标重复占用的问题，并补充直接调用原型生成器的回归测试。
  - 2026-05-25：配置试玩页已支持 `?level=20&mode=mountain` 深链接，方便直接打开第 20 关密集牌山做验收。
