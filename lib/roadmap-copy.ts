import type { Lang } from "@/lib/settings-shared";

export const ROADMAP_PDF_PATH = "/60-day-youtube-roadmap.pdf";
export const ROADMAP_PDF_FILE_NAME = "60-Day-YouTube-Monetization-Roadmap-EthioComputerSchool.pdf";
export const COURSE_URL = "https://www.ethiocomputer.school/courses/youtube-automation";
export const COUPON_CODE = "VIP25";
export const SUPPORT_TELEGRAM_URL = "https://t.me/Elearning15";

export type RoadmapCopy = {
  badge: string;
  title: string;
  sub: string;
  download: string;
  downloadHint: string;
  giftTitle: string;
  giftBody: string;
  couponLabel: string;
  copy: string;
  copied: string;
  cta: string;
  deadline: string;
  support: string;
  back: string;
};

export const ROADMAP_COPY: Record<Lang, RoadmapCopy> = {
  en: {
    badge: "For the 3-night live students",
    title: "Your 60-Day YouTube Monetization Roadmap",
    sub: "A day-by-day plan from Dec 1 to Jan 31: research your niche, open your channel, publish every week and apply before YouTube doubles its requirements on Feb 1, 2027.",
    download: "Download the PDF",
    downloadHint: "23 pages · Amharic · 11 MB",
    giftTitle: "VIP gift: 25% off the full course",
    giftBody: "YouTube Full Course 2027 + 20+ AI Skill Pack for 9,375 ETB instead of 12,500. Enter the code at checkout.",
    couponLabel: "Coupon code",
    copy: "Copy",
    copied: "Copied",
    cta: "Get the course with 25% off",
    deadline: "Valid until Dec 13, 2026",
    support: "Questions? Message us on Telegram",
    back: "Back to the live page",
  },
  am: {
    badge: "ለ 3 ምሽቱ Live ተማሪዎች",
    title: "የ60 ቀን የዩቲዩብ ሞኒታይዜሽን ሮድማፕዎ",
    sub: "ከዲሴምበር 1 እስከ ጃንዋሪ 31 ያለው ቀን በቀን እቅድ፦ ኒሻችሁን ፈልጉ፣ ቻናል ክፈቱ፣ በየሳምንቱ ልቀቁ እና ዩቲዩብ መስፈርቱን በእጥፍ ከሚያሳድግበት ፌብሩዋሪ 1, 2027 በፊት አመልክቱ።",
    download: "PDF-ውን ያውርዱ",
    downloadHint: "23 ገጽ · በአማርኛ · 11 MB",
    giftTitle: "የVIP ስጦታ፦ በሙሉ ኮርሱ ላይ 25% ቅናሽ",
    giftBody: "YouTube Full Course 2027 + 20+ AI Skill Pack ከ12,500 ብር ይልቅ በ9,375 ብር። ኮዱን ክፍያ ላይ ያስገቡ።",
    couponLabel: "የኩፖን ኮድ",
    copy: "ኮፒ",
    copied: "ተቀድቷል",
    cta: "ኮርሱን በ25% ቅናሽ ያግኙ",
    deadline: "እስከ ዲሴምበር 13, 2026 ብቻ ይሰራል",
    support: "ጥያቄ አለዎት? በቴሌግራም ይጻፉልን",
    back: "ወደ Live ገጹ ተመለስ",
  },
};
