# El Dichoso Digital — React + Tailwind v4 + shadcn/ui

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

- `src/App.jsx` – state, screens, save / share / WhatsApp / confetti (ported from the inline script)
- `src/components/ScratchCell.jsx` – scratch-off canvas (45% threshold, keyboard + SR reveal)
- `src/components/ui/button.jsx` – shadcn Button with 3 extra variants: `cta`, `hotspot`, `reveal`
- `src/lib/card.js` – card generation (crypto RNG), localStorage, PNG export
- `src/lib/layout.js` – % boxes for cells / hotspots / hand
- `src/assets/` – the images that were base64-embedded in the HTML
