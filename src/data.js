export const LABELS = [
  { name: 'Werk', color: '#3B82F6' },
  { name: 'Persoonlijk', color: '#9644EF' },
  { name: 'Ideeën', color: '#FBC003' },
  { name: 'Urgent', color: '#EF4444' },
]

export const NOTES = [
  {
    id: 1,
    title: 'Projectplan Q2 2026',
    body: 'Overzicht van alle deliverables voor het tweede kwartaal. Prioriteit ligt bij het redesign van het klantportaal en de API-integratie met het nieuwe platform.',
    labels: [{ name: 'Werk', color: '#3B82F6' }],
    pinned: true,
    reminder: null,
    date: '2 uur geleden',
    accent: '#3B82F6',
  },
  {
    id: 2,
    title: 'Boodschappenlijst',
    body: 'Melk, eieren, brood, spinazie, wortelen, pasta, olijfolie, koffie, yoghurt, kaas en appels.',
    labels: [{ name: 'Persoonlijk', color: '#9644EF' }],
    pinned: false,
    reminder: 'Vandaag 18:00',
    date: 'Gisteren',
    accent: '#9644EF',
  },
  {
    id: 3,
    title: 'Ideeën vakantie 2026',
    body: 'Portugal kust, Schotland highlands, Japan (lente – kersenbloesem). Budget max. €2.000 p.p.',
    labels: [{ name: 'Ideeën', color: '#FBC003' }],
    pinned: false,
    reminder: null,
    date: '3 dagen geleden',
    accent: '#FBC003',
  },
  {
    id: 4,
    title: 'Meeting notes 12 feb',
    body: 'Besproken: roadmap, prioriteiten sprint 12, stand-up tijden aanpassen naar 09:15.',
    labels: [{ name: 'Werk', color: '#3B82F6' }],
    pinned: false,
    reminder: null,
    date: '12 feb',
    accent: '#3B82F6',
  },
  {
    id: 5,
    title: 'Lyst feature wishlist',
    body: "Dark mode, markdown, samenwerken, tags, PDF-export, snelle invoer met slash-commando's.",
    labels: [
      { name: 'Ideeën', color: '#FBC003' },
      { name: 'Werk', color: '#3B82F6' },
    ],
    pinned: true,
    reminder: 'Morgen 09:00',
    date: '5 feb',
    accent: '#FBC003',
  },
  {
    id: 6,
    title: 'Bellijst deze week',
    body: 'Dokter afspraak, verzekering bellen, garage plannen voor APK, accountant terugbellen.',
    labels: [{ name: 'Urgent', color: '#EF4444' }],
    pinned: false,
    reminder: 'Vandaag',
    date: '3 feb',
    accent: '#EF4444',
  },
]

export const NOTE_DETAIL = {
  id: 1,
  title: 'Projectplan Q2 2026',
  labels: [{ name: 'Werk', color: '#3B82F6' }],
  reminder: 'Morgen 09:00',
  created: '8 jan 2026, 14:23',
  modified: 'Vandaag, 09:15',
  pinned: true,
  body: `Overzicht deliverables Q2

Dit kwartaal focussen we op het volledig opleveren van het redesign van het klantportaal. De volgende onderdelen moeten worden afgerond:

·  Nieuwe navigatiestructuur (sprint 11–12)
·  Herontwerp van de dashboard views
·  Integratie met het nieuwe API platform
·  Gebruikerstests en iteratieronden
·  Documentatie en kennisoverdracht

Planning:
Sprint 11 – 1 t/m 15 april    Design system afronden
Sprint 12 – 16 t/m 30 april   Frontend implementatie
Sprint 13 – 1 t/m 15 mei      QA en bugfixes
Sprint 14 – 16 t/m 31 mei     Go-live en monitoring`,
}

export const REMINDERS = {
  today: [
    {
      id: 1,
      title: 'Boodschappenlijst',
      time: '18:00',
      label: 'Persoonlijk',
      color: '#9644EF',
      done: false,
    },
    {
      id: 2,
      title: 'Bellijst deze week',
      time: '10:00',
      label: 'Urgent',
      color: '#EF4444',
      done: true,
    },
    { id: 3, title: 'Stand-up notes', time: '09:00', label: 'Werk', color: '#3B82F6', done: false },
  ],
  week: [
    {
      id: 4,
      title: 'Lyst feature wishlist',
      time: 'di 7 apr, 09:00',
      label: 'Ideeën',
      color: '#FBC003',
    },
    { id: 5, title: 'Projectreview Q2', time: 'do 9 apr, 14:00', label: 'Werk', color: '#3B82F6' },
  ],
}

export const FILTER_NOTES = [
  {
    id: 1,
    title: 'Projectplan Q2 2026',
    body: 'Overzicht van alle deliverables voor het tweede kwartaal...',
    date: 'Vandaag',
  },
  {
    id: 4,
    title: 'Meeting notes 12 feb',
    body: 'Besproken: roadmap, prioriteiten voor sprint 12...',
    date: '12 feb',
  },
  {
    id: 5,
    title: 'Lyst feature wishlist',
    body: 'Dark mode, markdown support, samenwerken, tags, export...',
    date: '5 feb',
  },
  {
    id: 7,
    title: 'Technische schuld – plan',
    body: 'Refactoring van de API laag, migratie naar TypeScript...',
    date: '2 feb',
  },
]
