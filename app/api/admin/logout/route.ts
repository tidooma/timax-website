import { NextResponse } from "next/server";
import { ADMIN_COOKIE, auditAdminAction, getAdminFromRequest } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = getAdminFromRequest(request);
  if (session) {
    await auditAdminAction({ request, userId: session.userId, username: session.username, action: "LOGOUT", entity: "AdminUser" });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    path: "/",
    maxAge: 0
  });
  return response;
}
