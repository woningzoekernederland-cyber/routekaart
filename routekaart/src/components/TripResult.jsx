import { useState } from "react";
import DayCard from "./DayCard.jsx";
import { buildCompact, buildFull, buildShare } from "../utils/export.js";
import styles from "./TripResult.module.css";

function RouteVisual({ stops }) {
  if (!stops?.length) return null;
  return (
    <div className={styles.rvis}>
      {stops.map((s, i) => (
        <div key={i} className={styles.rnodeWrap}>
          <div className={styles.rnode}>
            <div
              className={[
                styles.rdot,
                s.type === "start" ? styles.rdotStart : "",
                s.type === "end"   ? styles.rdotEnd   : "",
                s.type === "hub"   ? styles.rdotHub    : "",
              ].join(" ")}
            />
            <div className={styles.rnLabel}>{s.name}</div>
            {s.nights > 0 && (
              <div className={styles.rnNights}>{s.nights}n</div>
            )}
          </div>
          {i < stops.length - 1 && (
            <div className={styles.rcon}>
              <div className={styles.rcLine} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function TripResult({ trip, form, onRegenerate }) {
  const [expandAll, setExpandAll] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [activeTab, setActiveTab] = useState("compact");
  const [copied, setCopied] = useState(false);

  const exportTexts = {
    compact:  buildCompact(trip, form),
    volledig: buildFull(trip, form),
    deelbaar: buildShare(trip, form),
  };

  function copyText() {
    navigator.clipboard.writeText(exportTexts[activeTab]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  return (
    <div className={`${styles.wrap} fi`}>
      {/* ── Trip header ── */}
      <div className={styles.th}>
        <div className={styles.thGrid}>
          <div>
            <h2 className={styles.thTitle}>{trip.title}</h2>
            <p className={styles.thTag}>{trip.tagline}</p>
            {trip.tripStyle && <p className={styles.thStyle}>{trip.tripStyle}</p>}
            <div className={styles.mpills}>
              <span className={`${styles.mp} ${styles.mpAc}`}>📅 {trip.totalDays} dagen</span>
              <span className={styles.mp}>🚗 {trip.totalDistance}</span>
              <span className={styles.mp}>🏨 {trip.totalHubs} verblijfslocs.</span>
              {trip.regions.length > 0 && (
                <span className={styles.mp}>
                  🗺️ {trip.regions.length} regio{trip.regions.length > 1 ? "'s" : ""}
                </span>
              )}
            </div>
          </div>
          <div className={styles.thActs}>
            <button className={styles.btnA} onClick={onRegenerate}>
              ↺ Opnieuw
            </button>
            <button
              className={`${styles.btnA} ${styles.btnPr}`}
              onClick={() => setShowExport((v) => !v)}
            >
              {showExport ? "⬆ Verberg" : "⬇ Exporteer"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Route visual ── */}
      <div className={styles.rmap}>
        <div className={styles.rmapLabel}>Routevolgorde</div>
        <RouteVisual stops={trip.routeStops} />
      </div>

      {/* ── Regions ── */}
      {trip.regions.length > 0 && (
        <div className={styles.regs}>
          {trip.regions.map((r, i) => (
            <div key={i} className={styles.reg}>{r}</div>
          ))}
        </div>
      )}

      {/* ── Day controls ── */}
      <div className={styles.dctrls}>
        <button className={styles.btnSm} onClick={() => setExpandAll(true)}>
          ↕ Alles uitklappen
        </button>
        <button className={styles.btnSm} onClick={() => setExpandAll(false)}>
          ↕ Alles inklappen
        </button>
      </div>

      {/* ── Day cards ── */}
      <div className={styles.dlist}>
        {trip.days.map((d, i) => (
          <DayCard
            key={`${d.day}-${expandAll}`}
            day={d}
            defaultOpen={expandAll || i < 2}
          />
        ))}
      </div>

      {/* ── Export panel ── */}
      {showExport && (
        <div className={`${styles.expp} fi`}>
          <div className={styles.etabs}>
            {["compact", "volledig", "deelbaar"].map((tab) => (
              <div
                key={tab}
                className={`${styles.etab} ${activeTab === tab ? styles.etabOn : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </div>
            ))}
          </div>
          <pre className={styles.etxt}>{exportTexts[activeTab]}</pre>
          <div className={styles.eacts}>
            <button className={`${styles.btnA} ${styles.btnPr}`} onClick={copyText}>
              ⎘ Kopieer
            </button>
            <button className={styles.btnA} onClick={() => window.print()}>
              🖨 Print
            </button>
            {copied && <span className={styles.cpok}>✔ Gekopieerd!</span>}
          </div>
        </div>
      )}
    </div>
  );
}
