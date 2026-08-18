import Link from "next/link";
import styles from "./sections.module.css";

export function Contact() {
  return (
    <section id="contato" className={styles.contact} aria-labelledby="contact-title">
      <p className={styles.eyebrow}>Contato</p>
      <h2 id="contact-title">
        Vamos puxar
        <br />
        <em>esse fio?</em>
      </h2>
      <div className={styles.contactLinks}>
        <a href="mailto:oi@atelieavesso.com.br">
          <span>E-mail</span>
          <strong>oi@atelieavesso.com.br</strong>
          <i aria-hidden="true">↗</i>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          <span>Instagram</span>
          <strong>@atelieavesso</strong>
          <i aria-hidden="true">↗</i>
        </a>
        <Link href="/#encomendas">
          <span>Encomendas</span>
          <strong>Começar uma conversa</strong>
          <i aria-hidden="true">↗</i>
        </Link>
      </div>
      <p className={styles.contactAside}>
        Atendimento online · envios para todo o Brasil
      </p>
    </section>
  );
}
