/**
 * Safely extracts and validates a trip JSON object from a raw AI response string.
 * Handles markdown fencing, leading/trailing text, trailing commas, etc.
 */
export function parseTrip(raw) {
  if (!raw || typeof raw !== "string") throw new Error("EMPTY_RESPONSE");

  // Strip markdown code fences
  let text = raw.trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  // Isolate the JSON object
  const start = text.indexOf("{");
  const end   = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("NO_JSON_FOUND");
  text = text.slice(start, end + 1);

  // First attempt: direct parse
  let obj;
  try {
    obj = JSON.parse(text);
  } catch {
    // Repair attempt: remove trailing commas before } or ]
    const repaired = text.replace(/,(\s*[}\]])/g, "$1");
    try {
      obj = JSON.parse(repaired);
    } catch {
      throw new Error("INVALID_JSON");
    }
  }

  // Schema validation
  if (!obj || typeof obj !== "object")        throw new Error("NOT_AN_OBJECT");
  if (!Array.isArray(obj.days) || obj.days.length === 0) throw new Error("NO_DAYS");

  // Apply safe defaults for every field so the UI never crashes on missing data
  return {
    title:         obj.title         || "Jouw Roadtrip",
    tagline:       obj.tagline       || "Een gepersonaliseerde route.",
    tripStyle:     obj.tripStyle     || "",
    totalDays:     obj.totalDays     || obj.days.length,
    totalDistance: obj.totalDistance || "—",
    totalHubs:     obj.totalHubs     || "—",
    regions:       Array.isArray(obj.regions)    ? obj.regions    : [],
    routeStops:    Array.isArray(obj.routeStops) ? obj.routeStops : [],
    days: obj.days.map((d, i) => ({
      day:         d.day         || i + 1,
      title:       d.title       || `Dag ${i + 1}`,
      dayType:     d.dayType     || "",
      from:        d.from        || "",
      to:          d.to          || "",
      distance:    d.distance    || "—",
      driveTime:   d.driveTime   || "—",
      stops:       Array.isArray(d.stops)      ? d.stops      : [],
      highlights:  Array.isArray(d.highlights) ? d.highlights : [],
      overnight:   d.overnight   || "—",
      rationale:   d.rationale   || "",
      morning:     d.morning     || null,
      afternoon:   d.afternoon   || null,
      evening:     d.evening     || null,
      weatherAlt:  d.weatherAlt  || null,
    })),
  };
}

/**
 * Maps an error code/message to a user-friendly object.
 */
export function getErrorInfo(code = "") {
  const map = {
    EMPTY_RESPONSE: {
      type: "Lege reactie",
      msg:  "De AI gaf een lege reactie terug.",
      hint: "Probeer opnieuw. Soms tijdelijk.",
    },
    NO_JSON_FOUND: {
      type: "Parseerfout",
      msg:  "De routedata kon niet worden gelezen.",
      hint: "Genereer opnieuw of vereenvoudig de invoer.",
    },
    INVALID_JSON: {
      type: "Dataformaat fout",
      msg:  "De route-data had een onverwacht formaat.",
      hint: "Probeer met minder dagen of een eenvoudigere route.",
    },
    NO_DAYS: {
      type: "Onvolledige route",
      msg:  "Er was geen dagplanning in de gegenereerde route.",
      hint: "Genereer opnieuw.",
    },
    RATE_LIMIT: {
      type: "Even geduld",
      msg:  "De AI-service is momenteel overbezet (429).",
      hint: "Wacht 30 seconden en probeer opnieuw.",
    },
    TIMEOUT: {
      type: "Time-out",
      msg:  "Het genereren duurde te lang.",
      hint: "Controleer je verbinding en probeer opnieuw.",
    },
    AUTH: {
      type: "Configuratiefout",
      msg:  "De server kon de AI-service niet bereiken (401/403).",
      hint: "Controleer of ANTHROPIC_API_KEY correct is ingesteld op Netlify.",
    },
    SERVER: {
      type: "Serverfout",
      msg:  "Er is een fout opgetreden op de server.",
      hint: "Probeer opnieuw of bekijk de Netlify function logs.",
    },
  };
  for (const [key, val] of Object.entries(map)) {
    if (code.toUpperCase().includes(key)) return val;
  }
  return {
    type: "Onbekende fout",
    msg:  `Er ging iets mis: ${code}`,
    hint: "Probeer opnieuw.",
  };
}
