# 胡了卜登入页与精灵引导体验实施计划

**目标：** 从登入页开始收口完整竖屏体验，并让胡萝卜精灵在登入页、新手牌局和关键提示中成为统一的引导角色。

**架构：** Cocos 规则状态仍由 `GameSceneController`、`GameCoordinator` 和 runtime snapshot 负责；新增 `HulebuMascotGuide` 作为可销毁的表现层组件，读取当前 phase/教程上下文，选择精灵状态、气泡文案和显示位置。认证只定义适配器接口，不在 Cocos 客户端保存微信密钥。

**技能约束：** 精灵资源按 `generate2dsprite` 规则采用项目原有 clean-HD 透明 PNG、独立动作网格、统一中心锚点和稳定缩放；表现层遵循 `phaser-2d-game` 的薄场景、稳定 manifest key、状态驱动动画原则，但正式工程仍为 Cocos Creator 3.8.8。

## 任务 1：登入页 CTA 与认证状态

- [ ] 保留现有标题背景和品牌牌匾。
- [ ] 将主按钮文案改为“微信登录并开始”，Web 预览调用模拟适配器。
- [ ] 次按钮保留“游客试玩”，进入大厅并沿用本地存档。
- [ ] 增加登录中、失败重试、游客继续三种 runtime 状态，不接入真实 AppSecret。

## 任务 2：精灵表现层

- [ ] 新增 `HulebuMascotGuide.ts`，只负责 Sprite、Tween、气泡和显示安全区。
- [ ] 使用稳定资源 key：`ui.mascot.idle/guide/think/happy/failed`。
- [ ] 登入页常驻 idle，牌局默认隐藏；教程和关键状态显示 guide/think/happy/failed。
- [ ] 精灵位置避开牌山、动作栏、河牌区和 8 格手牌槽。

## 任务 3：气泡触发器

- [ ] 统一通过 `MascotHintId` 选择文案，不让规则层直接创建 UI 节点。
- [ ] 首次进入牌局提示选亮牌。
- [ ] 出现碰/吃/杠/胡时提示对应动作。
- [ ] 槽位接近满、进入弃牌选择、记牌器展开、通关/失败时显示对应气泡。
- [ ] 同时只显示一个气泡，按教程 > 危险 > 组合 > 普通提示优先级处理。

## 任务 4：精灵动画资源第二步

- [ ] 以现有 idle PNG 为视觉参考生成 2x2 idle 动画。
- [ ] 基于同一 scale profile 生成 guide、think、happy、failed 的独立 2x2 表。
- [ ] 用 `generate2dsprite.py process --strict-qc` 检查边缘、主体缩放和透明背景。
- [ ] 通过后再替换当前静态状态图，保持 manifest key 不变。
- [ ] 缺失 UI 和动画的完整文件级清单以 `docs/modules/mahjong-roguelike/UI_MISSING_ASSETS_T291.md` 为准，由独立生图会话产出。

## 验收

- [ ] 390×844 从登入页进入大厅、地图、1-1 牌局的完整截图。
- [ ] 牌局中精灵不遮挡可点击牌、动作栏、河牌区和手牌槽。
- [ ] 关键气泡触发后自动消失，底层牌面仍可点击。
- [ ] Cocos 测试与 exact-commit production build 通过。
