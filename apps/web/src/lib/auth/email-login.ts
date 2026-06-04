import nodemailer from "nodemailer";

type EmailInput = {
  siteName: string;
  to: string;
  url: string;
};

type SmtpEnv = Record<string, string | undefined>;

export type SmtpConfig = {
  auth: {
    pass: string;
    user: string;
  };
  from: string;
  host: string;
  port: number;
  secure: boolean;
};

export function buildLoginEmail({ siteName, url }: EmailInput) {
  const subject = `登录 ${siteName}`;
  const text = [
    `点击下面的链接登录 ${siteName}：`,
    "",
    url,
    "",
    "这个链接将在短时间后失效，且只能使用一次。",
    "如果不是你本人操作，可以忽略这封邮件。"
  ].join("\n");
  const html = [
    `<p>点击下面的按钮登录 ${siteName}：</p>`,
    `<p><a href="${escapeHtml(url)}" style="display:inline-block;padding:10px 16px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;">登录 ${escapeHtml(siteName)}</a></p>`,
    `<p>如果按钮无法打开，请复制这个链接：</p>`,
    `<p>${escapeHtml(url)}</p>`,
    `<p>这个链接将在短时间后失效，且只能使用一次。如果不是你本人操作，可以忽略这封邮件。</p>`
  ].join("");

  return { html, subject, text };
}

export function getSmtpConfig(env: SmtpEnv = process.env): SmtpConfig | null {
  const host = env.SMTP_HOST?.trim();
  const port = Number(env.SMTP_PORT?.trim() || "587");
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASSWORD?.trim();
  const from = env.SMTP_FROM?.trim();

  if (!host || !user || !pass || !from || !Number.isFinite(port)) {
    return null;
  }

  return {
    auth: { pass, user },
    from,
    host,
    port,
    secure: port === 465
  };
}

export async function sendLoginEmail({ siteName, to, url }: EmailInput) {
  const message = buildLoginEmail({ siteName, to, url });
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig) {
    console.info(`[auth] Development login link for ${to}: ${url}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    auth: smtpConfig.auth,
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure
  });

  await transporter.sendMail({
    from: smtpConfig.from,
    html: message.html,
    subject: message.subject,
    text: message.text,
    to
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
