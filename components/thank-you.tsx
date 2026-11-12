"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { calendarLink, dayLabel, type SiteSettings } from "@/lib/settings-shared";
import { CalIcon, Logo, TgIcon, YtIcon } from "@/components/icons";
import { LangToggle, useLang } from "@/components/use-lang";

type U = { name: string; email: string; image: string | null };
type R = { seat: number; name: string; phone: string };

/**
 * Confirmation page shown once a registration exists. This used to be a branch
 * inside RegisterFlow; it lives on its own route so the form has a real
 * destination to land on and so the URL can be shared, bookmarked and tracked.
 *
 * All copy comes from the same admin-editable EN/AM settings the rest of the
 * site uses — no strings are hardcoded here.
 */
export default function ThankYou({ s, user, reg }: { s: SiteSettings; user: U; reg: R }) {
  const [lang, setLang] = useLang(s.defaultLang);
  const t = s.text[lang];
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

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
          <h1>{t.rDone}</h1>
          <div className="seat">{t.rSeat} #{reg.seat}</div>
          <p className="lead">{t.rDoneSub}</p>

          <div className="todo">
            <a className="btn btn-red" href={s.telegramLink} target="_blank" rel="noopener">
              <span className="n">1</span><TgIcon />{t.rTg}
            </a>
            <a className="btn btn-line" href={s.subLink} target="_blank" rel="noopener">
              <span className="n">2</span><YtIcon />{t.rSubYt}
            </a>
            <div>
              <div className="btn btn-line" style={{ width: "100%", justifyContent: "flex-start", cursor: "default" }}>
                <span className="n">3</span><CalIcon />{t.rCal}
              </div>
              <div className="cal">
                {s.days.map((d, i) => (
                  <a
                    key={i}
                    target="_blank"
                    rel="noopener"
                    href={calendarLink(
                      `${t.dayL} ${i + 1} — YouTube Monetization Live`,
                      `${t.titles[i] ?? ""}\n${s.subLink}`,
                      d,
                    )}
                  >
                    {t.dayL} {i + 1} · {dayLabel(d.start)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="who-me">
            {user.image
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={user.image} alt="" />
              : <span className="ph">{user.name.charAt(0)}</span>}
            <div><b>{reg.name}</b><span>{user.email} · {reg.phone}</span></div>
          </div>

          <div className="rg-foot">
            <Link href="/">{t.rBack}</Link>
            <button type="button" onClick={signOut}>{t.rSignOut}</button>
          </div>
        </div>
      </main>
    </div>
  );
}
