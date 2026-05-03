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

- **Registreren & inloggen** via de NOVI Educational Backend (JWT-authenticatie)
- **Notities beheren** – aanmaken, bekijken, bewerken en verwijderen via de NOVI Dynamic API
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
git clone https://github.com/jouw-gebruikersnaam/lysta.git
cd lysta
```

### 2. Dependencies installeren

```bash
npm install
```

### 3. Omgevingsvariabelen instellen

Kopieer het voorbeeld-bestand en vul je eigen sleutels in:

```bash
cp .env.example .env
```

Open `.env` en vul de volgende waarden in:

```env
# NOVI Educational Backend – voor authenticatie (register/login)
VITE_AUTH_URL=https://frontend-educational-backend.herokuapp.com

# NOVI Dynamic API – voor notities opslaan
# Registreer je project op https://novi.datavortex.nl
VITE_NOTES_API_URL=https://api.datavortex.nl/jouw-projectnaam
VITE_NOTES_API_KEY=jouw-projectnaam:jouw-api-key
```

> **Let op:** het `.env`-bestand staat in `.gitignore` en wordt nooit mee gecommit.
> De API-key wordt als losse bijlage aangeleverd bij de inlevering.

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

Maak via de **Registreren**-tab op de loginpagina zelf een account aan.

Vereisten voor het NOVI backend account:
- **Gebruikersnaam:** minimaal 6 tekens
- **Wachtwoord:** minimaal 6 tekens
- **E-mailadres:** geldig formaat (bijv. `naam@domein.nl`)

> De NOVI Educational Backend wist de database periodiek.
> Maak indien nodig opnieuw een account aan.
