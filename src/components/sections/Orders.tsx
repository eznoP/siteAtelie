import styles from "./sections.module.css";

export function Orders() {
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || "#";

  return (
    <section id="encomendas" className={styles.orders} aria-labelledby="orders-title">
      <div className={styles.ordersCopy}>
        <p className={styles.eyebrow}>Contato</p>
        <h2 id="orders-title">Encomende ou consulte a peça</h2>
        <div className={styles.orderText}>
          <p>Fale diretamente comigo sobre a peça desejada e faremos um acordo!</p>
          <p>Para facilitar, mande-me vídeos ou instruções da peça.</p>
        </div>
      </div>

      <div className={styles.orderContact}>
        <p>Quer consultar uma peça pronta ou conversar sobre uma encomenda?</p>
        <a
          className={styles.whatsappButton}
          href={whatsappUrl}
          target={whatsappUrl === "#" ? undefined : "_blank"}
          rel={whatsappUrl === "#" ? undefined : "noreferrer"}
          aria-label="Entrar em contato pelo WhatsApp"
        >
          Falar pelo WhatsApp
          <span aria-hidden="true">↗</span>
        </a>
        {whatsappUrl === "#" ? (
          <small>Adicione o link do WhatsApp em NEXT_PUBLIC_WHATSAPP_URL.</small>
        ) : null}
      </div>
    </section>
  );
}
