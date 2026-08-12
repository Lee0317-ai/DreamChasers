# T282 河牌区限制为两格

- 负责人：Lee
- 范围：Cocos 麻将 Roguelike 河牌容量、河牌节点渲染及回归测试。
- 目标：河牌区最多显示并容纳两张，避免与下方备用槽重叠。
- 不在范围：碰牌池、手牌槽、组合规则和其他 HUD 布局。
- 验证：共享 Cocos 测试、TypeScript 检查、production 构建与 verify-only。
