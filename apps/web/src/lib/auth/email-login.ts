import nodemailer from "nodemailer";

type EmailInput = {
  siteName: string;
  to: string;
  url: string;
};

type AuthEmailMessage = {
  html: string;
  subject: string;
  text: string;
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

export function buildRegistrationVerificationEmail({ siteName, url }: EmailInput) {
  const subject = `验证 ${siteName} 账号邮箱`;
  const text = [
    `点击下面的链接验证你的 ${siteName} 账号邮箱：`,
    "",
    url,
    "",
    "这个链接将在短时间后失效，且只能使用一次。",
    "如果不是你本人操作，可以忽略这封邮件。"
  ].join("\n");
  const html = [
    `<p>点击下面的按钮验证你的 ${escapeHtml(siteName)} 账号邮箱：</p>`,
    `<p><a href="${escapeHtml(url)}" style="display:inline-block;padding:10px 16px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;">验证邮箱</a></p>`,
    `<p>如果按钮无法打开，请复制这个链接：</p>`,
    `<p>${escapeHtml(url)}</p>`,
    `<p>这个链接将在短时间后失效，且只能使用一次。如果不是你本人操作，可以忽略这封邮件。</p>`
  ].join("");

  return { html, subject, text };
}

export function buildPasswordResetEmail({ siteName, url }: EmailInput) {
  const subject = `重置 ${siteName} 账号密码`;
  const text = [
    `点击下面的链接重置你的 ${siteName} 账号密码：`,
    "",
    url,
    "",
    "这个链接将在 1 小时后失效，且只能使用一次。",
    "如果不是你本人操作，可以忽略这封邮件。"
  ].join("\n");
  const html = [
    `<p>点击下面的按钮重置你的 ${escapeHtml(siteName)} 账号密码：</p>`,
    `<p><a href="${escapeHtml(url)}" style="display:inline-block;padding:10px 16px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;">重置密码</a></p>`,
    `<p>如果按钮无法打开，请复制这个链接：</p>`,
    `<p>${escapeHtml(url)}</p>`,
    `<p>这个链接将在 1 小时后失效，且只能使用一次。如果不是你本人操作，可以忽略这封邮件。</p>`
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
  const message = buildRegistrationVerificationEmail({ siteName, to, url });

  await sendAuthEmail({
    developmentLogLabel: "Development registration verification link",
    message,
    to,
    url
  });
}

export async function sendPasswordResetEmail({ siteName, to, url }: EmailInput) {
  const message = buildPasswordResetEmail({ siteName, to, url });

  await sendAuthEmail({
    developmentLogLabel: "Development password reset link",
    message,
    to,
    url
  });
}

async function sendAuthEmail({
  developmentLogLabel,
  message,
  to,
  url
}: {
  developmentLogLabel: string;
  message: AuthEmailMessage;
  to: string;
  url: string;
}) {
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig) {
    console.info(`[auth] ${developmentLogLabel} for ${to}: ${url}`);
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
