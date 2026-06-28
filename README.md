# Lyst – Notities App

> Jouw notities, georganiseerd. Één plek voor al je ideeën, taken en herinneringen.

## Inhoudsopgave

1. [Inleiding](#inleiding)
2. [Benodigdheden](#benodigdheden)
3. [De applicatie draaien](#de-applicatie-draaien)
4. [Overige commando's](#overige-commandos)
5. [Testgebruikers](#testgebruikers)

---

## Inleiding

Lyst is een notitie-applicatie gebouwd als eindopdracht voor de Leerlijn Frontend van NOVI Hogeschool.

**Kernfunctionaliteiten:**

- **Registreren & inloggen** via de NOVI Dynamic API (JWT-authenticatie)
- **Notities beheren** – aanmaken, bekijken, bewerken en verwijderen
- **Filteren & zoeken** – notities doorzoeken op tekst, label en datum
- **Reminders** – herinneringen instellen en bekijken per tijdvak (vandaag / deze week)

---

## Benodigdheden

| Tool    | Minimale versie |
|---------|----------------|
| Node.js | 18.x           |
| npm     | 9.x            |

**Gebruikte packages:**

- `react` & `react-dom` – UI framework
- `react-router-dom` – client-side routing en private routes
- `lucide-react` – icon library (toegestaan als icon pack)

Geen Bootstrap, Tailwind of andere styling-frameworks.

---

## De applicatie draaien

### 1. Repository klonen

```bash
git clone https://github.com/Manolo008/lyst.git
cd lyst
```

### 2. Dependencies installeren

```bash
npm install
```

### 3. Omgevingsvariabelen instellen

Kopieer het voorbeeld-bestand:

```bash
cp .env.example .env
```

Het `.env`-bestand bevat al de juiste waarden voor dit project:

```env
# NOVI Dynamic API – basis-URL en project-ID
VITE_API_URL=https://novi-backend-api-wgsgz.ondigitalocean.app
VITE_PROJECT_ID=8766124a-0f20-4bf9-a5ba-d261af524963
```

> **Let op:** het `.env`-bestand staat in `.gitignore` en wordt nooit mee gecommit.
> De API-key (project-ID) wordt als losse bijlage aangeleverd bij de inlevering.

### 4. Applicatie starten

```bash
npm run dev
```

De app is bereikbaar op **http://localhost:5173** (Vite kiest automatisch een vrije poort).

---

## Overige commando's

| Commando          | Omschrijving                               |
|-------------------|--------------------------------------------|
| `npm run dev`     | Start de development server met hot-reload |
| `npm run build`   | Bouwt een productie-bundle in `/dist`      |
| `npm run preview` | Bekijkt de productie-bundle lokaal         |
| `npm run lint`    | Voert ESLint uit op alle bronbestanden     |

---

## Testgebruikers

De volgende testgebruiker is aangemaakt via `lyst-config.json` en beschikbaar in de NOVI Dynamic API:

| E-mailadres                  | Wachtwoord |
|------------------------------|------------|
| melchior.buddingh@lyst.com   | Lyst2026!  |

Via de **Registreren**-tab op de loginpagina kun je ook zelf een nieuw account aanmaken.

> De NOVI Dynamic API wist de database dagelijks.
> Maak indien nodig opnieuw een account aan of gebruik de testgebruiker hierboven.
