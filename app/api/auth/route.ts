import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: string };
  const expected = process.env.MOCKUP_PASSWORD;
  const token = process.env.MOCKUP_AUTH_TOKEN;

  if (!expected || !token) {
    return NextResponse.json(
      { error: "Server is missing MOCKUP_PASSWORD or MOCKUP_AUTH_TOKEN." },
      { status: 500 },
    );
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("esb_auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("esb_auth");
  return res;
}
