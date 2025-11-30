// Theme configuration for the application
// This file defines the color palette and design tokens used throughout the app

export const theme = {
    colors: {
        // Primary brand colors - Nepal/Pokhara inspired
        primary: {
            50: '#eff6ff',   // Very light blue
            100: '#dbeafe',  // Light blue
            200: '#bfdbfe',  // Lighter blue
            300: '#93c5fd',  // Cyan-ish blue
            400: '#60a5fa',  // Medium blue
            500: '#3b82f6',  // Blue
            600: '#2563eb',  // Darker blue
            700: '#1d4ed8',  // Deep blue
            800: '#1e40af',  // Navy blue
            900: '#1e3a8a',  // Dark navy
        },

        // Secondary colors - Indigo/Purple
        secondary: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',  // Indigo
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',  // Deep indigo
            900: '#312e81',
        },

        // Accent colors - Purple/Pink
        accent: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',  // Purple
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
        },

        // Highlight colors - Cyan (Phewa Lake inspired)
        highlight: {
            50: '#ecfeff',
            100: '#cffafe',
            200: '#a5f3fc',
            300: '#67e8f9',  // Cyan
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63',
        },

        // Success, warning, error colors
        success: {
            light: '#86efac',
            DEFAULT: '#22c55e',
            dark: '#16a34a',
        },
        warning: {
            light: '#fde047',
            DEFAULT: '#eab308',
            dark: '#ca8a04',
        },
        error: {
            light: '#fca5a5',
            DEFAULT: '#ef4444',
            dark: '#dc2626',
        },
    },

    // Gradient definitions
    gradients: {
        hero: 'linear-gradient(to bottom right, #1e3a8a, #3730a3, #581c87)', // blue-900 -> indigo-800 -> purple-900
        primary: 'linear-gradient(to right, #06b6d4, #3b82f6)', // cyan-500 -> blue-500
        secondary: 'linear-gradient(to right, #a855f7, #ec4899)', // purple-500 -> pink-500
        accent: 'linear-gradient(to right, #67e8f9, #93c5fd, #c084fc)', // cyan-300 -> blue-300 -> purple-300
    },

    // Spacing and sizing
    spacing: {
        hero: {
            height: '85vh',
            maxWidth: '7xl', // 1280px
        },
    },

    // Animation durations
    animation: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
    },
};

// Tailwind CSS class utilities
export const themeClasses = {
    // Background gradients
    bgGradient: {
        hero: 'bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900',
        primary: 'bg-gradient-to-r from-cyan-500 to-blue-500',
        secondary: 'bg-gradient-to-r from-purple-500 to-pink-500',
        accent: 'bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300',
    },

    // Text gradients
    textGradient: {
        primary: 'bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent',
        secondary: 'bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent',
    },

    // Button styles
    button: {
        primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300',
        secondary: 'bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300',
        accent: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300',
    },

    // Card styles
    card: {
        glass: 'bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20',
        gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl',
    },
};

export default theme;
