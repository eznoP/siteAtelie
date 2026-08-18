"use client";

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

        <Link href="/" className={styles.brand} aria-label="Ateliê Avesso, início">
          <strong>AVESSO</strong>
          <small>ATELIÊ</small>
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
