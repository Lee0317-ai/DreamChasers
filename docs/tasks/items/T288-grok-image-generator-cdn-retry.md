# T288：优化 Grok 生图 CDN 下载与自动重试

- 任务编号：T288
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 目标：让 `grok-image-generator` 永久支持 PPTOKEN 当前返回的 `aiba-media.org` 图片 CDN，并在响应只包含本机回环或其他不可下载地址时自动有限重试，避免每次人工诊断和临时下载。
- 允许修改文件：`/Users/lee/.codex/skills/grok-image-generator/SKILL.md`、`/Users/lee/.codex/skills/grok-image-generator/scripts/**`、本任务分片、领取分片、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`。
- 禁止修改文件：`apps/**`、`packages/**`、Cocos 正式资源、游戏玩法、关卡、存档、Web Demo 和既有图片产物。
- 实现：新增 `aiba-media.org` 及其子域名白名单；拒绝回环、私网、非 HTTPS 地址；新增默认 4 次响应重试和 `--response-attempts` 参数；下载阶段支持 `OSError` 与 `IncompleteRead` 重试；生成请求阶段支持 `RemoteDisconnected` 重试；补充离线下载行为测试。
- 验证：旧实现测试先失败；更新后 6/6 测试通过；`--dry-run` 通过；真实生成在自动重试后成功落盘；技能结构校验通过；API Key 扫描无新密钥；UTF-8 无 BOM；`git diff --check` 通过。
