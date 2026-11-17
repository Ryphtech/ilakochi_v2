import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface ThemeColors {
  bg: string;          // Main page background
  surface: string;     // Elevated cards, modals, containers
  border: string;      // Borders, dividers, subtle accents
  textMuted: string;   // Secondary text, icons, meta details
  textSoft: string;    // Main body copy
  accent: string;      // Brand accent (gold, brass, highlight)
}

export interface ThemePreset {
  id: 'black' | 'green' | 'navy' | 'terracotta' | 'custom';
  name: string;
  description: string;
  colors: ThemeColors;
}

export interface SiteThemeConfig {
  preset: 'black' | 'green' | 'navy' | 'terracotta' | 'custom';
  name: string;
  colors: ThemeColors;
  updatedAt?: unknown;
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  black: {
    id: 'black',
    name: 'Obsidian Black & Gold',
    description: 'Ultra-modern luxury dark aesthetic with warm gold accents and neutral silver typography.',
    colors: {
      bg: '#050505',
      surface: '#121212',
      border: '#262626',
      textMuted: '#A3A3A3',
      textSoft: '#E5E5E5',
      accent: '#C5A46D',
    },
  },
  green: {
    id: 'green',
    name: 'Botanical Emerald & Gold',
    description: 'Heritage Kerala coastal theme inspired by lush backwaters, plantain leaves, and clay pots.',
    colors: {
      bg: '#0B291E',
      surface: '#123D2A',
      border: '#176B45',
      textMuted: '#A8BFA0',
      textSoft: '#DCE8D5',
      accent: '#C5A46D',
    },
  },
  navy: {
    id: 'navy',
    name: 'Midnight Arabian Sea',
    description: 'Deep maritime oceanic navy inspired by the historic Kochi harbor at twilight.',
    colors: {
      bg: '#060B14',
      surface: '#0F172A',
      border: '#1E293B',
      textMuted: '#94A3B8',
      textSoft: '#E2E8F0',
      accent: '#D4AF37',
    },
  },
  terracotta: {
    id: 'terracotta',
    name: 'Claypot Terracotta & Hearth',
    description: 'Warm roasted spices, Meen Chatti earthenware, and glowing wood-fire embers.',
    colors: {
      bg: '#14080B',
      surface: '#221015',
      border: '#3D1B24',
      textMuted: '#B8959F',
      textSoft: '#F2E6E9',
      accent: '#E5B869',
    },
  },
};

