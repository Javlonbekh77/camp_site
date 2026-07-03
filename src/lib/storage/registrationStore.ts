"use client";

import type { Registration } from "@/lib/types";

const STORAGE_KEY = "stc_2026_registrations";

const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export const isDatabaseConfigured = Boolean(firebaseProjectId);

export function getLocalRegistrations(): Registration[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Registration[];
  } catch {
    return [];
  }
}

function writeLocal(registrations: Registration[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
}

export function clearLocalRegistrations() {
  localStorage.removeItem(STORAGE_KEY);
}

async function readError(response: Response, fallback: string) {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;
  return payload?.message ?? fallback;
}

export async function createRegistration(input: Registration) {
  const row = {
    ...input,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    status_admin: input.status_admin ?? "new"
  };

  if (isDatabaseConfigured) {
    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });

    if (response.ok) {
      const payload = (await response.json()) as { registration: Registration };
      return payload.registration;
    }

    if (response.status !== 503) {
      throw new Error(await readError(response, "Registration save failed."));
    }
  }

  const existing = getLocalRegistrations();
  writeLocal([row, ...existing]);
  return row;
}

export async function listRegistrations() {
  if (isDatabaseConfigured) {
    const response = await fetch("/api/registrations");

    if (response.ok) {
      const payload = (await response.json()) as { registrations: Registration[] };
      return payload.registrations;
    }

    if (response.status !== 503) {
      throw new Error(await readError(response, "Registration list failed."));
    }
  }

  return getLocalRegistrations();
}

export async function updateRegistrationAdmin(id: string, patch: Pick<Registration, "status_admin" | "admin_note">) {
  if (isDatabaseConfigured) {
    const response = await fetch("/api/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch })
    });

    if (response.ok) {
      const payload = (await response.json()) as { registration: Registration };
      return payload.registration;
    }

    if (response.status !== 503) {
      throw new Error(await readError(response, "Registration update failed."));
    }
  }

  const rows = getLocalRegistrations();
  const next = rows.map((row) => (row.id === id ? { ...row, ...patch } : row));
  writeLocal(next);
  return next.find((row) => row.id === id);
}

export function saveQuizResult(result: unknown) {
  localStorage.setItem("stc_2026_quiz_result", JSON.stringify(result));
}

export function getSavedQuizResult<T>() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("stc_2026_quiz_result") ?? "null") as T | null;
  } catch {
    return null;
  }
}
