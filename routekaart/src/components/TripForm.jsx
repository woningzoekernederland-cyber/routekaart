import { useState } from "react";
import { INTEREST_GROUPS } from "../data/interests.js";
import styles from "./TripForm.module.css";

const TRANSPORT = [
  { v: "auto",   n: "Auto",      i: "🚗" },
  { v: "camper", n: "Camper",    i: "🚌" },
  { v: "motor",  n: "Motor",     i: "🏍️" },
  { v: "ev",     n: "Elektrisch",i: "⚡" },
];
const COMPANY = [
  { v: "solo",     n: "Solo",    i: "🧍" },
  { v: "stel",     n: "Stel",    i: "👫" },
  { v: "gezin",    n: "Gezin",   i: "👨‍👩‍👧" },
  { v: "vrienden", n: "Vrienden",i: "👯" },
  { v: "senioren", n: "Senioren",i: "🧓" },
];
const TEMPO_CARDS = [
  { v: "Rustig",   i: "🌅", d: "Diep verkennen" },
  { v: "Gemiddeld",i: "🗺️", d: "Goede balans" },
  { v: "Actief",   i: "🏃", d: "Veel beleven" },
  { v: "Intensief",i: "⚡", d: "Maximaal zien" },
];
const STYLE_PILLS = [
  { v: "scenic",  l: "🛣️ Scenic drives" },
  { v: "wandelen",l: "🥾 Wandelingen" },
  { v: "cultuur", l: "🏛️ Cultuur & stadjes" },
  { v: "rust",    l: "🧘 Rust & verblijven" },
  { v: "foto",    l: "📷 Fotografie" },
  { v: "lokaal",  l: "🍷 Lokaal eten" },
];
const EXTRA_FILTERS = [
  { v: "kindvriendelijk", l: "👶 Kindvriendelijk" },
  { v: "hondvriendelijk", l: "🐕 Hondvriendelijk" },
  { v: "toegankelijk",    l: "♿ Toegankelijk" },
  { v: "minder-t",        l: "🔍 Vermijd massatoerisme" },
  { v: "highlights",      l: "⭐ Klassieke highlights" },
  { v: "verborgen",       l: "💎 Verborgen parels" },
  { v: "zonsopkomst",     l: "🌄 Zonsopkomst/ondergang" },
  { v: "slecht-weer",     l: "🌧️ Slecht-weeroptie per dag" },
  { v: "ev-laden",        l: "🔋 EV-laadstops" },
  { v: "rustdagen",       l: "😴 Extra rustdagen" },
  { v: "dag-schema",      l: "🕐 Ochtend/middag/avond schema" },
  { v: "instagram",       l: "📸 Instagrammable plekken" },
];

