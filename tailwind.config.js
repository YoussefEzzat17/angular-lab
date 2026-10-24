/** @type {import('tailwindcss').Config} */
function themeVar(name) {
  return ({ opacityValue }) => (opacityValue !== undefined ? `rgb(var(${name}) / ${opacityValue})` : `rgb(var(${name}))`);
}

function themeVarScale(prefix) {
  return Object.fromEntries(
    [50, 100, 200, 300, 400, 500, 600, 700, 750, 800, 900, 930, 950].map((shade) => [shade, themeVar(`--${prefix}-${shade}`)]),
  );
}

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Both palettes resolve through CSS custom properties (see src/styles.css) so the same
        // utility classes (bg-stone-900, text-gold-400, ...) automatically repaint for light mode —
        // no component needs a dark:/light: variant.
        stone: themeVarScale('stone'),
        // Runaq-inspired warm gold accent, replacing the old violet brand color.
        // gold-solid is for buttons with white text: dark enough for 4.5:1, and the hover goes darker, not lighter.
        gold: { ...themeVarScale('gold'), solid: themeVar('--gold-solid'), 'solid-hover': themeVar('--gold-solid-hover') },
      },
      // Elevation tokens ("Lifted cards" in DESIGN.md). Strength and color come from --shadow-* in src/styles.css,
      // so each theme tunes its own shadows.
      boxShadow: {
        card: 'inset 0 1px 0 0 var(--shadow-highlight), 0 1px 2px rgb(var(--shadow-color) / var(--shadow-near)), 0 8px 24px -10px rgb(var(--shadow-color) / var(--shadow-far))',
        'card-lift': 'inset 0 1px 0 0 var(--shadow-highlight), 0 2px 4px rgb(var(--shadow-color) / var(--shadow-near)), 0 18px 36px -12px rgb(var(--shadow-color) / calc(var(--shadow-far) * 1.4))',
        float: 'inset 0 1px 0 0 var(--shadow-highlight), 0 4px 8px rgb(var(--shadow-color) / var(--shadow-near)), 0 28px 56px -16px rgb(var(--shadow-color) / calc(var(--shadow-far) * 1.6))',
      },
    },
  },
  plugins: [],
}
