import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getServerFirestore, isFirestoreConfigured } from "@/lib/firebase/admin";
import type { Registration } from "@/lib/types";

export const runtime = "nodejs";

function cleanUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cleanUndefined(item)).filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, cleanUndefined(item)])
    ) as T;
  }

  return value;
}

export async function POST(request: Request) {
  if (!isFirestoreConfigured) {
    return NextResponse.json({ ok: false, message: "Firestore is not configured." }, { status: 503 });
  }

  const input = (await request.json()) as Registration;
  const firestore = getServerFirestore();
  const now = new Date().toISOString();
  const doc = await firestore.collection("registrations").add(cleanUndefined({
    ...input,
    created_at: now,
    status_admin: input.status_admin ?? "new"
  }));
  const snapshot = await doc.get();

  return NextResponse.json({ ok: true, registration: { id: doc.id, ...snapshot.data() } });
}

export async function GET() {
  if (cookies().get("stc_admin")?.value !== "1") {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isFirestoreConfigured) {
    return NextResponse.json({ ok: false, message: "Firestore is not configured." }, { status: 503 });
  }

  const firestore = getServerFirestore();
  const snapshot = await firestore.collection("registrations").orderBy("created_at", "desc").get();
  const registrations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return NextResponse.json({ ok: true, registrations });
}

export async function PATCH(request: Request) {
  if (cookies().get("stc_admin")?.value !== "1") {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isFirestoreConfigured) {
    return NextResponse.json({ ok: false, message: "Firestore is not configured." }, { status: 503 });
  }

  const { id, status_admin, admin_note } = (await request.json()) as {
    id?: string;
    status_admin?: string;
    admin_note?: string;
  };

  if (!id) {
    return NextResponse.json({ ok: false, message: "Missing registration id." }, { status: 400 });
  }

  const firestore = getServerFirestore();
  const ref = firestore.collection("registrations").doc(id);
  await ref.update({ status_admin, admin_note });
  const snapshot = await ref.get();

  return NextResponse.json({ ok: true, registration: { id: snapshot.id, ...snapshot.data() } });
}
