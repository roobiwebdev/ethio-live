import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RegisterFlow from "@/components/register-flow";
import { db } from "@/lib/db";
import { findGuestRegistration } from "@/lib/guest-registration";
import { getSettings } from "@/lib/settings";
import { hideVenue } from "@/lib/settings-shared";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Register — YouTube Monetization Live" };

export default async function RegisterPage() {
  const [s, user] = await Promise.all([getSettings(), getCurrentUser()]);

  const registration = user
    ? await db.registration.findUnique({ where: { userId: user.id } })
    : await findGuestRegistration();
  if (registration) redirect("/thank-you");

  return (
    <RegisterFlow
      s={hideVenue(s)}
      user={user ? { name: user.name, email: user.email, image: user.image } : null}
    />
  );
}
