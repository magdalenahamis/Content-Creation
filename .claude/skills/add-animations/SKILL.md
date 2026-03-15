---
name: add-animations
description: >
  Adds professional animations to finance-reel roughcut videos using Remotion.
  Produces bold text callouts when key stats or numbers are mentioned, animated number
  counters, section title cards, and transitions between clips. Outputs a final 1080x1920
  Instagram Reels MP4. Use this skill whenever the user says "add animations to my roughcut",
  "animate this reel", "make the video more dynamic", "add text overlays", "add transitions",
  or anything about enhancing a roughcut with motion graphics or visual effects.
---

# Add Animations to Roughcut

This skill takes a ButterCut roughcut (YAML + MP4) and wraps it in a Remotion composition
that adds animation layers — text callouts, number counters, section titles, and transitions.
The output is a final rendered MP4 ready for Instagram Reels.

## Brand palette

```ts
export const theme = {
  yellow:  '#F5C842',  // buttery yellow — primary accent
  white:   '#FFFFFF',
  black:   '#111111',  // near-black for legibility
  overlay: 'rgba(17, 17, 17, 0.78)',  // semi-transparent dark backing for text
}
```

Use the palette consistently. Yellow is for numbers, stats, and emphasis. White is for
body text and labels. Black/overlay as background when text needs contrast against video.

## Remotion project location

The Remotion project lives at: `/c/Content-Creation/remotion-project/`

Check if it exists before proceeding. If it doesn't, run `scripts/setup_project.sh` to
bootstrap it. See `references/remotion-api.md` for key APIs.

## Step-by-step workflow

### 1. Identify the roughcut

Ask the user which roughcut to animate if it's not clear. The roughcutss live at:
`/c/Content-Creation/libraries/finance-reels/roughcuts/`

You need two files:
- The `.yaml` file (clip timings, dialogue, visual descriptions)
- The rendered `.mp4` file (the video to animate)
- The transcript `.json` from `/c/Content-Creation/libraries/finance-reels/transcripts/`
  (match by the source_file UUID in the YAML's first clip)

### 2. Check setup

```bash
ls /c/Content-Creation/remotion-project/ 2>/dev/null || bash /c/Content-Creation/skills/add-animations/scripts/setup_project.sh
```

### 3. Analyze the roughcut for animation moments

Read the YAML and transcript carefully. You're looking for three types of moments:

**A. Number / stat callouts**
Any time a specific number, dollar amount, or percentage is spoken:
- "25 cents" → `$0.25`
- "almost $200" → `$200`
- "half of its value" → `50%`
- "seven things" → `7`

Use word-level timestamps from the transcript JSON to find the exact frame when the number word starts. The callout should appear on that frame and hold for ~1.5 seconds.

**B. Section titles** (for list-format reels)
If the reel is structured as a numbered list (tip 1, tip 2, etc.), create a title card
at the start of each numbered section. Pull the label from the YAML dialogue field
(e.g., "1. Gambling — Sports Betting"). The card should slide in from the bottom, hold
for ~1 second, then slide back out.

**C. Transition points**
Each clip boundary in the YAML is a natural transition moment. Use a short flash cut
(2–4 frames of white flash) between clips to give energy. For the hook (first clip)
to body transition, you can use a zoom-in snap instead.

### 4. Generate the composition file

Write the composition to:
`/c/Content-Creation/remotion-project/src/compositions/[VideoName].tsx`

And register it in:
`/c/Content-Creation/remotion-project/src/Root.tsx`

See `references/components.md` for copy-paste component templates for:
- `<TextCallout>` — bold stat overlay
- `<NumberCounter>` — counting-up number animation
- `<SectionTitle>` — sliding tip title card
- `<FlashTransition>` — white flash between clips

The composition uses `<OffthreadVideo>` for the base video and layers animations on top
using `<Sequence>` with exact frame numbers. Convert seconds to frames with:
`Math.round(seconds * fps)` where fps is 30.

### 5. Preview (optional but recommended)

```bash
cd /c/Content-Creation/remotion-project && npx remotion studio
```

Opens at http://localhost:3000. Let the user scrub through before committing to a full render.

### 6. Render

```bash
cd /c/Content-Creation/remotion-project && npx remotion render [CompositionId] \
  --output "/c/Content-Creation/libraries/finance-reels/roughcuts/[original_name]_animated.mp4"
```

The composition ID is whatever you set in `Root.tsx` (e.g., `"7Things20sAnimated"`).

Output goes into the roughcuts folder alongside the original so the user can compare.

## Composition boilerplate

Every composition should follow this structure:

```tsx
import { AbsoluteFill, OffthreadVideo, Sequence, useVideoConfig } from 'remotion';
import { theme } from '../theme';
// import your animation components

export const MyComposition: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const { fps } = useVideoConfig();
  const f = (seconds: number) => Math.round(seconds * fps); // helper

  return (
    <AbsoluteFill style={{ background: theme.black }}>
      {/* Base video layer */}
      <OffthreadVideo src={videoSrc} />

      {/* Animation layers — add Sequences here */}
    </AbsoluteFill>
  );
};
```

Register in Root.tsx:
```tsx
<Composition
  id="MyComposition"
  component={MyComposition}
  durationInFrames={Math.round(totalDurationSeconds * 30)}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{ videoSrc: '/path/to/roughcut.mp4' }}
/>
```

## Quality notes

- Keep callouts short and punchy — 3–5 words max on screen at a time
- Don't stack animations; if two stats overlap in time, show one and skip the other
- Yellow for numbers/stats, white for labels — never reverse this
- The video should feel energetic but not cluttered; when in doubt, do less
- Animation references are in `references/components.md`
