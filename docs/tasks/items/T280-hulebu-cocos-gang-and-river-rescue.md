# T280 胡了卜 Cocos 杠候选与满槽河牌救场

- 负责人：Lee
- 状态：已完成
- 开始日期：2026-08-12
- 需求：四张相同牌没有显示“杠”；槽位满时没有明确失败/弃牌到牌河的救场提示。
- 允许修改：Cocos `HulebuRuntimeState.ts`、`GameSceneController.ts`、`ComboBarBinder.ts`、共享 Cocos 回归测试和 T280 文档。
- 禁止修改：关卡/奖励 JSON、Web Demo、其他模块和已有 UI 资产。
- 验证：Cocos TypeScript、`mahjong-cocos-project`、exact-commit build、verify-only、浏览器竖屏点击验证、`git diff --check`。

## 完成结果

- 第三项工具改为可读的“河牌”文字按钮，不再加载会遮住文案的提示图标。
- 满槽状态改为“槽位已满：点击河牌救场”，无可用救场时提示“槽位已满：请先消除组合”。
- 新手第三关提示同步使用“河牌”入口。
- 新增四张相同条牌运行时回归测试，确认“杠”候选可交互且可执行。
