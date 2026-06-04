type AuditLogLike = {
  action: string;
  createdAt: Date;
  id: string;
};

export function buildAccountInitial(name: string | null | undefined, email: string | null | undefined) {
  const source = (name || email || "U").trim();

  return source.charAt(0).toLocaleUpperCase("zh-CN") || "U";
}

export function buildSecuritySummary(input: { auditLogCount: number; emailVerified: boolean }) {
  if (!input.emailVerified) {
    return {
      description: "邮箱仍在等待验证，请重新登录确认邮箱。",
      level: "待确认",
      score: 0
    };
  }

  return {
    description: `邮箱验证已启用，最近有 ${input.auditLogCount} 条安全记录。`,
    level: "基础",
    score: input.auditLogCount > 0 ? 2 : 1
  };
}

export function formatAccountDate(value: Date, timeZone = "Asia/Shanghai") {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone
  }).format(value);
}

export function toDeviceRows(logs: AuditLogLike[]) {
  return logs.map((log) => ({
    id: log.id,
    location: "位置未记录",
    name: log.action === "session_created" ? "网页登录" : "账号安全事件",
    status: log.action === "session_created" ? "当前或近期会话" : "已记录",
    time: log.createdAt
  }));
}
