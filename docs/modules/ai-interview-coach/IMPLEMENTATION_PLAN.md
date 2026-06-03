# AI 面试助手实施计划

**状态**：评估稿，未进入开发
**任务编号**：T106

## 1. 阶段 0：规划确认

- 登记需求和任务。
- 完成产品设计稿。
- 明确双入口、虚拟面试、参数配置和 HTML 下载边界。
- 确认是否进入后续开发排期。

验证：

- 文档自审。
- `npm run docs:sync`
- `git diff --check`

## 2. 阶段 1：报告生成 MVP

目标：先完成可下载 HTML 面试作战包。

建议文件范围：

- `apps/web/src/app/tools/ai-interview-coach/page.tsx`
- `apps/web/src/modules/tools/ai-interview-coach/**`
- `apps/web/src/app/api/tools/ai-interview-coach/**`
- `apps/web/src/components/portal-data.ts`
- `docs/modules/ai-interview-coach/**`

功能：

- 参数表单。
- JD 和简历文本输入。
- 简历图片上传入口。
- 结构化报告数据生成。
- HTML 报告预览和下载。

验证：

- `npm run test -w apps/web -- ai-interview-coach`
- `npm run lint -w apps/web`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- 桌面端和移动端浏览器检查。

## 3. 阶段 2：文本虚拟面试

目标：用户可以进入一问一答虚拟面试。

功能：

- 创建面试会话。
- AI 根据 JD、简历和参数提问。
- 用户回答后 AI 动态追问。
- 到达题数或时间后生成复盘。
- 复盘追加到 HTML 下载。

验证：

- 会话状态测试。
- 追问策略测试。
- HTML 下载测试。
- 桌面端和移动端聊天体验检查。

## 4. 阶段 3：增强能力

后续可选：

- 简历优化建议。
- 面试提纲补充专业领域实战例子和行业用法说明。
- 英文面试。
- 图片简历解析质量优化。
- 更多岗位模板。
- 语音虚拟面试。
- 历史报告库。
- 企业面试官版评分模板。

## 5. 风险控制

- 第一版不保存简历。
- 第一版不做自动招聘决策。
- 第一版只做文本虚拟面试。
- 模型输出先走结构化 JSON，再由固定模板渲染 HTML。
- AI 调用能力设置免费限次或积分消耗。
