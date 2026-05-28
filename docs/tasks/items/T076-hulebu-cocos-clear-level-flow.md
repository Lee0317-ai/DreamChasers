# T076：胡了卜 Cocos 通关提示和下一关流转

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：Cocos 真实首关已经能点击、入槽、组合消除和显示牌面，但清空牌山后只显示“牌山已清空”，没有明确弹出过关提示，也不能进入下一关。用户希望后续补齐“先提示通关，再进入下一关；奖励节点进入下一关时再 3 选 1 奖励”的流程。
- 目标：在 Cocos runtime 中加入清空牌山后的通关状态、通关提示 overlay、下一关按钮和最小关卡流转；奖励节点和 Boss 节点先按已定节奏预留状态。
- 不做：不做完整 20 关内容平衡、不做最终奖励卡美术、不做 Boss 多目标 UI 完整版、不做动画音效、不做发布包和 Web 站点接入。
- 依赖：T072, T075
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T076-hulebu-cocos-clear-level-flow.md`, `docs/tasks/claims/T076-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口手动检查清空牌山、通关提示和下一关入口
- 进展：
  - 2026-05-27：新增任务，等待领取；由用户反馈“消除完没有弹出过关提示、没有进入下一关”拆出。
  - 2026-05-27：Codex / 开发 B 已领取任务；本轮按“先把整个游戏走通”收敛为最小关卡流闭环，不继续扩 UI 美术细节。
  - 2026-05-27：已实现 Cocos 最小关卡流闭环：内嵌 20 关轻量 runtime 配置、牌山清空后弹出通关提示、继续进入下一关、3/6/9/13/16/19 关在继续时进入奖励三选一、20 关后显示本轮通关；Cocos Web Preview 手机视口已目检到第 1 关通关弹窗。
