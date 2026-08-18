"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { useProducts } from "@/components/providers/ProductProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { AdminDashboard } from "./AdminDashboard";
import styles from "./admin.module.css";

const DEMO_ACCESS = "enzo";
const DEMO_PASSWORD = "1111";
const DEMO_SESSION_KEY = "atelie-avesso.admin-demo-session";

export function AdminAuthGate() {
  const { mode, refresh } = useProducts();
  const [supabase] = useState(() =>
    mode === "supabase" ? createSupabaseBrowserClient() : null,
  );
  const [user, setUser] = useState<User | null>(null);
  const [demoAuthenticated, setDemoAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [accessError, setAccessError] = useState("");

  const loadAdminProducts = useEffectEvent(async () => {
    try {
      await refresh(true);
      setAccessError("");
    } catch (error) {
      setAccessError(
        error instanceof Error ? error.message : "Não foi possível validar o acesso.",
      );
    }
  });

  useEffect(() => {
    if (mode === "demo") {
      try {
        setDemoAuthenticated(
          window.sessionStorage.getItem(DEMO_SESSION_KEY) === "authenticated",
        );
      } catch {
        setDemoAuthenticated(false);
      }
      setLoading(false);
      return;
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user);
      setLoading(false);
      if (data.user) void loadAdminProducts();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) void loadAdminProducts();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [mode, supabase]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setAuthError("");

    const form = new FormData(event.currentTarget);
    const access = String(form.get("access") || "").trim();
    const password = String(form.get("password") || "");

    if (mode === "demo") {
      if (access === DEMO_ACCESS && password === DEMO_PASSWORD) {
        try {
          window.sessionStorage.setItem(DEMO_SESSION_KEY, "authenticated");
        } catch {
          // A sessão ainda funciona nesta aba mesmo se o storage estiver indisponível.
        }
        setDemoAuthenticated(true);
        setLoading(false);
        return;
      }

      setAuthError("Acesso ou senha incorretos.");
      setLoading(false);
      return;
    }

    if (!supabase) {
      setAuthError("Autenticação indisponível.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: access,
      password,
    });

    if (error) {
      setAuthError("Acesso ou senha incorretos.");
      setLoading(false);
    }
  }

  async function handleSignOut() {
    if (mode === "demo") {
      try {
        window.sessionStorage.removeItem(DEMO_SESSION_KEY);
      } catch {
        // Sem efeito: o estado local é suficiente para encerrar a sessão atual.
      }
      setDemoAuthenticated(false);
      return;
    }

    await supabase?.auth.signOut();
  }

  if (loading) {
    return (
      <div className={styles.authScreen} aria-live="polite">
        <div className={styles.loader} aria-hidden="true" />
        <p>Verificando o acesso...</p>
      </div>
    );
  }

  const authenticated = mode === "demo" ? demoAuthenticated : Boolean(user);

  if (!authenticated) {
    return (
      <div className={styles.authScreen}>
        <Link className={styles.authBrand} href="/">
          <span>A</span>
          <strong>AVESSO</strong>
        </Link>
        <form className={styles.loginCard} onSubmit={handleLogin}>
          <p>Painel reservado</p>
          <h1>Entre no ateliê</h1>
          <label>
            Acesso
            <input
              name="access"
              type="text"
              autoComplete="username"
              placeholder={mode === "demo" ? "enzo" : "seu e-mail cadastrado"}
              required
            />
          </label>
          <label>
            Senha
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder={mode === "demo" ? "1111" : undefined}
              required
            />
          </label>
          <button type="submit">Entrar</button>
          {mode === "demo" ? (
            <p className={styles.demoCredentials}>
              Teste: <strong>enzo</strong> / <strong>1111</strong>
            </p>
          ) : null}
          <p className={styles.authError} role="alert">
            {authError}
          </p>
        </form>
      </div>
    );
  }

  return (
    <AdminDashboard
      mode={mode}
      email={mode === "demo" ? DEMO_ACCESS : user?.email}
      accessError={accessError}
      onSignOut={handleSignOut}
    />
  );
}
