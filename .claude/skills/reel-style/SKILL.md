---
name: reel-style
description: >
  Visual style template for Instagram Reels animations — clean, minimal, inspired by
  lukedavis.ig. Defines the typography, caption system, color palette, and three composition
  modes (full face-cam, split screen, pure animation) for finance reel videos.
  Load this skill whenever working on animation style, Remotion components, caption design,
  or any visual decisions for Instagram Reels. Use it alongside the add-animations skill.
---

# Reel Style Template

This is the canonical visual style for all Instagram Reels animations in this project.
Inspired by lukedavis.ig — clean, minimal, editorial. Reference video: `C:/Content-Creation/animation-examples/`

Read this guide fully before building any Remotion composition.

---

## Core principles

- **Less is more.** If you're not sure whether to add something, don't.
- **Let the speaker breathe.** Animations support the speech — they don't compete with it.
- **No clutter.** No dark backing boxes, no pill badges, no bouncing counters, no flash effects.
- **Text does the work.** Typography and timing are the design.

---

## Color palette

```ts
export const theme = {
  white:      '#FFFFFF',
  black:      '#111111',
  lightGray:  '#E8E8E8',   // background for pure animation frames
  dim:        'rgba(255, 255, 255, 0.35)',  // upcoming caption words on video
  dimDark:    'rgba(17, 17, 17, 0.35)',     // upcoming caption words on light bg
};
```

---

## Typography

**Font:** Inter — load from Google Fonts in the Remotion project.

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();
```

| Use case | Weight | Size (1080px wide) | Case |
|---|---|---|---|
| Caption on video (current word) | 500 | 54px | Sentence case |
| Caption on video (upcoming words) | 400 | 54px | Sentence case |
| Caption on light bg (current word) | 600 | 52px | Sentence case |
| Big text card statement | 800 | 80–96px | Sentence case |
| Section label | 700 | 52px | Sentence case |
| Stat accent | 800 | 80px | — |
| Split-screen graphic text | 700–800 | 60–80px | Sentence case |

Never ALL CAPS. Never a background box behind text.

---

## Three composition modes

Every segment of the video falls into one of three modes. The skill chooses automatically
based on what's being said. See decision rules below.

---

### Mode 1 — Full face-cam

The default. Speaker fills the full 1080×1920 frame. Captions in white at the bottom.

**Use when:** The speaker is in conversational mode — explaining, giving advice,
telling a story. No strong visual concept to illustrate. No key stat being revealed.

```
┌─────────────────┐
│                 │
│                 │
│   FACE-CAM      │
│   (full frame)  │
│                 │
│  [captions]     │
└─────────────────┘
```

Components: `<OffthreadVideo>` + `<Caption>`

---

### Mode 2 — Split screen (top/bottom)

Top half (960px): animated graphic or visual — stat, chart, illustration, bold text
Bottom half (960px): face-cam cropped to lower portion of video

**Use when:** A key number, stat, or concept is mentioned that benefits from a
simultaneous visual. The speaker stays visible but shares the frame with context.

```
┌─────────────────┐
│  ANIMATION      │  ← top 960px: graphic, stat, bold concept
│  (top half)     │
├─────────────────┤
│  FACE-CAM       │  ← bottom 960px: cropped face-cam
│  (bottom half)  │
└─────────────────┘
```

The face-cam in the bottom half is cropped: show `startFrom` the bottom of the video
frame so the speaker's face is visible (not their feet). Use `objectFit: 'cover'` and
`objectPosition: 'center bottom'` on the video element.

Captions: shown in the bottom half, white, slightly smaller (46px).

Components: `<SplitScreen>` wrapping a graphic + `<OffthreadVideo>`

---

### Mode 3 — Pure animation

No face-cam. Full 1080×1920 frame is a light gray (`#E8E8E8`) background.
Either bold text alone, or a topic-matched animated visual with text.

**Use when:**
- Hook moment (opening line, before speaker appears)
- A powerful statement that lands better without the face (e.g. "One wrong purchase can cost you years.")
- Section transition that needs breathing room
- A concept that's more compelling as a visual metaphor than as a talking head

