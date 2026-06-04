import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { sanitizeReturnUrl } from "@/lib/account/account-security";
import { sendLoginEmail } from "./email-login";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    redirect({ baseUrl, url }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}${sanitizeReturnUrl(url)}`;
    }
  },
  events: {
    async signIn({ user }) {
      if (user.id) {
        await db.accountAuditLog.create({
          data: {
            action: "login_success",
            userId: user.id
          }
        });
      }
    },
    async signOut(message) {
      if ("session" in message && message.session?.userId) {
        await db.accountAuditLog.create({
          data: {
            action: "logout",
            userId: message.session.userId
          }
        });
      }
    }
  },
  pages: {
    error: "/login/error",
    signIn: "/login",
    verifyRequest: "/login/check-email"
  },
  providers: [
    Nodemailer({
      from: process.env.SMTP_FROM || "DreamChasers <no-reply@localhost>",
      server: process.env.AUTH_EMAIL_SERVER || process.env.EMAIL_SERVER || "smtp://localhost:1025",
      sendVerificationRequest({ identifier, url }) {
        return sendLoginEmail({
          siteName: "DreamChasers",
          to: identifier,
          url
        });
      }
    })
  ],
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dreamchasers-local-development-auth-secret-change-me",
  session: {
    strategy: "database"
  },
  trustHost: true
});
