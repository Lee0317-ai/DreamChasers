import Link from "next/link";
import styles from "./HulebuGamePage.module.css";

export function HulebuGamePage() {
  return (
    <main className={styles.shell} aria-label="胡了卜网页试玩">
      <header className={styles.toolbar}>
        <Link className={styles.backLink} href="/games">
          游戏馆
        </Link>
        <strong className={styles.title}>胡了卜</strong>
        <a className={styles.tunerLink} href="/games/hulebu-demo/tuner.html" rel="noreferrer" target="_blank">
          调牌器
        </a>
      </header>
      <iframe
        className={styles.frame}
        src="/games/hulebu-demo/index.html"
        title="胡了卜试玩 Demo"
      />
    </main>
  );
}
