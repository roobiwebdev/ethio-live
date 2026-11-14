import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ThankYou from "@/components/thank-you";
import { db } from "@/lib/db";
import { findGuestRegistration } from "@/lib/guest-registration";
import { getSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "You're registered — YouTube Monetization Live",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage() {
  const [s, user] = await Promise.all([getSettings(), getCurrentUser()]);

  const reg = user
    ? await db.registration.findUnique({ where: { userId: user.id } })
    : await findGuestRegistration();
  if (!reg) redirect("/register");

  const identity = user
    ? { name: user.name, email: user.email, image: user.image }
    : { name: reg.name, email: reg.email, image: null };

  return (
    <ThankYou
      s={s}
      user={identity}
      reg={{ seat: reg.seat, name: reg.name, phone: reg.phone }}
      signedIn={user !== null}
    />
  );
}
