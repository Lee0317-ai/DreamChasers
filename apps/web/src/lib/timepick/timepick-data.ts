import { db } from "@/lib/db";
import { defaultTimePickSections } from "./timepick-model";

function buildDefaultUsername(email: string) {
  return email.trim().toLowerCase();
}

function buildDefaultNickname(email: string, name?: string | null) {
  return name?.trim() || email.split("@")[0] || email;
}

export async function getTimePickBootstrapForEmail(email: string) {
  const user = await db.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new Error("账号不存在，请重新登录。");
  }

  const [profile, sections] = await db.$transaction(async (tx) => {
    const profile = await tx.timePickProfile.upsert({
      create: {
        nickname: buildDefaultNickname(user.email, user.name),
        userId: user.id,
        username: buildDefaultUsername(user.email)
      },
      update: {},
      where: {
        userId: user.id
      }
    });

    const sections = await Promise.all(
      defaultTimePickSections.map((section) =>
        tx.timePickSection.upsert({
          create: {
            name: section.name,
            sortOrder: section.sortOrder,
            type: section.type
          },
          update: {
            name: section.name,
            sortOrder: section.sortOrder
          },
          where: {
            type: section.type
          }
        })
      )
    );

    return [profile, sections] as const;
  });

  return {
    profile: {
      id: profile.id,
      nickname: profile.nickname,
      storageLimit: profile.storageLimit.toString(),
      storageUsed: profile.storageUsed.toString(),
      userId: profile.userId,
      username: profile.username
    },
    sections: sections.map((section) => ({
      id: section.id,
      name: section.name,
      sortOrder: section.sortOrder,
      type: section.type
    })),
    user: {
      email: user.email,
      id: user.id,
      name: user.name
    }
  };
}
