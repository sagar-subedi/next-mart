# Theme Configuration

This document explains how to use the Nepal/Pokhara-inspired theme colors throughout the application.

## Color Palette

The theme is based on the colors of Nepal and Pokhara, featuring:
- **Primary (Blue)**: Inspired by the clear Himalayan skies
- **Secondary (Indigo)**: Representing the deep mountain valleys
- **Accent (Purple)**: Reflecting the mystical mountain peaks
- **Highlight (Cyan)**: Inspired by Phewa Lake's serene waters

## Usage

### 1. Using Tailwind Classes

The custom colors are available as Tailwind classes with the `brand-` prefix:

```tsx
// Background colors
<div className="bg-brand-primary-500">...</div>
<div className="bg-brand-secondary-800">...</div>
<div className="bg-brand-accent-500">...</div>
<div className="bg-brand-highlight-300">...</div>

// Text colors
<p className="text-brand-primary-600">...</p>
<h1 className="text-brand-accent-700">...</h1>

// Border colors
<div className="border-brand-highlight-400">...</div>
```

### 2. Using Theme Config

Import the theme configuration for programmatic access:

```tsx
import theme, { themeClasses } from '@/config/theme';

// Use predefined gradient classes
<div className={themeClasses.bgGradient.hero}>...</div>
<button className={themeClasses.button.primary}>Click me</button>

// Use text gradients
<h1 className={themeClasses.textGradient.primary}>Gradient Text</h1>

// Access color values
const primaryColor = theme.colors.primary[500]; // #3b82f6
```

### 3. Common Patterns

#### Hero Section Gradient
```tsx
className="bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900"
// Or use: themeClasses.bgGradient.hero
```

#### Primary Button
```tsx
className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
// Or use: themeClasses.button.primary
```

#### Glass Card
```tsx
className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20"
// Or use: themeClasses.card.glass
```

#### Text Gradient
```tsx
className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent"
// Or use: themeClasses.textGradient.primary
```

## Color Scale

Each color has 10 shades (50-900):
- **50-200**: Very light, good for backgrounds
- **300-500**: Medium, good for UI elements
- **600-900**: Dark, good for text and emphasis

## Examples

### Button Variants
```tsx
// Primary
<button className="bg-brand-primary-500 hover:bg-brand-primary-600 text-white">
  Primary Button
</button>

// Accent
<button className="bg-brand-accent-500 hover:bg-brand-accent-600 text-white">
  Accent Button
</button>

// Highlight
<button className="bg-brand-highlight-500 hover:bg-brand-highlight-600 text-white">
  Highlight Button
</button>
```

### Cards
```tsx
// Light card
<div className="bg-brand-primary-50 border border-brand-primary-200 rounded-lg p-4">
  Light Card
</div>

// Dark card
<div className="bg-brand-secondary-900 text-white rounded-lg p-4">
  Dark Card
</div>
```

### Gradients
```tsx
// Hero gradient
<div className="bg-gradient-to-br from-brand-primary-900 via-brand-secondary-800 to-brand-accent-900">
  Hero Section
</div>

// Button gradient
<button className="bg-gradient-to-r from-brand-highlight-500 to-brand-primary-500">
  Gradient Button
</button>
```

## Files

- **Theme Config**: `/src/config/theme.ts` - Main theme configuration
- **Tailwind Config**: `tailwind.config.js` - Tailwind color extensions
