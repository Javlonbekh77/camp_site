import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: cookies().get("stc_admin")?.value === "1" });
}