export const defaultThemeConfig: SiteThemeConfig = {
  preset: 'black',
  name: THEME_PRESETS.black.name,
  colors: { ...THEME_PRESETS.black.colors },
};

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) {
    return { r: 5, g: 5, b: 5 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Generate precise dynamic CSS rules to override Tailwind static utility classes
 */
export function generateThemeCss(colors: ThemeColors): string {
  const bgRgb = hexToRgb(colors.bg);
  const surfaceRgb = hexToRgb(colors.surface);
  const borderRgb = hexToRgb(colors.border);
  const mutedRgb = hexToRgb(colors.textMuted);
  const softRgb = hexToRgb(colors.textSoft);

  const bgStr = `${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}`;
  const surfaceStr = `${surfaceRgb.r}, ${surfaceRgb.g}, ${surfaceRgb.b}`;
  const borderStr = `${borderRgb.r}, ${borderRgb.g}, ${borderRgb.b}`;
  const mutedStr = `${mutedRgb.r}, ${mutedRgb.g}, ${mutedRgb.b}`;
  const softStr = `${softRgb.r}, ${softRgb.g}, ${softRgb.b}`;

  return `
/* === ILA KOCHI DYNAMIC THEME (ADMIN CONTROLLED) === */
:root {
  --theme-bg: ${colors.bg};
  --theme-surface: ${colors.surface};
  --theme-border: ${colors.border};
  --theme-muted: ${colors.textMuted};
  --theme-soft: ${colors.textSoft};
  --theme-accent: ${colors.accent};
}

html, body {
  background-color: ${colors.bg} !important;
}

/* 1. Backgrounds */
.bg-\\[\\#050505\\] { background-color: ${colors.bg} !important; }
.bg-\\[\\#050505\\]\\/60 { background-color: rgba(${bgStr}, 0.6) !important; }
.bg-\\[\\#050505\\]\\/80 { background-color: rgba(${bgStr}, 0.8) !important; }
.bg-\\[\\#050505\\]\\/85 { background-color: rgba(${bgStr}, 0.85) !important; }
.bg-\\[\\#050505\\]\\/90 { background-color: rgba(${bgStr}, 0.9) !important; }
.bg-\\[\\#050505\\]\\/95 { background-color: rgba(${bgStr}, 0.95) !important; }

/* 2. Elevated Surfaces & Cards */
.bg-\\[\\#121212\\] { background-color: ${colors.surface} !important; }
.bg-\\[\\#121212\\]\\/40 { background-color: rgba(${surfaceStr}, 0.4) !important; }
.bg-\\[\\#121212\\]\\/60 { background-color: rgba(${surfaceStr}, 0.6) !important; }
.bg-\\[\\#121212\\]\\/70 { background-color: rgba(${surfaceStr}, 0.7) !important; }
.bg-\\[\\#121212\\]\\/80 { background-color: rgba(${surfaceStr}, 0.8) !important; }
.bg-\\[\\#121212\\]\\/90 { background-color: rgba(${surfaceStr}, 0.9) !important; }
.hover\\:bg-\\[\\#121212\\]:hover { background-color: ${colors.surface} !important; }
.hover\\:bg-\\[\\#121212\\]\\/60:hover { background-color: rgba(${surfaceStr}, 0.6) !important; }

/* 3. Borders & Dividers */
.border-\\[\\#050505\\] { border-color: ${colors.bg} !important; }
.border-\\[\\#262626\\] { border-color: ${colors.border} !important; }
.border-\\[\\#262626\\]\\/20 { border-color: rgba(${borderStr}, 0.2) !important; }
.border-\\[\\#262626\\]\\/30 { border-color: rgba(${borderStr}, 0.3) !important; }
.border-\\[\\#262626\\]\\/40 { border-color: rgba(${borderStr}, 0.4) !important; }
.border-\\[\\#262626\\]\\/50 { border-color: rgba(${borderStr}, 0.5) !important; }
.border-\\[\\#262626\\]\\/60 { border-color: rgba(${borderStr}, 0.6) !important; }
.border-\\[\\#262626\\]\\/70 { border-color: rgba(${borderStr}, 0.7) !important; }
.border-\\[\\#262626\\]\\/80 { border-color: rgba(${borderStr}, 0.8) !important; }
.border-\\[\\#A3A3A3\\]\\/30 { border-color: rgba(${mutedStr}, 0.3) !important; }
.border-\\[\\#A3A3A3\\]\\/40 { border-color: rgba(${mutedStr}, 0.4) !important; }

/* 4. Secondary Accents & Pills */
.bg-\\[\\#262626\\] { background-color: ${colors.border} !important; }
.bg-\\[\\#262626\\]\\/10 { background-color: rgba(${borderStr}, 0.1) !important; }
.bg-\\[\\#262626\\]\\/15 { background-color: rgba(${borderStr}, 0.15) !important; }
.bg-\\[\\#262626\\]\\/20 { background-color: rgba(${borderStr}, 0.2) !important; }
.bg-\\[\\#262626\\]\\/40 { background-color: rgba(${borderStr}, 0.4) !important; }
.bg-\\[\\#262626\\]\\/80 { background-color: rgba(${borderStr}, 0.8) !important; }
.bg-\\[\\#262626\\]\\/90 { background-color: rgba(${borderStr}, 0.9) !important; }
.hover\\:bg-\\[\\#262626\\]:hover { background-color: ${colors.border} !important; }
.hover\\:bg-\\[\\#262626\\]\\/50:hover { background-color: rgba(${borderStr}, 0.5) !important; }
.hover\\:bg-\\[\\#262626\\]\\/60:hover { background-color: rgba(${borderStr}, 0.6) !important; }

/* 5. Typography */
.text-\\[\\#050505\\] { color: ${colors.bg} !important; }
.text-\\[\\#262626\\]\\/10 { color: rgba(${borderStr}, 0.1) !important; }
.text-\\[\\#262626\\]\\/60 { color: rgba(${borderStr}, 0.6) !important; }
.text-\\[\\#A3A3A3\\] { color: ${colors.textMuted} !important; }
.text-\\[\\#A3A3A3\\]\\/60 { color: rgba(${mutedStr}, 0.6) !important; }
.text-\\[\\#A3A3A3\\]\\/70 { color: rgba(${mutedStr}, 0.7) !important; }
.text-\\[\\#E5E5E5\\] { color: ${colors.textSoft} !important; }
.text-\\[\\#E5E5E5\\]\\/70 { color: rgba(${softStr}, 0.7) !important; }
.text-\\[\\#E5E5E5\\]\\/80 { color: rgba(${softStr}, 0.8) !important; }
.text-\\[\\#E5E5E5\\]\\/85 { color: rgba(${softStr}, 0.85) !important; }
.text-\\[\\#E5E5E5\\]\\/90 { color: rgba(${softStr}, 0.9) !important; }

/* 6. Gradients */
.from-\\[\\#050505\\] { --tw-gradient-from: ${colors.bg} !important; }
.from-\\[\\#050505\\]\\/60 { --tw-gradient-from: rgba(${bgStr}, 0.6) !important; }
.from-\\[\\#050505\\]\\/80 { --tw-gradient-from: rgba(${bgStr}, 0.8) !important; }
.from-\\[\\#050505\\]\\/85 { --tw-gradient-from: rgba(${bgStr}, 0.85) !important; }
.from-\\[\\#050505\\]\\/90 { --tw-gradient-from: rgba(${bgStr}, 0.9) !important; }
.from-\\[\\#050505\\]\\/95 { --tw-gradient-from: rgba(${bgStr}, 0.95) !important; }
.via-\\[\\#050505\\]\\/30 { --tw-gradient-via: rgba(${bgStr}, 0.3) !important; }
.via-\\[\\#050505\\]\\/40 { --tw-gradient-via: rgba(${bgStr}, 0.4) !important; }
.to-\\[\\#050505\\] { --tw-gradient-to: ${colors.bg} !important; }

.from-\\[\\#121212\\] { --tw-gradient-from: ${colors.surface} !important; }
.via-\\[\\#121212\\] { --tw-gradient-via: ${colors.surface} !important; }
.to-\\[\\#121212\\] { --tw-gradient-to: ${colors.surface} !important; }
.to-\\[\\#121212\\]\\/60 { --tw-gradient-to: rgba(${surfaceStr}, 0.6) !important; }

.from-\\[\\#262626\\] { --tw-gradient-from: ${colors.border} !important; }
.from-\\[\\#262626\\]\\/40 { --tw-gradient-from: rgba(${borderStr}, 0.4) !important; }
.via-\\[\\#262626\\]\\/40 { --tw-gradient-via: rgba(${borderStr}, 0.4) !important; }

/* 7. Scrollbars & Shadow */
.scrollbar-thumb-\\[\\#262626\\] { --tw-scrollbar-thumb: ${colors.border} !important; }
.shadow-\\[\\#050505\\]\\/50 { --tw-shadow-color: rgba(${bgStr}, 0.5) !important; }
::-webkit-scrollbar-track { background: ${colors.bg} !important; }
::-webkit-scrollbar-thumb { background: ${colors.border} !important; }
::-webkit-scrollbar-thumb:hover { background: ${colors.accent} !important; }
`;
}

const STORAGE_KEY = 'ila_theme_config';

// Cross-tab broadcast channel for instantaneous zero-latency local sync
const themeBroadcast = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('ila_theme_sync_channel')
  : null;

/**
 * Apply the theme config immediately to the DOM and broadcast to all local tabs
 */
export function applyTheme(config: SiteThemeConfig, broadcast = true) {
  if (typeof document === 'undefined') return;

  // 1. Inject or update the dynamic style tag
  let styleEl = document.getElementById('ila-theme-stylesheet') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'ila-theme-stylesheet';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = generateThemeCss(config.colors);

  // 2. Set root CSS variables
  const root = document.documentElement;
  root.style.setProperty('--theme-bg', config.colors.bg);
  root.style.setProperty('--theme-surface', config.colors.surface);
  root.style.setProperty('--theme-border', config.colors.border);
  root.style.setProperty('--theme-muted', config.colors.textMuted);
  root.style.setProperty('--theme-soft', config.colors.textSoft);
  root.style.setProperty('--theme-accent', config.colors.accent);

  // 3. Update theme-color meta tag for mobile browsers
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', config.colors.bg);
  }

  // 4. Update data-theme attribute on body
  document.body.setAttribute('data-theme', config.preset);

  // 5. Cache in localStorage for instant FCP on page reload
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore storage quota/security errors
  }

  // 6. Broadcast to any other open tabs
  if (broadcast && themeBroadcast) {
    try {
      themeBroadcast.postMessage(config);
    } catch {
      // Ignore
    }
  }
}

