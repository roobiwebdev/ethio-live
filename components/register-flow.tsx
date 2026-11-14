"use client";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { registerAction, registerGuestAction, type RegState } from "@/app/register/actions";
import { dateRange, timeLabel, type Lang, type SiteSettings, type SiteText } from "@/lib/settings-shared";
import { GoogleIcon, Logo } from "@/components/icons";
import { LangToggle, useLang } from "@/components/use-lang";

type SignedInUser = { name: string; email: string; image: string | null };
type RegisterFormProps = { t: SiteText; source: string; onDone: () => void };

const SOURCE_STORAGE_KEY = "ecs-src";

export default function RegisterFlow({ s, user }: { s: SiteSettings; user: SignedInUser | null }) {
  const [lang, setLang] = useLang(s.defaultLang);
  const t = s.text[lang];
  const router = useRouter();
  const source = useReferralSource();

  const goToThankYou = () => {
    router.refresh();
    router.push("/thank-you");
  };
  const signOut = async () => { await authClient.signOut(); router.refresh(); };

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
          <h1 dangerouslySetInnerHTML={{ __html: t.rTitle }} />
          {user
            ? <PhoneOnlyForm t={t} source={source} onDone={goToThankYou} user={user} />
            : <GuestRegistration t={t} s={s} lang={lang} source={source} onDone={goToThankYou} />}
          <div className="rg-foot">
            <Link href="/">{t.rBack}</Link>
            {user && <button type="button" onClick={signOut}>{t.rSignOut}</button>}
          </div>
        </div>
      </main>
    </div>
  );
}

function PhoneOnlyForm({ t, source, onDone, user }: RegisterFormProps & { user: SignedInUser }) {
  const [state, action, pending] = useActionState<RegState, FormData>(registerAction, {});
  useEffect(() => { if (state.ok) onDone(); }, [state.ok, onDone]);
  return (
    <>
      <p className="lead">{t.rPhoneOnly}</p>
      <div className="who-me">
        {user.image
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={user.image} alt="" />
          : <span className="ph">{user.name.charAt(0)}</span>}
        <div><b>{user.name}</b><span>{user.email}</span></div>
      </div>
      <form action={action}>
        <input type="hidden" name="source" value={source} />
        <PhoneField t={t} />
        <FormError t={t} state={state} />
        <button className="btn btn-red" disabled={pending}>{pending ? "…" : `${t.rSubmit} →`}</button>
      </form>
    </>
  );
}

function GuestRegistration({ t, s, lang, source, onDone }: RegisterFormProps & { s: SiteSettings; lang: Lang }) {
  const [state, action, pending] = useActionState<RegState, FormData>(registerGuestAction, {});
  const [googlePending, setGooglePending] = useState(false);
  useEffect(() => { if (state.ok) onDone(); }, [state.ok, onDone]);

  const continueWithGoogle = async () => {
    setGooglePending(true);
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/register" });
    if (error) setGooglePending(false);
  };

  const time = s.days[0] ? timeLabel(s.days[0].start, lang) : "";
  if (!s.registrationOpen) return <p className="err">{t.rClosed}</p>;

  return (
    <>
      <p className="lead">{t.rSub}</p>
      <div className="rg-meta"><span>{dateRange(s.days)}</span><span>{time}</span><span>Live · Online</span><span>{t.price}</span></div>
      <form action={action}>
        <input type="hidden" name="source" value={source} />
        <div className="fld"><label htmlFor="name">{t.rName}</label><input id="name" name="name" required minLength={2} autoComplete="name" /></div>
        <div className="fld"><label htmlFor="email">{t.rEmail}</label><input id="email" name="email" type="email" inputMode="email" required autoComplete="email" /></div>
        <PhoneField t={t} />
        <FormError t={t} state={state} />
        <button className="btn btn-red" disabled={pending}>{pending ? "…" : `${t.rSubmit} →`}</button>
      </form>
      <span className="or-line">{t.or}</span>
      <button className="gbtn" style={{ marginTop: 0 }} onClick={continueWithGoogle} disabled={googlePending}>
        <GoogleIcon />{googlePending ? "…" : t.rGoogle}
      </button>
    </>
  );
}

function PhoneField({ t }: { t: SiteText }) {
  return (
    <div className="fld">
      <label htmlFor="phone">{t.rPhone}</label>
      <input id="phone" name="phone" type="tel" inputMode="tel" placeholder="09XX XXX XXX" required autoComplete="tel" />
      <small>{t.rPhoneHint}</small>
    </div>
  );
}

function FormError({ t, state }: { t: SiteText; state: RegState }) {
  const message = errorMessage(t, state);
  return message ? <p className="err" role="alert">{message}</p> : null;
}

function errorMessage(t: SiteText, state: RegState): string {
  switch (state.error) {
    case "phone": return t.rBadPhone;
    case "name": return t.rBadName;
    case "email": return t.rBadEmail;
    case "closed": return t.rClosed;
    case undefined: return "";
    default: return t.rError;
  }
}

function useReferralSource(): string {
  const [source, setSource] = useState("");
  useEffect(() => {
    try {
      const query = new URLSearchParams(location.search);
      const fromUrl = query.get("utm_source") || query.get("ref") || query.get("src");
      if (fromUrl) localStorage.setItem(SOURCE_STORAGE_KEY, fromUrl);
      const referrerHost = document.referrer ? new URL(document.referrer).hostname : "";
      setSource(fromUrl || localStorage.getItem(SOURCE_STORAGE_KEY) || referrerHost);
    } catch {}
  }, []);
  return source;
}
