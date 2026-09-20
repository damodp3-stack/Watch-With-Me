/**
 * Central Branding and Application Configuration
 * To rebrand the product, update this single configuration file.
 * Do not hardcode the brand name across the UI components.
 */

export interface AppConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  version: string;
  author: string;
  supportEmail: string;
  dmcaEmail: string;
  legalContactEmail: string;
  copyrightNotice: string;
  defaultTheme: 'dark' | 'light' | 'system';
  apiBaseUrl: string;
  links: {
    github?: string;
    privacy: string;
    terms: string;
    dmca: string;
  };
  features: {
    enableAnime: boolean;
    enableLanguagesPage: boolean;
    enableContinueWatching: boolean;
    enableWatchlist: boolean;
    enableAdminDashboard: boolean;
    enableCustomPlayer: boolean;
    enableSubtitles: boolean;
  };
}

export const APP_CONFIG: AppConfig = {
  name: 'Streamora',
  shortName: 'Streamora',
  tagline: 'Multilingual Movie, Series & Anime Discovery',
  description: 'A modern, cinematic streaming discovery platform supporting movies, TV series, and anime across global and regional languages.',
  version: '1.0.0',
  author: 'Streamora Engineering',
  supportEmail: 'support@streamora.example.com',
  dmcaEmail: 'copyright@streamora.example.com',
  legalContactEmail: 'legal@streamora.example.com',
  copyrightNotice: '© 2026 Streamora. All rights reserved. Authorized Media Discovery & Streaming.',
  defaultTheme: 'dark',
  apiBaseUrl: '/api',
  links: {
    privacy: '#privacy',
    terms: '#terms',
    dmca: '#dmca',
  },
  features: {
    enableAnime: true,
    enableLanguagesPage: true,
    enableContinueWatching: true,
    enableWatchlist: true,
    enableAdminDashboard: true,
    enableCustomPlayer: true,
    enableSubtitles: true,
  },
};

export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  flag: string;
  popularCount: number;
  gradient: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'India / Global', flag: '🇮🇳', popularCount: 1420, gradient: 'from-amber-600 to-red-800' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'India / Global', flag: '🇮🇳', popularCount: 1350, gradient: 'from-orange-600 to-rose-700' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'India / Global', flag: '🇮🇳', popularCount: 2840, gradient: 'from-red-600 to-amber-700' },
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global / Hollywood', flag: '🌐', popularCount: 8900, gradient: 'from-blue-600 to-indigo-800' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'India / Kerala', flag: '🇮🇳', popularCount: 980, gradient: 'from-emerald-600 to-teal-800' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'India / Karnataka', flag: '🇮🇳', popularCount: 750, gradient: 'from-yellow-600 to-amber-800' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'Japan / Anime', flag: '🇯🇵', popularCount: 3200, gradient: 'from-rose-600 to-pink-800' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'South Korea / K-Drama', flag: '🇰🇷', popularCount: 2100, gradient: 'from-violet-600 to-purple-900' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Spain / Latin America', flag: '🇪🇸', popularCount: 1850, gradient: 'from-amber-500 to-orange-700' },
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'France / Cinema', flag: '🇫🇷', popularCount: 1200, gradient: 'from-cyan-600 to-blue-800' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Germany', flag: '🇩🇪', popularCount: 890, gradient: 'from-stone-600 to-neutral-800' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', region: 'China / East Asia', flag: '🇨🇳', popularCount: 1450, gradient: 'from-red-700 to-rose-900' },
];

export const GENRE_LIST = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Historical',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
] as const;