```
┌─────────────────┐
│                 │
│  Bold text      │
│  on light gray  │  ← #E8E8E8 background, no video
│                 │
│                 │
└─────────────────┘
```

**Text-only version:** 1–2 lines of bold black text, vertically centered, ~80px, weight 800.
Fades in word by word or as a full block. Like Luke's *"Fear is literally quantifiable."* cards.

**Visual version:** Custom Remotion animation (chart, icon, illustration) that matches
the topic — e.g. a simple animated price tag for "expensive pets", a car silhouette for
"brand new car". See animated visual guidelines below.

Components: `<TextCard>` or a custom animation component

---

## Auto mode-selection rules

When planning a composition, go through the transcript segment by segment and apply these rules in order:

| Condition | Mode |
|---|---|
| Opening hook (first spoken sentence) | Mode 3 — text card for the hook statement |
| Speaker is telling a personal story or giving conversational advice | Mode 1 — full face-cam |
| A specific number/dollar amount/percentage is mentioned | Mode 2 — split screen with stat on top |
| A strong concept can be illustrated (car, pet, coffee, chart) | Mode 2 — split screen with illustration on top |
| A short punchy statement that lands better alone | Mode 3 — text card |
| Section transition between tips (the number announcement) | Mode 3 — brief text card (e.g. "1. Gambling") |
| CTA / outro | Mode 1 — face-cam with caption, or Mode 3 text card |
| Everything else | Mode 1 — face-cam |

**Timing guidance:** Mode 3 cards should be short (1–3 seconds). Split screens should
hold as long as the relevant stat/visual is being discussed. Don't switch modes more than
once every 2–3 seconds — fast cuts between modes feel chaotic.

---

## Animated visual guidelines (Mode 2 & 3)

When a topic has a natural visual metaphor, build a simple Remotion animation for it.
These should feel like Luke Davis's illustrations — clean, geometric, minimal.

Principles:
- Use simple SVG-style shapes drawn with `<div>` or inline SVG — no external image files
- Animate with `spring()` and `interpolate()` — subtle motion, not hyper-kinetic
- Stick to the color palette: black, white, light gray. One accent color per visual max.
- Keep it abstract/iconic — a suggestion of the concept, not a detailed illustration

Examples for this video's topics:

| Topic | Visual idea |
|---|---|
| Gambling / sports betting | Animated dice roll, or a line graph going to zero |
| Expensive pets | Simple cat/dog icon with a rising price tag |
| Eating out every day | A receipt that keeps growing |
| Coffee runs | A coffee cup icon with "25¢ vs $6" text |
| Brand new car | A simple car shape with a depreciation curve |
| Designer clothes | A price tag with "Gucci" crossed out |
| Speeding ticket | A bold "$400" appearing with a brief red flash on the number |

These are suggestions — use your judgment based on what's buildable cleanly.

---

## Caption system

Word-by-word reveal synced to transcript timestamps.

- Current/past words: full opacity
- Upcoming words in the same phrase: 35% opacity (ghosted)
- No background box
- **On video (Mode 1 & 2 bottom):** white text, subtle text shadow
- **On light bg (Mode 3):** dark text (`#111111`)
- Position: 18% from bottom of their respective area

See `references/components.md` for `<Caption>` component.

---

## What NOT to do

- ❌ Dark semi-transparent overlay boxes behind text
- ❌ Yellow `#F5C842` accent color
- ❌ Colored pill/badge section title cards
- ❌ White flash transitions
- ❌ Big animated number counters with dark backgrounds
- ❌ ALL CAPS text
- ❌ Stacking multiple simultaneous animations
- ❌ Switching modes more than once every 2–3 seconds

---

## OffthreadVideo — known fix

Always use `file:///` prefix for local video paths:

```tsx
defaultProps={{ videoSrc: 'file:///c/Content-Creation/libraries/finance-reels/roughcuts/my_roughcut.mp4' }}
```

Without `file:///`, the video renders as a still image (known bug).

---

## Reference files

- `references/components.md` — Caption, SectionLabel, StatAccent, SplitScreen, TextCard components
