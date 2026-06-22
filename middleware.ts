import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PREFIXES = ["/login", "/api/auth"];
const VALID_ROLES = ["manager", "offboarder", "coworker"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // No password gate — a role IS the login. You must have picked a role
  // (mockup_role cookie) to enter; otherwise back to the role-select page.
  const role = req.cookies.get("mockup_role")?.value;
  if (!role || !VALID_ROLES.includes(role)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
