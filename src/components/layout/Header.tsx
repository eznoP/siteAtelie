"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./layout.module.css";

const navigation = [
  { href: "/#sobre", label: "O ateliê" },
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#encomendas", label: "Contato" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.headerMain}>
        <div className={styles.headerUtility}>
          <Link href="/#catalogo">Ver peças</Link>
        </div>

        <Link
          href="/"
          className={styles.brand}
          aria-label="Belloca Handmade, início"
          style={{
            width: "clamp(10.5rem, 17vw, 14.5rem)",
            padding: "0.28rem 0.6rem",
            background: "#fff",
            borderRadius: "0.35rem",
            boxShadow: "0 8px 24px rgba(0,0,0,.16)",
          }}
        >
          <Image
            src="/brand/belloca-logo.webp"
            alt=""
            width={1000}
            height={400}
            priority
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        </Link>

        <div className={`${styles.headerUtility} ${styles.headerUtilityRight}`}>
          <Link href="/#encomendas">Atendimento</Link>
          <Link href="/admin">Painel</Link>
        </div>

        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Fechar" : "Menu"}</span>
          <i aria-hidden="true" />
        </button>
      </div>

      <nav
        id="site-navigation"
        className={styles.navigation}
        data-open={menuOpen}
        aria-label="Navegação principal"
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link className={styles.navCta} href="/#encomendas" onClick={() => setMenuOpen(false)}>
          Consultar peça
        </Link>
      </nav>
    </header>
  );
}
