import type { WeatherType } from '../hooks/useWeather';

export type TimeOfDay = 'Dawn' | 'Morning' | 'Noon' | 'Afternoon' | 'Dusk' | 'Night' | 'Midnight';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface ThemeColors {
    bgBase: string; // Background color
    orb1: string;   // Colors for the 3 main orbs
    orb2: string;
    orb3: string;
    accent: string; // Accent color for text/ui highlights
    overlay?: string; // Optional overlay (e.g. rain texture)
    intensity: number; // 1.0 is normal, higher is more vibrant
    isDark: boolean; // True = Dark Backend (White Text), False = Light Background (Dark Text)
}

// Helper to determine time of day
export function getTimeOfDay(hour: number): TimeOfDay {
    if (hour >= 5 && hour < 7) return 'Dawn';
    if (hour >= 7 && hour < 11) return 'Morning';
    if (hour >= 11 && hour < 14) return 'Noon';
    if (hour >= 14 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 20) return 'Dusk';
    if (hour >= 20 && hour < 24) return 'Night';
    return 'Midnight';
}

// Helper to determine season (Northern Hemisphere approximation)
export function getSeason(month: number): Season {
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
}

// --- GENERATIVE PALETTE ENGINE ---

const BASE_PALETTES: Record<Season, Record<TimeOfDay, ThemeColors>> = {
    Summer: {
        Dawn: { bgBase: '#0f172a', orb1: '#fda4af', orb2: '#818cf8', orb3: '#fb7185', accent: '#fb7185', intensity: 1.2, isDark: true },
        Morning: { bgBase: '#3b82f6', orb1: '#60a5fa', orb2: '#fbbf24', orb3: '#93c5fd', accent: '#f59e0b', intensity: 1.3, isDark: false }, // Bright Blue
        Noon: { bgBase: '#0ea5e9', orb1: '#fcd34d', orb2: '#38bdf8', orb3: '#7dd3fc', accent: '#f59e0b', intensity: 1.4, isDark: false }, // Bright Cyan
        Afternoon: { bgBase: '#2563eb', orb1: '#f59e0b', orb2: '#60a5fa', orb3: '#e11d48', accent: '#f59e0b', intensity: 1.3, isDark: false },
        Dusk: { bgBase: '#4c1d95', orb1: '#f472b6', orb2: '#c084fc', orb3: '#db2777', accent: '#e879f9', intensity: 1.2, isDark: true },
        Night: { bgBase: '#020617', orb1: '#4338ca', orb2: '#312e81', orb3: '#1e1b4b', accent: '#6366f1', intensity: 1.0, isDark: true },
        Midnight: { bgBase: '#000000', orb1: '#1e1b4b', orb2: '#312e81', orb3: '#0f0f15', accent: '#4f46e5', intensity: 0.9, isDark: true },
    },
    Spring: {
        Dawn: { bgBase: '#101827', orb1: '#a78bfa', orb2: '#fbcfe8', orb3: '#c4b5fd', accent: '#c084fc', intensity: 1.1, isDark: true },
        Morning: { bgBase: '#dbeafe', orb1: '#86efac', orb2: '#60a5fa', orb3: '#f9a8d4', accent: '#22c55e', intensity: 1.2, isDark: false }, // White/Blue
        Noon: { bgBase: '#bfdbfe', orb1: '#4ade80', orb2: '#60a5fa', orb3: '#a78bfa', accent: '#4ade80', intensity: 1.2, isDark: false },
        Afternoon: { bgBase: '#60a5fa', orb1: '#f472b6', orb2: '#c084fc', orb3: '#818cf8', accent: '#e879f9', intensity: 1.2, isDark: false },
        Dusk: { bgBase: '#3730a3', orb1: '#d8b4fe', orb2: '#f0abfc', orb3: '#818cf8', accent: '#e879f9', intensity: 1.1, isDark: true },
        Night: { bgBase: '#1e1b4b', orb1: '#4c1d95', orb2: '#5b21b6', orb3: '#2e1065', accent: '#8b5cf6', intensity: 1.0, isDark: true },
        Midnight: { bgBase: '#020617', orb1: '#2e1065', orb2: '#172554', orb3: '#0f172a', accent: '#6366f1', intensity: 0.9, isDark: true },
    },
    Autumn: {
        Dawn: { bgBase: '#1c1917', orb1: '#fdba74', orb2: '#fb923c', orb3: '#ea580c', accent: '#f97316', intensity: 1.1, isDark: true },
        Morning: { bgBase: '#ffedd5', orb1: '#fdba74', orb2: '#fdba74', orb3: '#fca5a5', accent: '#f97316', intensity: 1.2, isDark: false }, // Orange tint
        Noon: { bgBase: '#fed7aa', orb1: '#fb923c', orb2: '#f87171', orb3: '#fbbf24', accent: '#ef4444', intensity: 1.3, isDark: false },
        Afternoon: { bgBase: '#ea580c', orb1: '#fbbf24', orb2: '#fca5a5', orb3: '#c2410c', accent: '#c2410c', intensity: 1.2, isDark: true }, // Deep Orange
        Dusk: { bgBase: '#7c2d12', orb1: '#fdba74', orb2: '#fb923c', orb3: '#9a3412', accent: '#ea580c', intensity: 1.1, isDark: true },
        Night: { bgBase: '#431407', orb1: '#7c2d12', orb2: '#9a3412', orb3: '#c2410c', accent: '#ea580c', intensity: 1.0, isDark: true },
        Midnight: { bgBase: '#1a0502', orb1: '#431407', orb2: '#2b0c05', orb3: '#0f172a', accent: '#7c2d12', intensity: 0.9, isDark: true },
    },
    Winter: {
        Dawn: { bgBase: '#0f172a', orb1: '#e2e8f0', orb2: '#94a3b8', orb3: '#cbd5e1', accent: '#cbd5e1', intensity: 1.0, isDark: true },
        Morning: { bgBase: '#f1f5f9', orb1: '#cbd5e1', orb2: '#e2e8f0', orb3: '#94a3b8', accent: '#64748b', intensity: 1.1, isDark: false }, // Very White
        Noon: { bgBase: '#e2e8f0', orb1: '#94a3b8', orb2: '#cbd5e1', orb3: '#fff', accent: '#475569', intensity: 1.2, isDark: false },
        Afternoon: { bgBase: '#94a3b8', orb1: '#cbd5e1', orb2: '#64748b', orb3: '#e2e8f0', accent: '#334155', intensity: 1.1, isDark: false },
        Dusk: { bgBase: '#1e293b', orb1: '#64748b', orb2: '#475569', orb3: '#94a3b8', accent: '#cbd5e1', intensity: 1.0, isDark: true },
        Night: { bgBase: '#020617', orb1: '#1e293b', orb2: '#0f172a', orb3: '#1e1b4b', accent: '#64748b', intensity: 1.0, isDark: true },
        Midnight: { bgBase: '#000000', orb1: '#0f172a', orb2: '#1e293b', orb3: '#020617', accent: '#475569', intensity: 0.9, isDark: true },
    },
};

