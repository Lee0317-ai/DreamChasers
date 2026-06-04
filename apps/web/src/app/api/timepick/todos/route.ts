import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { buildTimePickCorsHeadersForRequest, buildTimePickOptionsResponse } from "@/lib/timepick/timepick-cors";
import { createTimePickTryQueueLink, getTimePickUserIdByEmail, listTimePickTryQueueLinks } from "@/lib/timepick/timepick-api";

export function OPTIONS(request: Request) {
  return buildTimePickOptionsResponse(request);
}

export async function GET(request: Request) {
  const corsHeaders = buildTimePickCorsHeadersForRequest(request);
  const user = await getCurrentUser();

  if (!user?.email) {
    return NextResponse.json({ error: "请先登录。" }, { headers: corsHeaders, status: 401 });
  }

  const url = new URL(request.url);
  const userId = await getTimePickUserIdByEmail(user.email);
  const todos = await listTimePickTryQueueLinks({
    status: url.searchParams.get("status"),
    userId
  });

  return NextResponse.json(
    { todos },
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

  const body = await request.json();
  const userId = await getTimePickUserIdByEmail(user.email);
  const result = await createTimePickTryQueueLink({
    input: body,
    userId
  });

  if (!result.todo) {
    return NextResponse.json({ error: result.error }, { headers: corsHeaders, status: result.status });
  }

  return NextResponse.json({ todo: result.todo }, { headers: corsHeaders, status: result.status });
}
