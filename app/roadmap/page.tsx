import type { Metadata } from "next";
import Roadmap from "@/components/roadmap";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "60-Day YouTube Monetization Roadmap — Ethio Computer School",
  description: "Download your 60-day YouTube monetization roadmap and claim the VIP25 course discount.",
  robots: { index: false, follow: false },
};

export default async function RoadmapPage() {
  const s = await getSettings();
  return <Roadmap s={s} />;
}
