## Variant: 概念图复刻层次

### Design stance
对齐 Lee 给的概念图和最终布局口径：顶部负责名称、关卡和退出/重开/暂停；底部负责动作与手牌；中间牌桌区域占满剩余空间。

### Key choices
- Top order: 顶部独立 `top-order`，左侧退出，中间名称与关卡，右侧重开/暂停。
- Fill-middle table: `table-shell` 使用 `top + bottom` 占满中间剩余区域，不写死高度。
- Floating counter: 记牌器不贴屏幕角，而是悬浮在牌堆左上方，属于牌桌信息层。
- Floating tools: 洗牌/撤回/打牌三个按钮悬浮在牌堆右侧居中，不再贴全屏右侧。
- Center overlays: 通关提示、三选一卡片、奖励确认都走画面中心弹层，不挤占牌桌结构。
- Layering: 底层牌偏暗，中层正常，上面三张牌尺寸更大、阴影更重、zIndex 更高。
- Cocos implication: 需要拆出顶栏层、牌桌挂件层、牌山层、底部操作层、中心弹层层；不要继续把所有 HUD 都平铺在 Canvas 顶层。

### Best for
作为正式 Cocos UI 落地参考。下一步应围绕这个版本拆代码：顶栏、牌桌挂件、记牌器、右侧工具、牌山层级渲染、桌面透视背景和中心弹层。