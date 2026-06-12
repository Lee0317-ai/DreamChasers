import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { sanitizeReturnUrl } from "@/lib/account/account-security";
import { sendLoginEmail } from "./email-login";
import { verifyPassword } from "./password";
import { canUsePasswordLogin } from "./auth-rules";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.sub = user.id;
      }

      return token;
    },
    redirect({ baseUrl, url }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}${sanitizeReturnUrl(url)}`;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.email = token.email || session.user.email;
        session.user.id = token.sub || session.user.id;
        session.user.name = token.name || session.user.name;
      }

      return session;
    }
  },
  events: {
    async signIn({ user }) {
      if (user.id) {
        const { ensureStarterPlatformCreditsForUser } = await import("@/lib/account/account-data");

        await ensureStarterPlatformCreditsForUser(user.id);
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
      } else if ("token" in message && message.token?.sub) {
        await db.accountAuditLog.create({
          data: {
            action: "logout",
            userId: message.token.sub
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
    Credentials({
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password || "");

        if (!email || !password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email }
        });

        if (!user) {
          return null;
        }

        const passwordMatches = await verifyPassword(password, user.passwordHash);

        if (
          !canUsePasswordLogin({
            emailVerified: user.emailVerified,
            passwordMatches
          })
        ) {
          return null;
        }

        return {
          email: user.email,
          id: user.id,
          image: user.image,
          name: user.name
        };
      }
    }),
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
    strategy: "jwt"
  },
  trustHost: true
});
