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
        gold: themeVarScale('gold'),
      },
    },
  },
  plugins: [],
}
