import "server-only";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const GUEST_REGISTRATION_COOKIE = "ecs-reg";
const NINETY_DAYS_IN_SECONDS = 90 * 24 * 60 * 60;

export async function rememberGuestRegistration(registrationId: string): Promise<void> {
  const jar = await cookies();
  jar.set(GUEST_REGISTRATION_COOKIE, registrationId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: NINETY_DAYS_IN_SECONDS,
    path: "/",
  });
}

export async function findGuestRegistration() {
  const jar = await cookies();
  const registrationId = jar.get(GUEST_REGISTRATION_COOKIE)?.value;
  if (!registrationId) return null;
  return db.registration.findUnique({ where: { id: registrationId } });
}
