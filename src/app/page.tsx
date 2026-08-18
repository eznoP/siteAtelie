import { HomeCatalog } from "@/components/catalog/HomeCatalog";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThreadBackground } from "@/components/layout/ThreadBackground";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { Orders } from "@/components/sections/Orders";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={styles.site}>
      <ThreadBackground />
      <Header />
      <main id="conteudo" className={styles.main}>
        <Hero />
        <About />
        <HomeCatalog />
        <Orders />
      </main>
      <Footer />
    </div>
  );
}
