import { useState, useRef } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import TripForm from "./components/TripForm.jsx";
import TripResult from "./components/TripResult.jsx";
import { buildPrompt } from "./utils/prompt.js";
import { parseTrip, getErrorInfo } from "./utils/parseTrip.js";
import styles from "./App.module.css";

const DEFAULT_FORM = {
  start:     "",
  end:       "",
  region:    "",
  days:      "",
  type:      "Van A naar B",
  tempo:     "Gemiddeld",
  season:    "",
  transport: "auto",
  company:   "stel",
  drive:     "Max. 3 uur",
  sleep:     "2 nachten per plek",
  budget:    "Middenklasse",
  route:     "Landschappelijk boven snel",
  driveX:    [],
  interests: [],
  style:     "scenic",
  extras:    [],
  extra:     "",
};

export default function App() {
  const [form, setForm]       = useState(DEFAULT_FORM);
  const [trip, setTrip]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const resultRef             = useRef(null);

  async function generate() {
    if (!form.start.trim() || !form.end.trim()) return;

    setError(null);
    setTrip(null);
    setLoading(true);

    // Scroll to the loading indicator
    setTimeout(
      () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      80
    );

    try {
      const prompt = buildPrompt(form);

      // POST to our own Netlify function — the API key never touches the browser
      const res = await fetch("/.netlify/functions/generate-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        // The function returns { error, code } on failure
        throw new Error(data.code || `HTTP_${res.status}`);
      }

      // data.text is the raw AI output
      const parsed = parseTrip(data.text);
      setTrip(parsed);

      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        100
      );
    } catch (err) {
      console.error("[RouteKaart] generate error:", err);
      setError(getErrorInfo(err.message || String(err)));
    } finally {
      setLoading(false);
    }
  }

  function handleRegenerate() {
    setTrip(null);
    generate();
  }

  return (
    <>
      <Header />
      <Hero />

      <main className={styles.main}>
        <TripForm
          form={form}
          onChange={setForm}
          onGenerate={generate}
          loading={loading}
        />

        {/* Error box */}
        {error && (
          <div className={styles.errBox}>
            <div className={styles.errType}>{error.type}</div>
            <div className={styles.errMsg}>{error.msg}</div>
            <div className={styles.errHint}>{error.hint}</div>
            <div className={styles.errActions}>
              <button className={styles.btnSm} onClick={generate}>
                ↺ Opnieuw proberen
              </button>
              <button className={styles.btnSm} onClick={() => setError(null)}>
                ✕ Sluiten
              </button>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div ref={resultRef} className={styles.loadWrap}>
            <div className={styles.ring} />
            <div className={styles.ldTitle}>Route wordt samengesteld…</div>
            <div className={styles.ldSub}>
              <div className={styles.ldStep}>📍 Corridor en tussenstops bepalen</div>
              <div className={styles.ldStep}>🗺️ Echte plaatsen en bezienswaardigheden ophalen</div>
              <div className={styles.ldStep}>📅 Dagindeling en reistijden optimaliseren</div>
            </div>
          </div>
        )}

        {/* Result */}
        {trip && !loading && (
          <div ref={resultRef}>
            <TripResult
              trip={trip}
              form={form}
              onRegenerate={handleRegenerate}
            />
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        RouteKaart · AI-aangedreven roadtrip planner ·
        <span className={styles.footerNote}>
          {" "}Routes gegenereerd via Claude AI — echte plaatsen, realistische reistijden.
        </span>
      </footer>
    </>
  );
}
