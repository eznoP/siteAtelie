import Link from "next/link";
import styles from "./layout.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBrand}>
        <strong>AVESSO</strong>
        <small>ATELIÊ</small>
      </div>
      <nav aria-label="Navegação do rodapé">
        <Link href="/#catalogo">Catálogo</Link>
        <Link href="/#encomendas">Contato</Link>
        <Link href="/admin">Painel</Link>
      </nav>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} · Brasil
      </p>
    </footer>
  );
}