// Weather modifiers
function applyWeather(base: ThemeColors, weather?: WeatherType): ThemeColors {
    if (!weather || weather === 'Clear') return base;

    const modified = { ...base };

    switch (weather) {
        case 'Rainy':
            modified.bgBase = '#1e293b'; // Slate 800
            modified.orb1 = '#334155'; // Slate 700
            modified.orb2 = '#475569'; // Slate 600
            modified.intensity *= 0.8;
            modified.overlay = 'rain';
            modified.isDark = true; // Rain implies dark clouds usually
            break;
        case 'Cloudy':
            modified.intensity *= 0.7;
            modified.orb1 = adjustColor(modified.orb1, -20); // Darken
            modified.orb2 = adjustColor(modified.orb2, -20);
            // Keep original isDark unless it gets very dark, but generally cloudy is darker than clear noon
            if (!modified.isDark) {
                // If it was light, maybe it's still light but gray
                // No change usually needed for contrast unless it's very dark storm
            }
            break;
        case 'Snowy':
            modified.bgBase = '#f8fafc'; // Slate 50
            modified.orb1 = '#e2e8f0';
            modified.orb2 = '#cbd5e1';
            modified.intensity = 1.0;
            modified.overlay = 'snow';
            modified.isDark = false; // Snow is bright
            break;
        case 'Stormy':
            modified.bgBase = '#0f172a';
            modified.orb1 = '#1e1b4b'; // Indigo 950
            modified.orb2 = '#312e81'; // Indigo 900
            modified.accent = '#fcd34d'; // Amber for lightning feel?
            modified.intensity = 1.1; // High contrast
            modified.isDark = true;
            break;
        case 'Foggy':
            modified.intensity *= 0.5;
            modified.orb1 = '#94a3b8';
            modified.orb2 = '#cbd5e1';
            modified.isDark = false; // Fog is usually white/grayish light
            break;
    }
    return modified;
}

// Color adjustment utility - lightens/darkens hex colors
function adjustColor(hex: string, percent: number): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '');

    // Parse RGB values
    let r = parseInt(cleanHex.substring(0, 2), 16);
    let g = parseInt(cleanHex.substring(2, 4), 16);
    let b = parseInt(cleanHex.substring(4, 6), 16);

    // Adjust by percent (-100 to 100)
    r = Math.min(255, Math.max(0, Math.round(r + (r * percent / 100))));
    g = Math.min(255, Math.max(0, Math.round(g + (g * percent / 100))));
    b = Math.min(255, Math.max(0, Math.round(b + (b * percent / 100))));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}


export function generateTheme(date: Date, weather?: WeatherType): ThemeColors {
    const hour = date.getHours();
    const month = date.getMonth();

    const timeOfDay = getTimeOfDay(hour);
    const season = getSeason(month);

    let theme = BASE_PALETTES[season][timeOfDay];

    // Apply weather overrides
    theme = applyWeather(theme, weather);

    return theme;
}
