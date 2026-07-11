# T241 胡了卜 Cocos 正式游戏 v1 产品与技术重规划完成记录

- 任务编号：T241
- 负责人：Lee
- 完成日期：2026-07-11
- 修改文件：`docs/superpowers/specs/2026-07-10-hulebu-cocos-v1-production-design.md`, `docs/modules/mahjong-roguelike/HULEBU_COCOS_V1_ROADMAP.html`, `docs/tasks/items/T241-hulebu-cocos-v1-production-design.md`, `docs/tasks/claims/T241-lee.md`
- 实现内容：确认 Cocos 为唯一正式运行时；冻结 Web demo 扩展；定义 20–30 分钟十节点首章；明确规则、流程、UI、音频、存档、构建、性能、测试和发布边界；拆出 M0–M5 路线与上线 Definition of Done。
- 验证命令：`npm run docs:sync`; 未决标记扫描；HTML 标签/锚点结构检查；Kimi WebBridge 1440x900 与 390x844 视口检查；UTF-8 无 BOM 检查；`git diff --check`
- 验证结果：规划文档已通过结构、编码、桌面/手机视口和空白检查；提交 `e789a97a` 保存四个独立交付文件。
- 遗留问题：实现从 T242 的 M0 production build 基线开始；当前分支与 `origin/main` 分叉，未擅自 merge/rebase；T239/T240 的未提交 Cocos 改动继续保留。
