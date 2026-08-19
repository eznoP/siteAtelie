import { PreviewCard } from "./PreviewCard";
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

      <div className={styles.aboutFigure}>
        <PreviewCard
          index={1}
          label="Novidades Belloca"
          emptyLabel="Prévia em breve..."
          emptyDescription="Em breve, este espaço destacará mais uma peça da coleção com foto, nome e detalhes."
        />
      </div>
    </section>
  );
}
