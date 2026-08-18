# T289：胡了卜侧视重力牌塔原型验证

- 任务编号：T289
- 负责人：Lee
- 状态：已放弃（2026-08-17 Lee 决定放弃侧视图方案，回退俯视堆叠）
- 优先级：P1
- 依赖：无（未修改现有玩法代码）
- 目标：验证"俯视堆叠改为侧视金字塔立牌堆叠 + 重力下落"的新堆叠方案手感。
- 结果：原型两轮迭代（立牌排排站版本、实心金字塔叠塔版本）均与 Lee 想象中的画面差距过大，Lee 决定放弃该方向，主 demo 与 Cocos 工程保持俯视堆叠不动。
- 教训（供未来类似讨论参考）：
  - 讨论阶段确认的规则模型（重力、列顶可点、深度遮挡、震落散牌区）可实现且逻辑自洽，但"画面像不像参考图"无法靠文字对齐，需要先出静态视觉稿（截图/贴图拼图）确认构图后再写交互代码。
  - 伪 3D 立牌金字塔用 CSS 平面贴图模拟的效果与参考图（带厚度、真透视）观感差距大；若未来重提，应直接在 Cocos 里用 3D 节点或倾斜摄像机做，而不是 HTML/CSS。
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/side-view/**`（新增目录，已废弃保留）、本任务分片、领取分片、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/tasks/TASK_BOARD.md`（追加行）、当天进展、麻将模块 `PROGRESS.md`。
- 禁止修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`（现有主 demo，实际未改动）、`apps/web/**`、Cocos 工程、`packages/shared/**`、关卡与奖励配置（实际均未改动）。
- 处理结论：已放弃。`prototypes/side-view/` 目录保留作历史记录，后续主线继续俯视堆叠。
