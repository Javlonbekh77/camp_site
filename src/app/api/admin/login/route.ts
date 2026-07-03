import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { passcode } = (await request.json()) as { passcode?: string };
  const expected = process.env.ADMIN_PASSCODE ?? "change_this_passcode";

  if (!passcode || passcode !== expected) {
    return NextResponse.json({ ok: false, message: "Passcode noto'g'ri." }, { status: 401 });
  }

  cookies().set("stc_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return NextResponse.json({ ok: true });
}
