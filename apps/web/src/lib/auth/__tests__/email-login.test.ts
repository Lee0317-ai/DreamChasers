import { describe, expect, it } from "vitest";
import { buildRegistrationVerificationEmail, getSmtpConfig } from "../email-login";

describe("email-login", () => {
  it("builds a clear registration verification email with the verification URL", () => {
    const email = buildRegistrationVerificationEmail({
      siteName: "DreamChasers",
      to: "lee@example.com",
      url: "https://dream.example/api/auth/callback/email?token=abc"
    });

    expect(email.subject).toBe("验证 DreamChasers 账号邮箱");
    expect(email.text).toContain("https://dream.example/api/auth/callback/email?token=abc");
    expect(email.text).toContain("如果不是你本人操作，可以忽略这封邮件");
    expect(email.html).toContain("验证邮箱");
    expect(email.text).not.toContain("登录 DreamChasers");
  });

  it("returns null SMTP config when required env vars are missing", () => {
    expect(
      getSmtpConfig({
        SMTP_HOST: "smtp.example.com",
        SMTP_PORT: "587",
        SMTP_FROM: "DreamChasers <no-reply@example.com>"
      })
    ).toBeNull();
  });

  it("parses SMTP config from environment values", () => {
    expect(
      getSmtpConfig({
        SMTP_FROM: "DreamChasers <no-reply@example.com>",
        SMTP_HOST: "smtp.example.com",
        SMTP_PASSWORD: "secret",
        SMTP_PORT: "465",
        SMTP_USER: "no-reply@example.com"
      })
    ).toEqual({
      auth: {
        pass: "secret",
        user: "no-reply@example.com"
      },
      from: "DreamChasers <no-reply@example.com>",
      host: "smtp.example.com",
      port: 465,
      secure: true
    });
  });
});
