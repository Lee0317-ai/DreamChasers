import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getTimePickUserIdByEmail, getTimePickUserRole, setTimePickUserRole } from "@/lib/timepick/timepick-api";
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
  const role = await getTimePickUserRole(userId);

  return NextResponse.json(
    { role },
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

  const body = (await request.json()) as { role?: string | null };
  const userId = await getTimePickUserIdByEmail(user.email);
  const result = await setTimePickUserRole({
    role: body.role,
    userId
  });

  if (!result.role) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json({ role: result.role }, { headers: corsHeaders, status: result.status });
}
