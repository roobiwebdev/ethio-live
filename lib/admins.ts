import "server-only";
import { db } from "@/lib/db";

const ADMIN_LIST_SETTING_KEY = "admins";

export async function isAdminEmail(email: string): Promise<boolean> {
  const normalized = email.toLowerCase();
  if (environmentAdmins().includes(normalized)) return true;
  return (await databaseAdmins()).includes(normalized);
}

function environmentAdmins(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

async function databaseAdmins(): Promise<string[]> {
  try {
    const row = await db.setting.findUnique({ where: { key: ADMIN_LIST_SETTING_KEY } });
    return Array.isArray(row?.value) ? row.value.filter((entry): entry is string => typeof entry === "string").map((entry) => entry.toLowerCase()) : [];
  } catch (error) {
    console.error("databaseAdmins failed", error);
    return [];
  }
}
