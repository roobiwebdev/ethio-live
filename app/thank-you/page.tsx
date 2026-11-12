import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ThankYou from "@/components/thank-you";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "You're registered — YouTube Monetization Live",
  // The seat number is personal, and the page is useless to anyone else.
  robots: { index: false, follow: false },
};

export default async function ThankYouPage() {
  const [s, user] = await Promise.all([getSettings(), getCurrentUser()]);
  if (!user) redirect("/register");

  const reg = await db.registration.findUnique({ where: { userId: user.id } });
  // Reaching this page without a registration means the form was never
  // completed, so send them back to finish it rather than showing an empty
  // confirmation. Venue details stay behind the same gate as before.
  if (!reg) redirect("/register");

  return (
    <ThankYou
      s={s}
      user={{ name: user.name, email: user.email, image: user.image }}
      reg={{ seat: reg.seat, name: reg.name, phone: reg.phone }}
    />
  );
}
