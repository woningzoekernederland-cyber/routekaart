import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.grid} />
      <div className={styles.glow} />
      {/* Inline SVG — geen externe assets nodig */}
      <svg
        className={styles.deco}
        width="460"
        height="290"
        viewBox="0 0 460 290"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 290L115 125l63 63 100-136 62 82 54-62 66 72V290Z"
          fill="#3ecfc6"
          opacity=".28"
        />
        <path
          d="M0 290L70 182l72 54 92-144 74 72 66-54 86 72V290Z"
          fill="#3ecfc6"
          opacity=".14"
        />
        <circle cx="278" cy="52"  r="5"   fill="#f5b731" opacity=".9" />
        <circle cx="115" cy="125" r="3.5" fill="#3ecfc6" opacity=".9" />
        <circle cx="394" cy="72"  r="3.5" fill="#3ecfc6" opacity=".8" />
        <path
          d="M0 255Q85 240 178 260Q272 282 358 260Q412 250 460 264"
          stroke="#f5b731"
          strokeWidth="1.7"
          fill="none"
          strokeDasharray="6 4"
          opacity=".45"
        />
      </svg>

      <div className={styles.inner}>
        <div className={styles.eyebrow}>AI Roadtrip Planner</div>
        <h1 className={styles.h1}>
          Plan je reis.<br />
          <em>Echt. Concreet. Jouw route.</em>
        </h1>
        <p className={styles.sub}>
          Vul start- en eindpunt in. De AI genereert een route met echte
          plaatsen, concrete bezienswaardigheden en realistische reistijden.
        </p>
        <div className={styles.stats}>
          <div>
            <div className={styles.val}>AI</div>
            <div className={styles.lbl}>Echte data</div>
          </div>
          <div>
            <div className={styles.val}>∞</div>
            <div className={styles.lbl}>Bestemmingen</div>
          </div>
          <div>
            <div className={styles.val}>40+</div>
            <div className={styles.lbl}>Filters</div>
          </div>
        </div>
      </div>
    </section>
  );
}
