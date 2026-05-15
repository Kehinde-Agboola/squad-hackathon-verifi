/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B3D2E',
          light: '#E6F4EF',
          mid: '#1A6B52',
        },
        background: '#FAF8F4',
        surface: '#FFFFFF',
        border: '#DDE5E0',
        muted: '#6B7D73',
        ink: '#0F1A14',
        gold: '#C8973A',
        amber: '#C8793A',
        danger: '#C0392B',

        // Trust OS dark tokens (landing page)
        ts: {
          base:        '#080C10',
          surface:     '#0D1117',
          elevated:    '#161B22',
          hover:       '#1C2128',
          border:      '#21262D',
          'border-active': '#30363D',
          green:       '#00D97E',
          'green-dim': '#0D2B1E',
          amber:       '#F0A500',
          'amber-dim': '#2B1E0A',
          red:         '#F85149',
          'red-dim':   '#2B0A0A',
          purple:      '#8B5CF6',
          'purple-dim':'#1A0F2E',
          blue:        '#58A6FF',
          'text-pri':  '#E6EDF3',
          'text-sec':  '#8B949E',
          'text-mut':  '#484F58',
          gold:        '#D29922',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui'],
        display: ['Playfair Display', 'serif'],
        // Trust OS fonts
        ts: ['Inter', 'system-ui', 'sans-serif'],
        'ts-display': ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        'ts-mono': ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(11,61,46,.06)',
        'glow-green':  '0 0 20px rgba(0,217,126,0.2)',
        'glow-amber':  '0 0 20px rgba(240,165,0,0.2)',
        'glow-red':    '0 0 20px rgba(248,81,73,0.2)',
        'glow-green-lg': '0 0 60px rgba(0,217,126,0.25)',
      },
      keyframes: {
        'ts-shimmer': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'ts-blink': {
          '0%, 49%':  { opacity: '1' },
          '50%, 100%':{ opacity: '0' },
        },
        'ts-marquee': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'ts-pulse-dot': {
          '0%, 100%': { transform: 'scale(1)',   opacity: '1' },
          '50%':      { transform: 'scale(1.4)', opacity: '0.5' },
        },
        'ts-fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'ts-shimmer':    'ts-shimmer 2.5s linear infinite',
        'ts-blink':      'ts-blink 1s step-end infinite',
        'ts-marquee':    'ts-marquee 35s linear infinite',
        'ts-pulse-dot':  'ts-pulse-dot 1.6s ease-in-out infinite',
        'ts-fade-up':    'ts-fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
