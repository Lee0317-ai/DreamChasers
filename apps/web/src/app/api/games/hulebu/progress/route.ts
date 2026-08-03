import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getHulebuProgressByEmail, upsertHulebuProgressByEmail } from "@/lib/account/hulebu-progress";

export async function GET() {
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const progress = await getHulebuProgressByEmail(user.email);
  return NextResponse.json(progress, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | {
        bankedCoins?: number;
        bestEndlessLayer?: number;
        bestAscensionLevel?: number;
        dailyBestLevels?: Record<string, number>;
        dailyStreak?: number;
        lastDailySeed?: string | null;
        achievements?: Record<string, string>;
        upgrades?: Record<string, number>;
        routeProgress?: Record<string, number>;
        preferredRoute?: string | null;
        equippedAscensionLoadout?: string[];
        unlockedAscensionPerks?: Record<string, boolean>;
        activeRun?: Record<string, unknown> | null;
      }
    | null;

  const progress = await upsertHulebuProgressByEmail(user.email, payload ?? {});
  return NextResponse.json(progress, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
