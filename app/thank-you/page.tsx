import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ThankYou from "@/components/thank-you";
import { JUST_REGISTERED_PARAM } from "@/lib/registration-redirect";
import { db } from "@/lib/db";
import { findGuestRegistration } from "@/lib/guest-registration";
import { getSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "You're registered — YouTube Monetization Live",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ThankYouPage({ searchParams }: { searchParams: SearchParams }) {
  const [s, user, params] = await Promise.all([getSettings(), getCurrentUser(), searchParams]);

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
      justRegistered={params[JUST_REGISTERED_PARAM] === "1"}
    />
  );
}
