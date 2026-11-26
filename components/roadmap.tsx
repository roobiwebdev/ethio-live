"use client";
import { useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/settings-shared";
import {
  COUPON_CODE,
  COURSE_URL,
  ROADMAP_COPY,
  ROADMAP_PDF_FILE_NAME,
  ROADMAP_PDF_PATH,
  SUPPORT_TELEGRAM_URL,
} from "@/lib/roadmap-copy";
import { Logo, TgIcon } from "@/components/icons";
import { LangToggle, useLang } from "@/components/use-lang";

const COPIED_FEEDBACK_MS = 2000;

export default function Roadmap({ s }: { s: SiteSettings }) {
  const [lang, setLang] = useLang(s.defaultLang);
  const t = ROADMAP_COPY[lang];

  return (
    <div className="site">
      <nav className="nav">
        <div className="row">
          <Link href="/" aria-label="Ethio Computer School"><Logo eager /></Link>
          <div className="nav-r"><LangToggle lang={lang} setLang={setLang} /></div>
        </div>
      </nav>
      <main className="rg">
        <div className="rg-card">
          <div className="free">{t.badge}</div>
          <h1>{t.title}</h1>
          <p className="lead">{t.sub}</p>

          <a className="btn btn-red roadmap-dl" href={ROADMAP_PDF_PATH} download={ROADMAP_PDF_FILE_NAME}>
            <DownloadIcon />{t.download}
          </a>
          <div className="note">{t.downloadHint}</div>

          <section className="gift">
            <h2>{t.giftTitle}</h2>
            <p>{t.giftBody}</p>
            <CouponCode label={t.couponLabel} copyLabel={t.copy} copiedLabel={t.copied} />
            <a className="btn btn-white" href={COURSE_URL} target="_blank" rel="noopener">{t.cta}</a>
            <div className="note">{t.deadline}</div>
          </section>

          <div className="rg-foot">
            <Link href="/">{t.back}</Link>
            <a href={SUPPORT_TELEGRAM_URL} target="_blank" rel="noopener"><TgIcon />{t.support}</a>
          </div>
        </div>
      </main>
    </div>
  );
}

function CouponCode({ label, copyLabel, copiedLabel }: { label: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    } catch {}
  };

  return (
    <div className="coupon">
      <span className="coupon-label">{label}</span>
      <code>{COUPON_CODE}</code>
      <button type="button" className="btn btn-line btn-sm" onClick={copyCode}>
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 19h16" />
    </svg>
  );
}
