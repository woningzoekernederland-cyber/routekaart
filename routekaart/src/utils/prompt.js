import { interestLabel } from "../data/interests.js";

/**
 * Builds a structured prompt for the route-generation AI call.
 * Called from the frontend; the actual API call happens server-side.
 */
export function buildPrompt(form) {
  const stopsPerDayMap = { Rustig: 2, Gemiddeld: 3, Actief: 4, Intensief: 5 };
  const spd = stopsPerDayMap[form.tempo] || 3;
  const nph = form.sleep?.includes("3") ? 3 : form.sleep?.includes("Elke") ? 1 : 2;
  const estDays = form.days ? parseInt(form.days, 10) : Math.max(5, nph * 4 + 2);
  const interestLabels = (form.interests || []).map(interestLabel);
  const daySchema  = (form.extras || []).includes("dag-schema");
  const slechtweer = (form.extras || []).includes("slecht-weer");

  return `Je bent een expert Europese roadtrip-planner met diepgaande kennis van echte routes, plaatsnamen, reistijden en bezienswaardigheden.

OPDRACHT: Genereer een uitgebreide, geografisch correcte roadtrip van ${form.start} naar ${form.end}.

REISPARAMETERS:
- Route: ${form.start} → ${form.end}
- Regio/land: ${form.region || "automatisch bepalen op basis van de route"}
- Gewenst aantal dagen: ${estDays}
- Overnachtingsritme: ${form.sleep || "2 nachten per plek"} (ca. ${nph} nachten per hub)
- Vervoer: ${form.transport || "auto"}
- Gezelschap: ${form.company || "stel"}
- Tempo: ${form.tempo || "Gemiddeld"} (ca. ${spd} stops per dag)
- Max. rijtijd per dag: ${form.drive || "Max. 3 uur"}
- Seizoen: ${form.season || "niet opgegeven"}
- Budget: ${form.budget || "Middenklasse"}
- Routevoorkeur: ${form.route || "Landschappelijk boven snel"}
- Type trip: ${form.type || "Van A naar B"}
- Reisstijl nadruk: ${form.style || "scenic drives"}
- Interesses: ${interestLabels.length ? interestLabels.join(", ") : "gebalanceerde mix"}
- Extra filters: ${(form.extras || []).length ? form.extras.join(", ") : "geen"}
- Vrije wensen: ${form.extra || "geen"}
- Rijopties: ${(form.driveX || []).length ? form.driveX.join(", ") : "standaard"}

STRIKTE EISEN — VERPLICHT NA TE LEVEN:
1. Gebruik UITSLUITEND echte, bestaande plaatsnamen. Geen "Startregio", "Tussenstop A" of andere placeholders.
2. De route moet geografisch logisch zijn: volg de meest realistische corridor van ${form.start} naar ${form.end}.
3. Geef per dag concrete, specifieke stops (bijv. "Dom van Keulen", niet "historisch centrum").
4. Reistijden en afstanden moeten realistisch zijn voor Europese wegen (rekening houdend met snelwegen en landwegen).
5. Varieer dagtitels — geen herhalende formuleringen.
6. Rationale per dag moet locatie-specifiek zijn.
7. Voeg echte lokale culinaire of culturele tips toe per dag.
8. Bij ${nph} nachten per hub: groepeer opeenvolgende dagen per verblijfsplaats logisch.
${daySchema  ? "9. Geef voor elke dag concrete ochtend-, middag- en avondsuggesties." : ""}
${slechtweer ? "10. Geef per dag een specifieke slecht-weeroptie (bijv. een bepaald museum of indoor attractie)." : ""}

ANTWOORD: Geef UITSLUITEND geldig JSON terug. Geen markdown-fencing, geen uitleg buiten JSON. Begin direct met {

JSON-STRUCTUUR:
{
  "title": "Creatieve, specifieke naam voor deze roadtrip",
  "tagline": "Sfeervolle subtitel van maximaal 12 woorden",
  "tripStyle": "Beschrijving van de reissfeer in 1-2 zinnen",
  "totalDays": ${estDays},
  "totalDistance": "realistisch totaal in km, bijv. 1.240 km",
  "totalHubs": "aantal unieke verblijfslocaties als getal",
  "regions": ["echte regio of landnaam 1", "echte regio of landnaam 2"],
  "routeStops": [
    { "name": "Echte plaatsnaam", "type": "start|hub|stop|end", "nights": 0 }
  ],
  "days": [
    {
      "day": 1,
      "title": "Specifieke dagtitel met echte plaatsnaam",
      "dayType": "Aankomstdag|Rijdag|Verkendag|Rustdag|Wandeldag|Kustdag|Cultuurdag|Stadsdag|Bergendag",
      "from": "Echte vertrekplaats",
      "to": "Echte aankomstplaats",
      "distance": "realistisch km getal, bijv. 142 km",
      "driveTime": "realistische rijduur, bijv. 2 u 10 min",
      "stops": [
        "Specifieke stop met korte beschrijving, bijv. Dom van Keulen (gotische kathedraal, 13e eeuw)",
        "Stop 2",
        "Stop 3"
      ],
      "highlights": ["Concreet highlight 1", "Concreet highlight 2"],
      "overnight": "Specifieke verblijfsplaats, wijk of type, bijv. Keulen — hotel in de Altstadt",
      "rationale": "Waarom deze dagindeling logisch en mooi is — locatie-specifiek (2-3 zinnen)"
      ${daySchema  ? ', "morning": "Concrete ochtendactiviteit", "afternoon": "Concrete middagactiviteit", "evening": "Concreet avondplan"' : ""}
      ${slechtweer ? ', "weatherAlt": "Specifieke binnenlocatie of activiteit bij slecht weer"' : ""}
    }
  ]
}`;
}