/**
 * Read cached theme from localStorage for fast initial render
 */
export function getStoredThemeConfig(): SiteThemeConfig {
  if (typeof window === 'undefined') return defaultThemeConfig;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.colors) {
        return parsed as SiteThemeConfig;
      }
    }
  } catch {
    // Fall back to default
  }
  return defaultThemeConfig;
}

export interface SaveThemeResult {
  success: boolean;
  syncedToCloud: boolean;
  error?: unknown;
}

/**
 * Save theme config to Firebase Firestore (site_settings / theme)
 * Always succeeds locally even if Firestore permissions are restricted
 */
export async function saveThemeConfig(config: Partial<SiteThemeConfig>): Promise<SaveThemeResult> {
  const presetData = config.preset && THEME_PRESETS[config.preset];
  const fullConfig: SiteThemeConfig = {
    preset: config.preset || 'black',
    name: config.name || (presetData?.name ?? 'Custom'),
    colors: config.colors || (presetData?.colors ?? defaultThemeConfig.colors),
  };

  // 1. ALWAYS apply & persist locally first (immediate visual confirmation & cross-tab sync)
  applyTheme(fullConfig, true);

  // 2. Persist to Firebase Firestore for multi-device sync
  try {
    const docRef = doc(db, 'site_settings', 'theme');
    await setDoc(
      docRef,
      {
        ...fullConfig,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true, syncedToCloud: true };
  } catch (err: any) {
    console.warn(
      'Firebase Firestore sync skipped (check Firestore Security Rules in Firebase Console):',
      err?.message || err
    );
    return { success: true, syncedToCloud: false, error: err };
  }
}

/**
 * Subscribe to real-time theme updates from both local tabs and Firestore
 */
export function subscribeThemeConfig(callback: (config: SiteThemeConfig) => void) {
  // 1. Initial application from local cache
  const initial = getStoredThemeConfig();
  applyTheme(initial, false);
  callback(initial);

  // 2. Cross-tab real-time listener (works even without Firestore)
  const onBroadcast = (event: MessageEvent<SiteThemeConfig>) => {
    if (event.data && event.data.colors) {
      applyTheme(event.data, false);
      callback(event.data);
    }
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed && parsed.colors) {
          applyTheme(parsed, false);
          callback(parsed);
        }
      } catch {}
    }
  };

  if (themeBroadcast) {
    themeBroadcast.addEventListener('message', onBroadcast);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }

  // 3. Cloud Firestore subscription (for cross-device synchronization)
  let unsubscribeFirestore = () => {};
  try {
    const docRef = doc(db, 'site_settings', 'theme');
    unsubscribeFirestore = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<SiteThemeConfig>;
          const activePreset = data.preset || 'black';
          const fallbackColors = THEME_PRESETS[activePreset]?.colors || defaultThemeConfig.colors;

          const resolvedConfig: SiteThemeConfig = {
            preset: activePreset,
            name: data.name || (THEME_PRESETS[activePreset]?.name ?? 'Custom'),
            colors: {
              bg: data.colors?.bg || fallbackColors.bg,
              surface: data.colors?.surface || fallbackColors.surface,
              border: data.colors?.border || fallbackColors.border,
              textMuted: data.colors?.textMuted || fallbackColors.textMuted,
              textSoft: data.colors?.textSoft || fallbackColors.textSoft,
              accent: data.colors?.accent || fallbackColors.accent,
            },
          };

          applyTheme(resolvedConfig, false);
          callback(resolvedConfig);
        }
      },
      (err) => {
        // Silently use cached/stored theme when Firestore rules deny access
        console.warn('Firestore theme sync paused (running on local theme cache):', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Could not attach Firestore theme listener:', err);
  }

  return () => {
    if (themeBroadcast) {
      themeBroadcast.removeEventListener('message', onBroadcast);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
    unsubscribeFirestore();
  };
}
