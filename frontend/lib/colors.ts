export const colors = {
    primary: '#22c55e',
    secondary: '#10b981',
    background: '#000000',
    surface: '#0a0a0a',
    card: '#1a1a1a',
    border: '#22c55e33',
    text: {
        primary: '#ffffff',
        secondary: '#a3a3a3',
        accent: '#22c55e',
    },
    status: {
        success: '#22c55e',
        warning: '#fbbf24',
        error: '#ef4444',
        info: '#3b82f6',
    },
    hover: {
        primary: '#16a34a',
        card: '#262626',
    }
} as const;

export type ColorScheme = typeof colors;
