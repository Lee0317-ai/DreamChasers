# T078：胡了卜 Cocos 牌山铺开和遮挡点击一致性

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T077 已恢复 Cocos 随机堆叠牌山，但用户反馈牌山仍挤在中间，且部分被上层牌盖住的低层牌仍能点击。
- 目标：扩大 Cocos 随机牌山的生成区域，让牌山更铺开；修正遮挡生成规则，使任意更高层牌覆盖低层牌超过 5% 时低层牌都不可点击。
- 不做：不做完整可解路径搜索、不做最终数值平衡、不做新美术资源、不做 Boss 目标 UI、奖励效果、动画音效、发布包或 Web 站点接入。
- 依赖：T050, T059, T077
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T078-hulebu-cocos-spread-locking.md`, `docs/tasks/claims/T078-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口目检牌山铺开和遮挡不可点
- 进展：
  - 2026-05-27：新增任务并领取；已定位根因：首关随机坐标跨度偏小，且 `applyStackBlockers` 漏掉相邻高层跨列覆盖导致低层可点。
  - 2026-05-27：已将随机列间距从紧凑网格改为横向 68、纵向 88 的铺开布局，首关配置跨度从约 `210x102` 扩大到 `300x186`；`applyStackBlockers` 改为任意更高层牌只要覆盖低层牌超过 5% 就写入 blocker，同列所有上层牌都会阻挡下层牌。
  - 2026-05-27：已补回归测试，覆盖 20 关任意高层 5% 遮挡 blocker 完整性，并验证被盖住的牌不能入槽、移走 blocker 后才恢复可选。
  - 2026-05-27：已通过 Cocos Web Preview 手机视口目检，预览包重新编译后牌山明显铺开；真实可点顶层牌可入槽，被同列完全覆盖的下层牌连点不入槽。
  - 2026-05-27：根据验收反馈重新打开任务；当前铺开方案只有同列堆叠，跨列遮挡数量为 0，导致视觉接近平铺、难度不足。已新增失败测试，要求首关必须包含足够跨列遮挡，并限制初始可点击顶牌数量。
  - 2026-05-28：继续根据反馈补足“多牌堆叠肉眼可见”的效果；`HulebuRuntimeState` 在渲染输出阶段给更高层牌加入轻微右上视觉偏移，保留原始配置坐标和 5% 遮挡计算不变。新增回归测试确保同列上下层不会完全重合。

- 验证结果：
  - `npm run test -w packages/shared -- mahjong-cocos-project`：通过，1 个测试文件、12 个测试。
  - `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`：通过。
  - Cocos 配置抽样：20 关高层遮挡漏判数为 0，首关 42 张牌，包含同列层叠和跨列遮挡。
  - Cocos Web Preview 手机视口：通过，牌山铺开，顶层牌可点，下层被盖住牌不可点。

- 遗留问题：当前只修正 Cocos 随机牌山布局、遮挡点击一致性和层叠视觉；奖励效果、Boss 目标进度、槽位同款图片、最终 Tile prefab、完整可解路径搜索、动画音效和发布包仍待后续任务。
