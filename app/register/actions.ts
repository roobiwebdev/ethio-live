"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rememberGuestRegistration } from "@/lib/guest-registration";
import { normalizePhone } from "@/lib/phone";
import { getSettings } from "@/lib/settings";

export type RegState = { ok?: boolean; error?: "auth" | "closed" | "phone" | "name" | "email" | "server" };

const NAME_MAX_LENGTH = 100;
const SOURCE_MAX_LENGTH = 120;

export async function registerAction(_prev: RegState, form: FormData): Promise<RegState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "auth" };

  const existing = await db.registration.findUnique({ where: { userId: session.user.id } });
  if (!(await registrationAccepts(existing !== null))) return { error: "closed" };

  const name = cleanName(form.get("name")) || cleanName(session.user.name);
  if (!name) return { error: "name" };
  const phone = normalizePhone(String(form.get("phone") ?? ""));
  if (!phone) return { error: "phone" };
  const source = cleanSource(form.get("source"));

  try {
    await db.$transaction([
      db.registration.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, name, email: session.user.email, phone, source },
        update: { name, phone },
      }),
      db.user.update({ where: { id: session.user.id }, data: { name, phone } }),
    ]);
  } catch (error) {
    console.error("registerAction", error);
    return { error: "server" };
  }
  refreshRegistrationPages();
  return { ok: true };
}

export async function registerGuestAction(_prev: RegState, form: FormData): Promise<RegState> {
  const name = cleanName(form.get("name"));
  if (!name) return { error: "name" };
  const email = z.string().email().safeParse(String(form.get("email") ?? "").trim().toLowerCase());
  if (!email.success) return { error: "email" };
  const phone = normalizePhone(String(form.get("phone") ?? ""));
  if (!phone) return { error: "phone" };
  const source = cleanSource(form.get("source"));

  const existing = await db.registration.findFirst({ where: { email: email.data, userId: null } });
  if (!(await registrationAccepts(existing !== null))) return { error: "closed" };

  try {
    const registration = existing
      ? await db.registration.update({ where: { id: existing.id }, data: { name, phone } })
      : await db.registration.create({ data: { name, email: email.data, phone, source } });
    await rememberGuestRegistration(registration.id);
  } catch (error) {
    console.error("registerGuestAction", error);
    return { error: "server" };
  }
  refreshRegistrationPages();
  return { ok: true };
}

async function registrationAccepts(alreadyRegistered: boolean): Promise<boolean> {
  if (alreadyRegistered) return true;
  const settings = await getSettings();
  return settings.registrationOpen;
}

function cleanName(value: FormDataEntryValue | string | null | undefined): string {
  const name = String(value ?? "").trim().slice(0, NAME_MAX_LENGTH);
  return name.length >= 2 ? name : "";
}

function cleanSource(value: FormDataEntryValue | null): string | null {
  return String(value ?? "").trim().slice(0, SOURCE_MAX_LENGTH) || null;
}

function refreshRegistrationPages() {
  revalidatePath("/register");
  revalidatePath("/thank-you");
  revalidatePath("/");
}