export default function TripForm({ form, onChange, onGenerate, loading }) {
  const [showAdv, setShowAdv] = useState(false);

  const set = (key, val) => onChange({ ...form, [key]: val });
  const toggleArr = (key, val) =>
    set(key, form[key].includes(val) ? form[key].filter((x) => x !== val) : [...form[key], val]);

  const canGenerate = form.start.trim() && form.end.trim();

  return (
    <div className={styles.wrap}>
      {/* Quick-start hint */}
      <div className={styles.qs}>
        💡{" "}
        <span>
          <strong>Snelle start:</strong> Alleen start- en eindpunt zijn genoeg.
          De AI vult slimme standaarden in voor de rest.
        </span>
      </div>

      <div className={styles.card}>
        {/* ── Stap 1: Basis ── */}
        <div className={styles.section}>
          <div className={styles.slbl}>
            <span className={styles.snum}>1</span>
            Reisbasis
            <span className={styles.opt}>— minimaal start + eindpunt</span>
          </div>

          <div className={`${styles.grid3} ${styles.mb}`}>
            <label className={styles.fg}>
              <span className={styles.flbl}>Startpunt <span className={styles.req}>*</span></span>
              <input
                type="text"
                value={form.start}
                onChange={(e) => set("start", e.target.value)}
                placeholder="bijv. Groningen"
                autoComplete="off"
                className={styles.finput}
              />
            </label>
            <label className={styles.fg}>
              <span className={styles.flbl}>Eindpunt <span className={styles.req}>*</span></span>
              <input
                type="text"
                value={form.end}
                onChange={(e) => set("end", e.target.value)}
                placeholder="bijv. Freiburg"
                autoComplete="off"
                className={styles.finput}
              />
            </label>
            <label className={styles.fg}>
              <span className={styles.flbl}>Regio / land <span className={styles.optlbl}>(opt.)</span></span>
              <input
                type="text"
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
                placeholder="bijv. Duitsland, Moezel"
                autoComplete="off"
                className={styles.finput}
              />
            </label>
          </div>

          <div className={styles.grid4}>
            <label className={styles.fg}>
              <span className={styles.flbl}>Dagen <span className={styles.optlbl}>(opt.)</span></span>
              <select value={form.days} onChange={(e) => set("days", e.target.value)} className={styles.fselect}>
                <option value="">Auto (aanbevolen)</option>
                {["3","4","5","6","7","8","9","10","12","14","15","17","20","21","28"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className={styles.fg}>
              <span className={styles.flbl}>Type roadtrip</span>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={styles.fselect}>
                {["Van A naar B","Rondreis","Hub-and-spoke","Kustroute","Bergroute"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className={styles.fg}>
              <span className={styles.flbl}>Reistempo</span>
              <select value={form.tempo} onChange={(e) => set("tempo", e.target.value)} className={styles.fselect}>
                {["Rustig","Gemiddeld","Actief","Intensief"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className={styles.fg}>
              <span className={styles.flbl}>Seizoen</span>
              <select value={form.season} onChange={(e) => set("season", e.target.value)} className={styles.fselect}>
                <option value="">Niet opgegeven</option>
                {["Lente","Zomer","Herfst","Winter","Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* ── Advanced toggle ── */}
        <div className={styles.section}>
          <button className={styles.advBtn} onClick={() => setShowAdv((v) => !v)}>
            <span className={`${styles.advArr} ${showAdv ? styles.open : ""}`}>▾</span>
            Meer voorkeuren instellen
            <span className={styles.advHint}>(vervoer, interesses, budget…)</span>
          </button>

          {showAdv && (
            <div className={styles.advBody}>

              {/* Vervoer */}
              <div className={styles.subSection}>
                <div className={styles.slbl}><span className={styles.snum}>2</span>Vervoer</div>
                <div className={styles.cbtns}>
                  {TRANSPORT.map((t) => (
                    <div
                      key={t.v}
                      className={`${styles.cbtn} ${form.transport === t.v ? styles.on : ""}`}
                      onClick={() => set("transport", t.v)}
                    >
                      <span className={styles.ci}>{t.i}</span>
                      <span className={styles.cn}>{t.n}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gezelschap */}
              <div className={styles.subSection}>
                <div className={styles.slbl}><span className={styles.snum}>3</span>Reisgezelschap</div>
                <div className={styles.cbtns}>
                  {COMPANY.map((t) => (
                    <div
                      key={t.v}
                      className={`${styles.cbtn} ${form.company === t.v ? styles.on : ""}`}
                      onClick={() => set("company", t.v)}
                    >
                      <span className={styles.ci}>{t.i}</span>
                      <span className={styles.cn}>{t.n}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rijstijl */}
              <div className={styles.subSection}>
                <div className={styles.slbl}><span className={styles.snum}>4</span>Rijstijl & overnachting</div>
                <div className={styles.grid3}>
                  <label className={styles.fg}>
                    <span className={styles.flbl}>Max. rijtijd/dag</span>
                    <select value={form.drive} onChange={(e) => set("drive", e.target.value)} className={styles.fselect}>
                      {["Max. 1 uur","Max. 1,5 uur","Max. 2 uur","Max. 3 uur","Max. 4 uur","Max. 5 uur","Flexibel"].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.fg}>
                    <span className={styles.flbl}>Overnachtingsritme</span>
                    <select value={form.sleep} onChange={(e) => set("sleep", e.target.value)} className={styles.fselect}>
                      {["Elke nacht andere plek","2 nachten per plek","3 nachten per plek","Zo min mogelijk verhuizen"].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.fg}>
                    <span className={styles.flbl}>Budget / comfort</span>
                    <select value={form.budget} onChange={(e) => set("budget", e.target.value)} className={styles.fselect}>
                      {["Budgetvriendelijk","Middenklasse","Comfortabel","Premium"].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={`${styles.fg} ${styles.mt}`}>
                  <span className={styles.flbl}>Routevoorkeur</span>
                  <select value={form.route} onChange={(e) => set("route", e.target.value)} className={styles.fselect}>
                    {["Landschappelijk boven snel","Balans snelheid / landschap","Snelste route"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.mt}>
                  <div className={styles.microLabel}>Rijopties</div>
                  <div className={styles.pills}>
                    {["Tol vermijden","Veerboten toestaan","Panoramische routes","Links rijden (VK)"].map((v) => (
                      <div
                        key={v}
                        className={`${styles.pill} ${form.driveX.includes(v) ? styles.on : ""}`}
                        onClick={() => toggleArr("driveX", v)}
                      >
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interesses */}
              <div className={styles.subSection}>
                <div className={styles.slbl}><span className={styles.snum}>5</span>Interesses</div>
                {INTEREST_GROUPS.map((g) => (
                  <div key={g.lbl}>
                    <div className={styles.cgt}>{g.lbl}</div>
                    <div className={styles.crow}>
                      {g.items.map((it) => (
                        <div
                          key={it.id}
                          className={`${styles.chip} ${form.interests.includes(it.id) ? styles.on : ""}`}
                          onClick={() => toggleArr("interests", it.id)}
                        >
                          <span>{it.icon}</span>{it.lbl}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reisstijl */}
              <div className={styles.subSection}>
                <div className={styles.slbl}><span className={styles.snum}>6</span>Reisstijl nadruk</div>
                <div className={styles.pills}>
                  {STYLE_PILLS.map((t) => (
                    <div
                      key={t.v}
                      className={`${styles.pill} ${form.style === t.v ? styles.on : ""}`}
                      onClick={() => set("style", t.v)}
                    >
                      {t.l}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tempo cards */}
              <div className={styles.subSection}>
                <div className={styles.slbl}><span className={styles.snum}>7</span>Tempo (visueel)</div>
                <div className={styles.cbtns}>
                  {TEMPO_CARDS.map((t) => (
                    <div
                      key={t.v}
                      className={`${styles.cbtn} ${form.tempo === t.v ? styles.on : ""}`}
                      onClick={() => set("tempo", t.v)}
                    >
                      <span className={styles.ci}>{t.i}</span>
                      <span className={styles.cn}>{t.v}</span>
                      <span className={styles.cd}>{t.d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra filters */}
              <div className={styles.subSection}>
                <div className={styles.slbl}><span className={styles.snum}>8</span>Extra filters</div>
                <div className={styles.pills}>
                  {EXTRA_FILTERS.map((f) => (
                    <div
                      key={f.v}
                      className={`${styles.pill} ${form.extras.includes(f.v) ? styles.on : ""}`}
                      onClick={() => toggleArr("extras", f.v)}
                    >
                      {f.l}
                    </div>
                  ))}
                </div>
                <div className={`${styles.fg} ${styles.mt}`}>
                  <span className={styles.flbl}>
                    Aanvullende wensen <span className={styles.optlbl}>(opt.)</span>
                  </span>
                  <textarea
                    value={form.extra}
                    onChange={(e) => set("extra", e.target.value)}
                    rows={2}
                    placeholder="bijv. 'Focus op Moezel-vallei', 'Geen grote steden', 'Lokale markten'…"
                    className={styles.ftextarea}
                  />
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Generate bar */}
      <div className={styles.gbar}>
        <div className={styles.ginfo}>
          {canGenerate ? (
            <>
              <strong>{form.start}</strong> → <strong>{form.end}</strong>
              {form.days ? ` · ${form.days} dagen` : ""}
              {form.interests.length ? ` · ${form.interests.length} interesse(s)` : ""}
            </>
          ) : (
            "Vul minimaal een start- en eindpunt in."
          )}
        </div>
        <button
          className={styles.btnGen}
          onClick={onGenerate}
          disabled={!canGenerate || loading}
        >
          {loading ? "⏳ Bezig…" : "→ Genereer mijn roadtrip"}
        </button>
      </div>
    </div>
  );
}
