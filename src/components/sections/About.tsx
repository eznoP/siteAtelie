import Image from "next/image";
import styles from "./sections.module.css";

export function About() {
  return (
    <section id="sobre" className={styles.about} aria-labelledby="about-title">
      <div className={styles.aboutHeading}>
        <p className={styles.eyebrow}>O ateliê</p>
        <h2 id="about-title">
          Aqui, pressa
          <br />
          <em>não entra.</em>
        </h2>
      </div>

      <div className={styles.aboutStory}>
        <p className={styles.aboutLead}>
          A Belloca nasceu da vontade de transformar fios em peças com presença,
          cuidado e personalidade.
        </p>
        <p>
          Trabalhamos em pequena escala, com materiais escolhidos pelo toque e
          acabamentos que valorizam o feito à mão. Cada peça pode carregar pequenas
          diferenças — e é justamente isso que torna o artesanal único.
        </p>
      </div>

      <figure className={styles.aboutFigure} aria-label="Belloca Handmade">
        <div
          style={{ aspectRatio: "5 / 2", background: "#fff", border: "1px solid #ddd" }}
        >
          <Image
            src="/brand/belloca-logo.webp"
            alt="Logo Belloca Handmade"
            fill
            sizes="(max-width: 760px) 72vw, 29vw"
            style={{ objectFit: "contain" }}
          />
        </div>
      </figure>
    </section>
  );
}
