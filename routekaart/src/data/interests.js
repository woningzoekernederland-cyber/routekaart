export const INTEREST_GROUPS = [
  {
    lbl: "🌿 Natuur",
    items: [
      { id: "bergen",      lbl: "Bergen",           icon: "⛰️" },
      { id: "bossen",      lbl: "Bossen",            icon: "🌲" },
      { id: "meren",       lbl: "Meren",             icon: "🏞️" },
      { id: "watervallen", lbl: "Watervallen",        icon: "💧" },
      { id: "natparken",   lbl: "Nationale parken",  icon: "🦌" },
      { id: "wildlife",    lbl: "Wildlife",           icon: "🦅" },
      { id: "uitzicht",    lbl: "Uitzichtpunten",     icon: "🔭" },
      { id: "bloemen",     lbl: "Bloemennatuur",      icon: "🌸" },
    ],
  },
  {
    lbl: "🌊 Kust & water",
    items: [
      { id: "stranden",    lbl: "Stranden",      icon: "🏖️" },
      { id: "kliffen",     lbl: "Kliffen",       icon: "🪨" },
      { id: "baaien",      lbl: "Baaien",        icon: "🌅" },
      { id: "eilanden",    lbl: "Eilanden",      icon: "🏝️" },
      { id: "rivieren",    lbl: "Rivieren",      icon: "🌊" },
      { id: "boot",        lbl: "Boottochten",   icon: "⛵" },
    ],
  },
  {
    lbl: "🏛️ Cultuur & plaatsen",
    items: [
      { id: "grote-steden",  lbl: "Grote steden",           icon: "🏙️" },
      { id: "hist-steden",   lbl: "Historische steden",     icon: "🕍" },
      { id: "dorpen",        lbl: "Charmante dorpjes",       icon: "🏡" },
      { id: "kastelen",      lbl: "Kastelen",                icon: "🏰" },
      { id: "ruines",        lbl: "Ruïnes",                  icon: "🏚️" },
      { id: "musea",         lbl: "Musea",                   icon: "🖼️" },
      { id: "erfgoed",       lbl: "Erfgoed",                 icon: "📜" },
      { id: "film",          lbl: "Film/serie locaties",     icon: "🎬" },
    ],
  },
  {
    lbl: "🏃 Actief",
    items: [
      { id: "wand-licht",  lbl: "Wandelen licht",      icon: "🚶" },
      { id: "wand-int",    lbl: "Wandelen intensief",  icon: "🥾" },
      { id: "hiken",       lbl: "Hiken",               icon: "⛏️" },
      { id: "fietsen",     lbl: "Fietsen",             icon: "🚴" },
      { id: "kajakken",    lbl: "Kajakken",            icon: "🛶" },
      { id: "veel-stops",  lbl: "Veel stops",          icon: "📍" },
    ],
  },
  {
    lbl: "✨ Sfeer & leefstijl",
    items: [
      { id: "romantisch",   lbl: "Romantisch",              icon: "💑" },
      { id: "luxe",         lbl: "Luxe",                    icon: "🥂" },
      { id: "lokaal-eten",  lbl: "Lokaal eten",             icon: "🍽️" },
      { id: "wijn",         lbl: "Wijn & streekproducten",  icon: "🍷" },
      { id: "fotografie",   lbl: "Fotografie",              icon: "📷" },
      { id: "verborgen",    lbl: "Verborgen parels",        icon: "💎" },
      { id: "highlights",   lbl: "Bekende highlights",      icon: "⭐" },
      { id: "min-toerist",  lbl: "Minder toeristisch",      icon: "🧭" },
    ],
  },
];

export function interestLabel(id) {
  for (const g of INTEREST_GROUPS) {
    const it = g.items.find((x) => x.id === id);
    if (it) return it.lbl;
  }
  return id;
}
