# RouteKaart — AI Roadtrip Planner

Een volledig deploybare roadtrip planner gebouwd met Vite + React + Netlify Functions.  
De AI (Claude) genereert routes met **echte plaatsnamen, concrete bezienswaardigheden en realistische reistijden**.

---

## Projectstructuur

```
routekaart/
├── index.html                          ← HTML entry point
├── package.json
├── vite.config.js
├── netlify.toml
├── .env.example
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx                        ← React bootstrap
│   ├── App.jsx                         ← Hoofdlogica + API-call
│   ├── App.module.css
│   ├── index.css                       ← Globale CSS-variabelen
│   ├── data/
│   │   └── interests.js                ← Interesse-groepen data
│   ├── utils/
│   │   ├── prompt.js                   ← Bouwt AI-prompt
│   │   ├── parseTrip.js                ← JSON-extractie + validatie
│   │   └── export.js                   ← Export-tekst builders
│   └── components/
│       ├── Header.jsx / .module.css
│       ├── Hero.jsx / .module.css
│       ├── TripForm.jsx / .module.css  ← Formulier met alle filters
│       ├── DayCard.jsx / .module.css   ← Inklapbare dagkaart
│       └── TripResult.jsx / .module.css← Resultaatweergave
└── netlify/
    └── functions/
        └── generate-route.js           ← Server-side Anthropic proxy
```

---

## Lokaal draaien

### 1. Installeer dependencies

```bash
npm install
```

### 2. Maak een `.env.local` bestand

```bash
cp .env.example .env.local
# Vul je Anthropic API key in:
# ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Installeer Netlify CLI (eenmalig)

```bash
npm install -g netlify-cli
```

### 4. Start lokale development server (inclusief Functions)

```bash
netlify dev
```

De app draait op `http://localhost:8888`.  
De Netlify Function draait mee op `http://localhost:8888/.netlify/functions/generate-route`.

> **Waarom `netlify dev` en niet `npm run dev`?**  
> `netlify dev` start zowel Vite als de Functions-emulator tegelijk.  
> Met alleen `npm run dev` werkt de generate-knop niet (de Function draait dan niet).

---

## Deployen op Netlify

### Optie A — Via Netlify website (aanbevolen voor beginners)

1. Push je project naar GitHub (of GitLab / Bitbucket).
2. Ga naar [netlify.com](https://netlify.com) en log in.
3. Klik **"Add new site" → "Import an existing project"**.
4. Selecteer je GitHub repository.
5. Netlify detecteert automatisch de build-instellingen via `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
6. Klik **"Deploy site"**.
7. Voeg je API key toe (zie stap hieronder).

### Optie B — Via Netlify CLI

```bash
netlify login
netlify init          # koppel aan een Netlify site
netlify deploy --prod # deploy naar productie
```

---

## Environment variables instellen

In de Netlify-dashboard:  
**Site Settings → Environment variables → Add variable**

| Variabele           | Waarde                  |
|---------------------|-------------------------|
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxxxxxxxxxxxx` |

> ⚠️ Stel dit in **vóór** de eerste deploy, anders geeft de function een 500-fout.

---

## Checklist na deploy

Test of alles werkt:

- [ ] De site laadt zonder JavaScript-fouten (open browser console)
- [ ] De hero en het formulier zijn zichtbaar
- [ ] "Meer voorkeuren instellen" klapt uit en in
- [ ] Start- en eindpunt invullen activeert de genereer-knop
- [ ] Klikken op "Genereer mijn roadtrip" toont een loading-indicator
- [ ] Na ~10-30 seconden verschijnt een route met echte plaatsnamen
- [ ] Dagkaarten zijn inklapbaar
- [ ] Export-tabs werken en de kopieerknop werkt
- [ ] Op mobiel is de layout responsive

### Snel testen: open browser DevTools → Network tab

Zoek na het klikken op Genereer naar een request naar `/.netlify/functions/generate-route`.  
- Status `200` → alles werkt  
- Status `500` → controleer of `ANTHROPIC_API_KEY` is ingesteld  
- Status `429` → API rate limit, even wachten

---

## Veelgestelde vragen

**Waarom roept de frontend niet direct de Anthropic API aan?**  
Dat zou de API key zichtbaar maken in de browser — een beveiligingsrisico.  
De Netlify Function is een server-side proxy: de key staat alleen op de server.

**Hoeveel kost het?**  
Netlify's gratis tier (Starter) is ruim voldoende voor persoonlijk gebruik.  
Voor de AI-kosten: een route genereren kost ca. 2.000–4.000 tokens ≈ $0.01–0.02 met Claude Opus.

**Kan ik een ander model gebruiken?**  
Ja. In `netlify/functions/generate-route.js` staat `const MODEL = "claude-opus-4-6"`.  
Verander dit naar `"claude-sonnet-4-6"` voor snellere/goedkopere generatie.

**De function time-out op 55 seconden — is dat genoeg?**  
Netlify's gratis tier heeft een limit van 10 seconden voor synchrone functies.  
Upgrade naar Netlify Pro (of gebruik background functions) als je time-outs ervaart.  
Alternatief: verander het model naar Sonnet, dat reageert sneller.

> **Tip voor Netlify gratis tier:** Claude Sonnet is snel genoeg voor de 10s-limiet.  
> Verander in `generate-route.js`: `const MODEL = "claude-sonnet-4-6";`
