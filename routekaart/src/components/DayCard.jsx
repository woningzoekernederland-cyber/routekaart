import { useState } from "react";
import styles from "./DayCard.module.css";

const DTYPE_ICONS = {
  Aankomstdag: "✈️", Vertrekdag: "🏁", Wandeldag: "🥾", Bergendag: "⛰️",
  Verkendag:   "🔍", Kustdag:    "🌊", Stranddag: "🏖️", Stadsdag:  "🏙️",
  Cultuurdag:  "🏛️", Rijdag:     "🚗", Rustdag:   "😌", Natuurdag: "🌿",
};

export default function DayCard({ day, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const icon = DTYPE_ICONS[day.dayType] || "📍";

  return (
    <div className={`${styles.card} ${open ? styles.exp : ""}`}>
      {/* Header — always visible */}
      <div className={styles.hdr} onClick={() => setOpen((v) => !v)}>
        <div className={styles.num}>
          <span className={styles.numS}>Dag</span>
          <span className={styles.numB}>{day.day}</span>
        </div>
        <div className={styles.hdrMain}>
          <div className={styles.titleRow}>
            <span className={styles.title}>{day.title}</span>
            {day.dayType && (
              <span className={styles.badge}>{icon} {day.dayType}</span>
            )}
          </div>
          <div className={styles.meta}>
            {day.from && day.to && day.from !== day.to && (
              <span className={styles.mi}>📍 {day.from} → {day.to}</span>
            )}
            {day.driveTime && day.driveTime !== "—" && (
              <span className={styles.mi}>🚗 {day.driveTime}</span>
            )}
            {day.distance && day.distance !== "—" && (
              <span className={styles.mi}>📏 {day.distance}</span>
            )}
          </div>
        </div>
        <div className={styles.arrow}>▾</div>
      </div>

      {/* Body — visible when open */}
      {open && (
        <div className={styles.body}>
          <div className={styles.bodyGrid}>
            {/* Stops */}
            <div>
              <div className={styles.subLabel}>Stops & bezienswaardigheden</div>
              <ul className={styles.stopList}>
                {(day.stops || []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Highlights + overnight */}
            <div>
              <div className={styles.subLabel}>Highlights</div>
              <div className={styles.htags}>
                {(day.highlights || []).map((h, i) => (
                  <span key={i} className={styles.htag}>✦ {h}</span>
                ))}
              </div>
              <div className={styles.overnight}>
                <span>🏨</span>
                <div>
                  <strong>Overnachting:</strong> {day.overnight}
                </div>
              </div>
            </div>
          </div>

          {/* Day schedule (optional) */}
          {(day.morning || day.afternoon || day.evening) && (
            <div className={styles.sched}>
              {day.morning && (
                <div className={styles.schedBlock}>
                  <div className={styles.schedTime}>🌅 Ochtend</div>
                  <div className={styles.schedText}>{day.morning}</div>
                </div>
              )}
              {day.afternoon && (
                <div className={styles.schedBlock}>
                  <div className={styles.schedTime}>☀️ Middag</div>
                  <div className={styles.schedText}>{day.afternoon}</div>
                </div>
              )}
              {day.evening && (
                <div className={styles.schedBlock}>
                  <div className={styles.schedTime}>🌙 Avond</div>
                  <div className={styles.schedText}>{day.evening}</div>
                </div>
              )}
            </div>
          )}

          {/* Weather alternative (optional) */}
          {day.weatherAlt && (
            <div className={styles.weatherAlt}>
              🌧️ <div><strong>Slecht-weeroptie:</strong> {day.weatherAlt}</div>
            </div>
          )}

          {/* Rationale */}
          {day.rationale && (
            <div className={styles.rationale}>{day.rationale}</div>
          )}
        </div>
      )}
    </div>
  );
}
