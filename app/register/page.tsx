import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RegisterFlow from "@/components/register-flow";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { hideVenue } from "@/lib/settings-shared";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Register — YouTube Monetization Live" };

export default async function RegisterPage() {
  const [s, user] = await Promise.all([getSettings(), getCurrentUser()]);

  // Anyone already registered belongs on the confirmation page — it is the one
  // place that view lives now, so a returning visitor and someone who has just
  // submitted the form both land on the same URL.
  if (user) {
    const reg = await db.registration.findUnique({ where: { userId: user.id } });
    if (reg) redirect("/thank-you");
  }

  // Venue details stay hidden until there is a registration, as before.
  return (
    <RegisterFlow
      s={hideVenue(s)}
      user={user ? { name: user.name, email: user.email, image: user.image } : null}
    />
  );
}
