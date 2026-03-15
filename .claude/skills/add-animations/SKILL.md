---
name: add-animations
description: >
  Adds professional animations to finance-reel roughcut videos using Remotion.
  Uses the clean minimal reel-style (lukedavis.ig inspired): word-by-word captions,
  three composition modes (full face-cam, split screen, pure animation), Inter font,
  light gray backgrounds. Outputs a final 1080x1920 Instagram Reels MP4.
  Use this skill whenever the user says "add animations to my roughcut", "animate this reel",
  "make the video more dynamic", "add text overlays", "add transitions", or anything about
  enhancing a roughcut with motion graphics or visual effects.
---

# Add Animations to Roughcut

This skill takes a ButterCut roughcut (YAML + MP4) and wraps it in a Remotion composition
that adds animation layers using the canonical `reel-style` template.

**Always read the `reel-style` skill before writing any composition code.** It defines
the visual style, three composition modes, component templates, and auto-switching rules.

## Style reference

The style is defined in: `C:/Content-Creation/.claude/skills/reel-style/`

Key principles (full details in `reel-style`):
- Three modes: full face-cam / split screen (top animation, bottom face-cam) / pure animation
- Font: Inter, sentence case, no ALL CAPS
- Colors: white on video, `#111111` on light gray `#E8E8E8` backgrounds
- Captions: word-by-word reveal, no background box
- No: yellow accents, pill badges, flash transitions, dark overlay boxes

## Remotion project location

`/c/Content-Creation/remotion-project/`

Check it exists before proceeding. If not, run `scripts/setup_project.sh`.

## Step-by-step workflow

### 1. Identify the roughcut

Files needed — all in `libraries/finance-reels/`:
- `roughcuts/[name].yaml` — clip timings and dialogue
- `roughcuts/[name].mp4` — the rendered roughcut video
- `transcripts/[uuid].json` — word-level timing (match UUID from YAML's first clip)

### 2. Read the reel-style skill

Read `C:/Content-Creation/.claude/skills/reel-style/SKILL.md` and
`C:/Content-Creation/.claude/skills/reel-style/references/components.md` fully
before writing any code. All component templates are there.

### 3. Plan the composition

Go through the transcript segment by segment and assign each a mode using the
auto-switching rules from `reel-style`. Write out a plan before coding:

```
0.00–2.00  → Mode 3: TextCard hook
2.00–4.27  → Mode 1: Face-cam + captions (hook speech)
4.27–4.57  → Mode 3: TextCard "1. Gambling"
4.57–9.00  → Mode 1: Face-cam + captions
9.00–9.18  → Mode 3: TextCard "2. Expensive pets"
...etc
```

This plan becomes the skeleton of your `<Sequence>` blocks.

### 4. Install Inter font dependency

```bash
cd /c/Content-Creation/remotion-project
npm install @remotion/google-fonts
```

### 5. Write the composition file

Write to: `/c/Content-Creation/remotion-project/src/compositions/[VideoName].tsx`

Copy component code from `reel-style/references/components.md` into
`src/components/` — one file per component. Create `src/theme.ts` from the template.

Register the composition in `src/Root.tsx`.

**Critical — always use `file:///` prefix for the video path:**
```tsx
defaultProps={{ videoSrc: 'file:///c/Content-Creation/libraries/finance-reels/roughcuts/[name].mp4' }}
```
Without `file:///`, OffthreadVideo renders a still image instead of playing. This is
the known bug from the previous render.

### 6. Preview

```bash
cd /c/Content-Creation/remotion-project && npx remotion studio
```

Opens at http://localhost:3000. Scrub through to check modes and timing before rendering.

### 7. Render

```bash
cd /c/Content-Creation/remotion-project && npx remotion render [CompositionId] \
  --output "/c/Content-Creation/libraries/finance-reels/roughcuts/[original_name]_animated.mp4"
```

Output goes into roughcuts/ alongside the original for comparison.

## Composition structure

```tsx
import { AbsoluteFill, OffthreadVideo, Sequence, useVideoConfig } from 'remotion';
import { Caption } from '../components/Caption';
import { TextCard } from '../components/TextCard';
import { SplitScreen } from '../components/SplitScreen';
import { SectionLabel } from '../components/SectionLabel';
import { StatAccent } from '../components/StatAccent';
import { fontFamily } from '../theme';

export const MyReel: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* One <Sequence> per segment — cover every frame, no gaps */}
    </AbsoluteFill>
  );
};
```

Every frame must be covered by exactly one `<Sequence>`. No gaps, no overlaps.
