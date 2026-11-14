"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { GoogleIcon, Logo } from "@/components/icons";

const WRONG_CREDENTIALS_MESSAGE = "Wrong email or password.";

export default function AdminLogin() {
  return (
    <main className="adm-login">
      <div className="rg-card">
        <Logo className="logo" eager />
        <h1 style={{ fontSize: 24, marginTop: 18 }}>Admin</h1>
        <p className="lead">Sign in with your admin email and password.</p>
        <PasswordLogin />
        <span className="login-or">or</span>
        <GoogleLogin />
      </div>
    </main>
  );
}

function PasswordLogin() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    const result = await authClient.signIn.email({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    if (result.error) {
      setError(WRONG_CREDENTIALS_MESSAGE);
      setPending(false);
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={submit}>
      <div className="fld"><label htmlFor="admin-email">Email</label><input id="admin-email" name="email" type="email" autoComplete="username" required /></div>
      <div className="fld"><label htmlFor="admin-password">Password</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required /></div>
      {error && <p className="err" role="alert">{error}</p>}
      <button className="btn btn-red" style={{ width: "100%", marginTop: 18 }} disabled={pending}>{pending ? "…" : "Sign in"}</button>
    </form>
  );
}

function GoogleLogin() {
  const [pending, setPending] = useState(false);
  const signIn = async () => {
    setPending(true);
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/admin" });
    if (error) setPending(false);
  };
  return (
    <button className="gbtn" style={{ marginTop: 0 }} disabled={pending} onClick={signIn}>
      <GoogleIcon />{pending ? "…" : "Continue with Google"}
    </button>
  );
}

export function SignOutButton() {
  return (
    <button className="btn btn-line btn-sm" onClick={async () => { await authClient.signOut(); location.href = "/"; }}>
      Sign out
    </button>
  );
}
