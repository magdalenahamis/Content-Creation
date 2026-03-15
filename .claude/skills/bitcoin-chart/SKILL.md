---
name: bitcoin-chart
description: >
  Builds or modifies the BitcoinChart Remotion composition — an animated BTC/USD price
  chart in the lukedavis.ig reel style. Light gray background, red accent line, progressive
  draw animation, pulsing live dot, interpolated price counter. Use when the user wants to
  add, adjust, or re-render the bitcoin chart animation, tweak its colors, price range,
  duration, or style, or use it as a reference for building other animated chart compositions.
---

# BitcoinChart Skill

Animated Bitcoin price chart for Instagram Reels. Built in Remotion, styled to the canonical
`reel-style` theme (lukedavis.ig inspired — clean, minimal, light backgrounds).

## File locations

| What | Path |
|------|------|
| Composition | `C:/Content-Creation/animations/src/compositions/BitcoinChart.tsx` |
| Registered in | `C:/Content-Creation/animations/src/Root.tsx` |
| Theme | `C:/Content-Creation/animations/src/theme.ts` |
| Remotion project | `C:/Content-Creation/animations/` |

## Composition spec

- **ID:** `BitcoinChart`
- **Duration:** 300 frames (10 seconds at 30fps)
- **Size:** 1080×1920 (Instagram Reels vertical)
- **Entry point:** `animations/src/index.ts`

## Visual design

Follows the `reel-style` theme exactly — Mode 3 (pure animation, no face-cam).

### Color palette

| Element | Value |
|---------|-------|
| Background | `#E8E8E8` (theme lightGray) |
| Price text | `#111111` (theme black) |
| Secondary text | `rgba(17,17,17,0.35)` (theme dimDark) |
| Chart line | `#CC3322` (single red accent — communicates price drop) |
| Area fill | `#CC3322` at 0.12 → 0.0 opacity gradient |
| Grid lines | `rgba(17,17,17,0.10)` |
| Grid labels | `rgba(17,17,17,0.30)` |
| LIVE dot | `#CC3322` with opacity pulse |
| LIVE text | `rgba(17,17,17,0.45)` |
| Bottom label | `rgba(17,17,17,0.30)` |

No glow filters. No dark background boxes. No scanlines. One accent color (`#CC3322`).

### Layout (top to bottom, vertically centered)

1. LIVE badge — pulsing red dot + "LIVE" in dim text, no border/background
2. BTC / USD — dim label with wide letter-spacing
3. Price — large `#111111` tabular numeral, interpolates as chart draws
4. % change — `#CC3322` with ▼ arrow
5. SVG chart — 980×520px, smooth bezier line, area fill, dashed grid, pulsing tip dot
6. "24H PRICE ACTION" — dim bottom label

### Animation behaviour

- **Line draws progressively** left-to-right: `visibleCount = ceil(progress * 120)`
- **Price interpolates** from `$67,432` → `$62,880` in sync with visible data points
- **Fade in** over first 20 frames via `interpolate(frame, [0, 20], [0, 1])`
- **Tip dot pulses** via `Math.sin(frame * 0.25)`
- **LIVE dot pulses** via same `pulse` value (opacity oscillates 0.6–1.0)
- Price data is deterministic pseudo-random with downward drift — looks like real market movement

### SVG chart structure

```
<defs>
  <linearGradient id="areaFill">     ← red fade, 0.12 → 0.0 opacity
  <clipPath id="chartClip">          ← clips line/fill to chart bounds
</defs>
→ dashed horizontal grid lines at 66k, 64k, 62k
→ solid x-axis baseline
→ <path> area fill (url #areaFill, clipped)
→ <path> main line stroke (#CC3322, 2.5px, clipped)
→ tip dot: outer pulse ring + solid core circle
```

## Running locally

```bash
cd C:/Content-Creation/animations
npx remotion studio src/index.ts
# → opens http://localhost:3001
# → select BitcoinChart from compositions panel
```

## Rendering to MP4

```bash
cd C:/Content-Creation/animations
npx remotion render src/index.ts BitcoinChart output/bitcoin_chart.mp4
```

## Registering a new composition

All compositions are registered in `animations/src/Root.tsx`:

```tsx
<Composition
  id="BitcoinChart"
  component={BitcoinChart}
  durationInFrames={300}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{}}
/>
```

## tsconfig notes

`animations/tsconfig.json` requires these settings to avoid type errors:

```json
{
  "compilerOptions": {
    "skipLibCheck": true,       ← suppresses @types/dom-webcodecs conflicts
    "jsx": "react-jsx",         ← required for React 18 types
    "moduleResolution": "bundler"
  }
}
```

## Theme

`animations/src/theme.ts` exports:

```ts
export const theme = {
  white:     '#FFFFFF',
  black:     '#111111',
  lightGray: '#E8E8E8',
  dim:       'rgba(255, 255, 255, 0.35)',
  dimDark:   'rgba(17, 17, 17, 0.35)',
  yellow:    '#FFD700',          ← used by other components, not this chart
  overlay:   'rgba(17,17,17,0.55)',
};
```

## Building other chart compositions

Use `BitcoinChart.tsx` as the reference pattern:

1. Generate price data with `pseudoRandom()` or import real data as a constant array
2. Map data points to SVG coordinates using PAD/INNER constants
3. Build the smooth bezier path with `smoothPath(pts)`
4. Use `#CC3322` as the single accent if chart shows a decline; consider another single accent for gains
5. Keep background `#E8E8E8`, text `#111111`, no glow filters
