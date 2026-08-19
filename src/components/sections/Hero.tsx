import Link from "next/link";
import { PreviewCard } from "./PreviewCard";
import styles from "./sections.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroIntro}>
        <h1 id="hero-title">
          <span>Toda peça</span>
          <span>começa com</span>
          <em>um fio.</em>
        </h1>
        <p className={styles.heroText}>
          E um pouco de tempo. A Belloca cria peças de crochê feitas à mão,
          respeitando o ritmo e a personalidade de cada ponto.
        </p>
        <div className={styles.heroActions}>
          <Link className={styles.primaryButton} href="#catalogo">
            Conhecer as peças
            <span aria-hidden="true">↘</span>
          </Link>
          <Link className={styles.textLink} href="#sobre">
            Ver como fazemos
          </Link>
        </div>
      </div>

      <div className={styles.heroFigure}>
        <PreviewCard
          label="Catálogo Belloca"
          emptyLabel="Prévia em breve..."
          emptyDescription="As primeiras peças reais serão exibidas aqui assim que o catálogo começar a ser publicado."
        />
      </div>
    </section>
  );
}
