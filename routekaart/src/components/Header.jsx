import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.hdr}>
      <div className={styles.logo}>
        <div className={styles.dot} />
        <span className={styles.logoText}>Route</span>
        <span className={styles.logoAccent}>Kaart</span>
      </div>
      <div className={styles.tag}>AI Roadtrip Planner · v5</div>
    </header>
  );
}
