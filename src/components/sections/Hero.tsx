import Image from "next/image";
import Link from "next/link";
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
          E um pouco de tempo. Criamos peças para vestir, morar e guardar,
          respeitando o ritmo de cada ponto.
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

      <figure className={styles.heroFigure}>
        <div className={styles.heroImageWrap}>
          <Image
            src="/products/bolsa-aurora.svg"
            alt="Ilustração da Bolsa Aurora em crochê rosa"
            fill
            priority
            sizes="(max-width: 760px) 70vw, 31vw"
            unoptimized
          />
        </div>
        <figcaption>
          <strong>Bolsa Aurora</strong>
        </figcaption>
      </figure>
    </section>
  );
}
