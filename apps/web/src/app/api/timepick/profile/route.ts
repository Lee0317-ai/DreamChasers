import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getTimePickProfileForEmail, updateTimePickProfileBirthDate } from "@/lib/timepick/timepick-api";
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

  const profile = await getTimePickProfileForEmail(user.email);

  return NextResponse.json(
    { profile },
    {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store"
      }
    }
  );
}

export async function PATCH(request: Request) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const body = (await request.json()) as { birth_date?: string | null };
  const result = await updateTimePickProfileBirthDate({
    birthDate: body.birth_date,
    email: user.email
  });

  if (!result.profile) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json({ profile: result.profile }, { headers: corsHeaders, status: result.status });
}
