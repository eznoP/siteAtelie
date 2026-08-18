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
          O Avesso nasceu da vontade de devolver presença aos objetos que nos
          cercam.
        </p>
        <p>
          Trabalhamos em pequena escala, com fibras escolhidas pelo toque e
          acabamentos que deixam as mãos aparecerem. Nenhuma peça sai idêntica
          à outra, e é exatamente essa a graça.
        </p>
      </div>

      <figure className={styles.aboutFigure}>
        <div>
          <Image
            src="/products/coelho-bento.svg"
            alt="Coelho Bento, amigurumi feito à mão"
            fill
            sizes="(max-width: 760px) 72vw, 29vw"
            unoptimized
          />
        </div>
      </figure>
    </section>
  );
}
