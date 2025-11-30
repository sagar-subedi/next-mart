import React from 'react';

const Logo = ({ className = "h-10 w-auto" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 260 60"
    className={className}
    fill="none"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0ea5e9" /> {/* brand-highlight-500 (cyan) */}
        <stop offset="100%" stopColor="#3b82f6" /> {/* brand-primary-500 (blue) */}
      </linearGradient>
      <linearGradient id="basketGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a855f7" /> {/* brand-accent-500 (purple) */}
        <stop offset="100%" stopColor="#3b82f6" /> {/* brand-primary-500 (blue) */}
      </linearGradient>
    </defs>

    {/* Authentic Doko (Basket) Icon - Flared Top & Slightly Wider Base */}
    <g transform="translate(10, 2) scale(0.85)">

      {/* Namlo (Head Strap) - Hanging loosely */}
      <path
        d="M10 12 C 0 25, 0 45, 12 52"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Main Body - Pronounced Flare with Wider Base */}
      {/* Top width: 10 to 50 (40 units) */}
      {/* Bottom width: 21 to 39 (18 units) - Increased from 16 units (~12.5% wider) */}
      <path
        d="M10 8 L50 8 L39 55 C39 58 37 60 30 60 C23 60 21 58 21 55 L10 8 Z"
        fill="url(#basketGradient)"
        fillOpacity="0.1"
        stroke="url(#basketGradient)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Top Rim - Wider */}
      <ellipse cx="30" cy="8" rx="20" ry="3" stroke="url(#basketGradient)" strokeWidth="2.5" fill="none" />

      {/* Vertical Bamboo Ribs - Fanning out */}
      <path d="M20 11 L23 58" stroke="url(#basketGradient)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 11 L37 58" stroke="url(#basketGradient)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 11 L30 59" stroke="url(#basketGradient)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Weave Pattern - Interlaced Look */}
      {/* Horizontal Bands - Getting wider towards top */}
      <path d="M12 18 H48" stroke="url(#basketGradient)" strokeWidth="1" opacity="0.6" />
      <path d="M15 28 H45" stroke="url(#basketGradient)" strokeWidth="1" opacity="0.6" />
      <path d="M17 38 H43" stroke="url(#basketGradient)" strokeWidth="1" opacity="0.6" />
      <path d="M19 48 H41" stroke="url(#basketGradient)" strokeWidth="1" opacity="0.6" />

      {/* Cross Weaves for Texture */}
      <path d="M14 15 L18 21 M22 15 L26 21 M30 15 L34 21 M38 15 L42 21 M46 15 L50 21" stroke="url(#basketGradient)" strokeWidth="1" opacity="0.4" />
      <path d="M17 25 L21 31 M25 25 L29 31 M33 25 L37 31 M41 25 L45 31" stroke="url(#basketGradient)" strokeWidth="1" opacity="0.4" />
      <path d="M20 35 L24 41 M28 35 L32 41 M36 35 L40 41" stroke="url(#basketGradient)" strokeWidth="1" opacity="0.4" />
      <path d="M22 45 L26 51 M30 45 L34 51 M38 45 L42 51" stroke="url(#basketGradient)" strokeWidth="1" opacity="0.4" />

    </g>

    {/* Text: Doko */}
    <text
      x="65"
      y="42"
      fontFamily="var(--font-poppins), sans-serif"
      fontWeight="bold"
      fontSize="32"
      fill="url(#logoGradient)"
      letterSpacing="-0.5"
    >
      Doko
    </text>

    {/* Text: Mart */}
    <text
      x="150"
      y="42"
      fontFamily="var(--font-poppins), sans-serif"
      fontWeight="bold"
      fontSize="32"
      fill="#1e3a8a"
      letterSpacing="-0.5"
    >
      Mart
    </text>

    {/* Accent Dot */}
    <circle cx="230" cy="38" r="4" fill="#a855f7" />
  </svg>
);

export default Logo;
