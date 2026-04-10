export function buildCompact(trip, form) {
  let t = `${trip.title}\n${trip.tagline}\n${"─".repeat(48)}\n`;
  t += `${form.start} → ${form.end} · ${trip.totalDays} dagen · ${trip.totalDistance}\n\n`;
  t += `ROUTE:\n`;
  t += trip.routeStops
    .map((s, i) => `${i + 1}. ${s.name}${s.nights > 0 ? ` (${s.nights}n)` : ""}`)
    .join(" → ");
  t += "\n\n";
  trip.days.forEach((d) => {
    t += `Dag ${d.day}: ${d.title}\n`;
    t += `  ${d.from} → ${d.to} (${d.driveTime}, ${d.distance})\n`;
    t += `  Overnachting: ${d.overnight}\n`;
  });
  return t;
}

export function buildFull(trip, form) {
  const line = "═".repeat(52);
  let t = `${line}\n  ${trip.title.toUpperCase()}\n  ${trip.tagline}\n${line}\n\n`;
  t += `Van: ${form.start}  →  Naar: ${form.end}\n`;
  t += `Duur: ${trip.totalDays} dagen  |  Afstand: ${trip.totalDistance}\n`;
  t += `Regio's: ${trip.regions.join(", ")}\n`;
  if (trip.tripStyle) t += `Sfeer: ${trip.tripStyle}\n`;
  t += `\nROUTE:\n`;
  t += trip.routeStops
    .map((s, i) => `  ${i + 1}. ${s.name}${s.nights > 0 ? ` — ${s.nights} nachten` : ""}`)
    .join("\n");
  t += "\n\n─────\n\n";
  trip.days.forEach((d) => {
    t += `DAG ${d.day} — ${d.title}${d.dayType ? ` [${d.dayType}]` : ""}\n`;
    t += `Traject: ${d.from} → ${d.to}  (${d.distance}, ${d.driveTime})\n`;
    t += `Stops: ${d.stops.join(", ")}\n`;
    t += `Highlights: ${d.highlights.join(" · ")}\n`;
    t += `Overnachting: ${d.overnight}\n`;
    if (d.morning)    t += `Ochtend: ${d.morning}\n`;
    if (d.afternoon)  t += `Middag: ${d.afternoon}\n`;
    if (d.evening)    t += `Avond: ${d.evening}\n`;
    if (d.weatherAlt) t += `Slecht weer: ${d.weatherAlt}\n`;
    t += `${d.rationale}\n\n`;
  });
  return t;
}

export function buildShare(trip, form) {
  let t = `✈️ ${trip.title}\n"${trip.tagline}"\n\n`;
  t += `📍 ${form.start} → ${form.end} · ${trip.totalDays} dagen\n\n`;
  trip.days.slice(0, 4).forEach((d) => {
    t += `Dag ${d.day}: ${d.title}\n`;
    t += `  ✦ ${d.highlights.slice(0, 2).join(" · ")}\n\n`;
  });
  if (trip.days.length > 4) {
    t += `... en nog ${trip.days.length - 4} meer avontuurlijke dagen!\n\n`;
  }
  const tag = (trip.regions[0] || "europa").toLowerCase().replace(/[^a-z]/g, "");
  t += `#roadtrip #reizen #${tag}`;
  return t;
}
