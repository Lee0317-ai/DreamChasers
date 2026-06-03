# AI 面试助手交接

## 当前状态

T106 为规划评估任务，未进入开发。

已完成：

- 产品定位。
- MVP 范围。
- 双入口模式。
- 参数配置范围。
- 文本虚拟面试流程。
- HTML 下载报告结构。
- 合规和隐私边界。
- 模块文档目录。

## 后续建议

如果 Lee 评估通过，建议拆两个后续任务：

1. `T107：AI 面试助手 MVP`
   - 实现工具频道入口、JD/简历输入、参数配置、结构化报告生成、HTML 下载、文本虚拟面试和复盘 HTML。

如果 T107 过大，可在领取前继续拆成：

2. `AI 面试助手报告生成 MVP`
   - 实现 JD/简历输入、参数配置、结构化报告生成和 HTML 下载。

3. `AI 面试助手文本虚拟面试 MVP`
   - 实现文本问答、动态追问和复盘 HTML。

后续增强可再拆：

4. `AI 面试助手简历优化建议`
   - 根据 JD 和简历生成关键词补强、项目表达优化、成果量化和简历风险提示。

5. `AI 面试助手专业实战素材增强`
   - 在面试题纲中补充专业领域简单实战例子、行业用法说明和可迁移回答素材。

## 文件边界建议

允许修改：

- `apps/web/src/app/tools/ai-interview-coach/**`
- `apps/web/src/modules/tools/ai-interview-coach/**`
- `apps/web/src/app/api/tools/ai-interview-coach/**`
- `apps/web/src/components/portal-data.ts`
- `docs/modules/ai-interview-coach/**`
- `docs/tasks/**`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/**`
- `docs/completion/**`

禁止修改：

- 胡了卜游戏代码。
- PDF 工具箱实现。
- AI 修图现有实现。
- 部署文件。
- 数据库模型，除非后续明确要保存历史记录。

## 风险提醒

- 简历属于敏感资料，第一版应默认不保存。
- AI 调用成本需要限次。
- 面试官模式不得生成敏感或歧视性问题。
- 虚拟面试第一版建议只做文本，语音后置。
