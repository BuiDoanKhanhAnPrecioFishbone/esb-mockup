import { NextResponse } from "next/server";

export const runtime = "nodejs";

const VALID_ROLES = ["manager", "offboarder", "coworker"];

// No password — signing in IS picking a role. POST sets the role cookie that
// follows the user until they log out; DELETE clears it (logout).
export async function POST(req: Request) {
  const { role } = (await req.json()) as { role?: string };

  if (!role || !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Pick a role." }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("mockup_role", role, {
    httpOnly: false, // readable by client JS so AppShell picks it up on mount
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("mockup_role");
  // Clear the legacy password cookie too, in case an old session still has it.
  res.cookies.delete("esb_auth");
  return res;
}
