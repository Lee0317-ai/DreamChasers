# T077：胡了卜 Cocos 随机堆叠牌山恢复

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T076 为了快速验证 Cocos 的通关提示、下一关和奖励节点流转，临时把 Cocos 关卡内容简化为 6 张牌流程关。用户反馈当前默认牌山失去此前随机堆叠密度和难度压力。
- 目标：把 Cocos 默认关卡恢复为随机轮廓、多列堆叠、同列完全覆盖的密集牌山；保留已完成的通关提示、下一关和奖励节点流转。
- 不做：不做完整 20 关数值平衡、不做完整可解路径搜索、不做 Boss 目标 UI 完整版、不做最终 Tile prefab、动画音效、发布包或 Web 站点接入。
- 依赖：T050, T059, T076
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T077-hulebu-cocos-random-stacked-mountain.md`, `docs/tasks/claims/T077-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口目检随机牌山密度和堆叠提示
- 进展：
  - 2026-05-27：新增任务并领取；用户反馈 Cocos 默认预览退化为 6 张牌，要求恢复随机堆叠牌山和难度。
  - 2026-05-27：已将 Cocos 默认 20 关从 6 张流程关改回确定性随机堆叠牌山；首关 42 张起步，后续递增到 60 张，支持 9-16 个随机列、4-6 层同列完全覆盖、字牌权重、5% 遮挡阈值和顶部横条堆叠提示。
  - 2026-05-27：已保留 T076 通关提示、继续下一关、第 3/6/9/13/16/19 关奖励三选一和 20 关通关流程；新增回归测试防止默认首关再次退化为 6 张流程关。
  - 2026-05-27：已通过 `npm run test -w packages/shared -- mahjong-cocos-project`、Cocos `tsc` 和 Cocos Web Preview 手机视口目检；预览刷新后首屏显示多列随机堆叠牌山和堆叠横条提示。
