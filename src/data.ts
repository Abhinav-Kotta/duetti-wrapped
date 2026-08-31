import { palette } from './theme';

export type StoryKind =
  | 'cover'
  | 'mood'
  | 'multiples'
  | 'genres'
  | 'regions'
  | 'deals'
  | 'mechanics'
  | 'barrier'
  | 'finale';

export type Story = {
  id: string;
  kind: StoryKind;
  eyebrow: string;
  title: string;
  background: string;
  foreground: string;
  accent: string;
};

export const stories: Story[] = [
  {
    id: 'cover',
    kind: 'cover',
    eyebrow: 'DUETTI × BILLBOARD · H2 2026',
    title: 'Music finance, replayed.',
    background: palette.paper,
    foreground: palette.ink,
    accent: palette.blue,
  },
  {
    id: 'mood',
    kind: 'mood',
    eyebrow: '01 · MARKET MOOD',
    title: 'Cautious optimism is back.',
    background: palette.blue,
    foreground: palette.white,
    accent: palette.lime,
  },
  {
    id: 'multiples',
    kind: 'multiples',
    eyebrow: '02 · FIND YOUR CONTEXT',
    title: 'Catalog age tells the loudest story.',
    background: palette.paper,
    foreground: palette.ink,
    accent: palette.coral,
  },
  {
    id: 'genres',
    kind: 'genres',
    eyebrow: '03 · GENRE MOMENTUM',
    title: 'Latin pulled away from the pack.',
    background: palette.lime,
    foreground: palette.ink,
    accent: palette.blue,
  },
  {
    id: 'regions',
    kind: 'regions',
    eyebrow: '04 · GLOBAL OUTLOOK',
    title: 'The next wave is already global.',
    background: palette.ink,
    foreground: palette.white,
    accent: palette.lilac,
  },
  {
    id: 'deals',
    kind: 'deals',
    eyebrow: '05 · DEAL SIZE',
    title: 'The middle of the market has the most momentum.',
    background: palette.coral,
    foreground: palette.ink,
    accent: palette.paper,
  },
  {
    id: 'mechanics',
    kind: 'mechanics',
    eyebrow: '06 · HOW DEALS MOVE',
    title: 'Money leads. Relationships close.',
    background: palette.lilac,
    foreground: palette.ink,
    accent: palette.blue,
  },
  {
    id: 'barrier',
    kind: 'barrier',
    eyebrow: '07 · THE REAL FRICTION',
    title: 'The biggest gap is expectations.',
    background: palette.blueDeep,
    foreground: palette.white,
    accent: palette.coral,
  },
  {
    id: 'finale',
    kind: 'finale',
    eyebrow: 'YOUR H2 2026 REPLAY',
    title: 'Stable prices. Global growth. Mid-market energy.',
    background: palette.paper,
    foreground: palette.ink,
    accent: palette.blue,
  },
];

export const catalogMultiples = {
  Masters: {
    '6–24m': 3.8,
    '2–5y': 5.9,
    '5–10y': 8.1,
    '10+y': 10.2,
  },
  Publishing: {
    '6–24m': 4.7,
    '2–5y': 6.9,
    '5–10y': 9.5,
    '10+y': 12.1,
  },
} as const;

export type RightsType = keyof typeof catalogMultiples;
export type AgeBand = keyof (typeof catalogMultiples)['Masters'];

const reportSection = (heading: string) =>
  `https://www.duetti.co/music-finance-index-h2-2026#:~:text=${encodeURIComponent(heading)}`;

export const sourceLinks = {
  fullReport: 'https://www.duetti.co/music-finance-index-h2-2026',
  mood: reportSection('Cautious Optimism for H2 2026'),
  multiples: reportSection('Valuations Rise Steadily with Age'),
  genres: reportSection('Genre Divides Deepen'),
  regions: reportSection('Emerging Regions Gain Even More Ground'),
  deals: reportSection('Deal Size: Broad-Based Momentum'),
  buyers: reportSection("Who's Buying: Financial Funds and Major Labels Dominate"),
  advisors: reportSection('How Deals Come Together: Trusted Advisors Lead the Way'),
  barriers: reportSection("What's Getting in the Way: Valuation Expectations Remain the Top Barrier"),
} as const;
