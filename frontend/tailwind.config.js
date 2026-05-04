export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#0B2414',
        obsidian: '#040d08',
        moss: '#4A6741',
        mint: '#E8F3ED',
        cream: '#F5F5DC',
        sage: '#A3B68D',
        neonEmerald: '#00FF88',
        neonGold: '#FFD700',
      },
      boxShadow: {
        glow: '0 18px 60px rgba(162, 229, 169, 0.14)',
        insetSoft: 'inset 0 6px 22px rgba(0, 0, 0, 0.16)',
        neonOuter: '0 0 15px rgba(0, 255, 136, 0.2)',
        neonOuterGold: '0 0 20px rgba(255, 215, 0, 0.3)',
      },
      borderRadius: {
        organic: '32px'
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
      }
    }
  },
  plugins: []
};
