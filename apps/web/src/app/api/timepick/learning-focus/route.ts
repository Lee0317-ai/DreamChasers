import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createTimePickLearningFocus, getTimePickUserIdByEmail, listTimePickLearningFocus } from "@/lib/timepick/timepick-api";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function GET(request: Request) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const userId = await getTimePickUserIdByEmail(user.email);
  const foci = await listTimePickLearningFocus(userId);

  return NextResponse.json(
    { foci },
    {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store"
      }
    }
  );
}

export async function POST(request: Request) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const body = (await request.json()) as { is_paused?: boolean | null; name?: string | null; synonyms?: string[] | null; weight?: number | null };
  const userId = await getTimePickUserIdByEmail(user.email);
  const result = await createTimePickLearningFocus({
    input: body,
    userId
  });

  if (!result.focus) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json({ focus: result.focus }, { headers: corsHeaders, status: result.status });
}
