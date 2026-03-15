# Component Templates — Clean Reel Style

All components follow the Luke Davis aesthetic: no backing boxes, no colored accents,
clean Inter type. Copy these into `src/components/`.

---

## theme.ts

```ts
// src/theme.ts
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();
export { fontFamily };

export const theme = {
  white:     '#FFFFFF',
  black:     '#111111',
  lightGray: '#E8E8E8',
  dim:       'rgba(255, 255, 255, 0.35)',
  dimDark:   'rgba(17, 17, 17, 0.35)',
};
```

---

## Caption

Word-by-word caption synced to transcript timestamps. Works in all three modes —
pass `onDark={false}` when rendering on the light gray background (Mode 3).

```tsx
// src/components/Caption.tsx
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { theme, fontFamily } from '../theme';

interface Word {
  word: string;
  start: number; // seconds
  end: number;   // seconds
}

interface CaptionProps {
  words: Word[];
  fps: number;
  onDark?: boolean;        // true = white text (default), false = black text on light bg
  bottomOffset?: string;   // CSS value, default '18%'
  fontSize?: number;       // default 54
}

export const Caption: React.FC<CaptionProps> = ({
  words,
  fps,
  onDark = true,
  bottomOffset = '18%',
  fontSize = 54,
}) => {
  const frame = useCurrentFrame();
  const currentTime = frame / fps;

  const windowStart = currentTime - 0.1;
  const windowEnd = currentTime + 3.0;

  const visibleWords = words.filter(
    (w) => w.end > windowStart && w.start < windowEnd
  );

  if (visibleWords.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        left: 0,
        right: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: '0 10px',
        padding: '0 60px',
        fontFamily,
        pointerEvents: 'none',
      }}
    >
      {visibleWords.map((w, i) => {
        const spoken = currentTime >= w.start;
        return (
          <span
            key={i}
            style={{
              color: spoken
                ? (onDark ? theme.white : theme.black)
                : (onDark ? theme.dim : theme.dimDark),
              fontSize,
              fontWeight: spoken ? 500 : 400,
              lineHeight: 1.3,
              letterSpacing: -0.5,
              textShadow: onDark ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};
```

---

## SplitScreen

Top half: animated graphic (you pass it as `children`).
Bottom half: face-cam video, cropped to show the speaker's face.

```tsx
// src/components/SplitScreen.tsx
import React from 'react';
import { AbsoluteFill, OffthreadVideo } from 'remotion';
import { theme } from '../theme';

interface SplitScreenProps {
  videoSrc: string;
  children: React.ReactNode;  // the graphic/animation for the top half
  videoStartFrom?: number;    // frame offset into the source video
}

export const SplitScreen: React.FC<SplitScreenProps> = ({
  videoSrc,
  children,
  videoStartFrom = 0,
}) => {
  return (
    <AbsoluteFill style={{ background: theme.lightGray }}>
      {/* Top half — animation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>

      {/* Bottom half — face-cam */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          overflow: 'hidden',
        }}
      >
        <OffthreadVideo
          src={videoSrc}
          startFrom={videoStartFrom}
          style={{
            width: '100%',
            height: '200%',         // double height so we can crop to the face
            objectFit: 'cover',
            objectPosition: 'center top',  // show top of video (where face is)
            marginTop: 0,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
```

**Usage:**
```tsx
<SplitScreen videoSrc={videoSrc} videoStartFrom={f(22.64)}>
  <StatAccent text="50%" label="value lost in 3 years" />
</SplitScreen>
```

---

## TextCard

Full-frame bold text on light gray background. Used for Mode 3 pure animation moments —
hook lines, punchy statements, section transitions.

Animates in as a block (fade + subtle rise), holds, then fades out.

```tsx
// src/components/TextCard.tsx
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme, fontFamily } from '../theme';

interface TextCardProps {
  lines: string[];          // 1–2 lines of text
  holdFrames?: number;      // default 40
  fontSize?: number;        // default 88
  align?: 'left' | 'center'; // default 'center'
}

export const TextCard: React.FC<TextCardProps> = ({
  lines,
  holdFrames = 40,
  fontSize = 88,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = 10;
  const fadeOut = 10;

  const opacity = interpolate(
    frame,
    [0, fadeIn, holdFrames, holdFrames + fadeOut],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const translateY = spring({
    fps,
    frame,
    config: { damping: 20, stiffness: 120, mass: 0.8 },
    from: 20,
    to: 0,
    durationInFrames: fadeIn + 8,
  });

  return (
    <AbsoluteFill
      style={{
        background: theme.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          textAlign: align,
          fontFamily,
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              color: theme.black,
              fontSize,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: -2,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
```

**Usage:**
```tsx
// Hook card
<Sequence from={0} durationInFrames={60}>
  <TextCard lines={["7 things to never", "spend money on."]} />
</Sequence>

// Section transition
<Sequence from={f(4.27)} durationInFrames={36}>
  <TextCard lines={["1. Gambling"]} fontSize={96} />
</Sequence>
```

---

## SectionLabel

For use in Mode 1 (full face-cam) — clean text fade at the top of frame when a
section begins. No pill badge.

```tsx
// src/components/SectionLabel.tsx
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme, fontFamily } from '../theme';

interface SectionLabelProps {
  number: number;
  title: string;
  holdFrames?: number;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  number,
  title,
  holdFrames = 24,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 8, holdFrames, holdFrames + 8],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity,
          fontFamily,
        }}
      >
        <span
          style={{
            color: theme.white,
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: -0.5,
            textShadow: '0 2px 10px rgba(0,0,0,0.4)',
          }}
        >
          {number}. {title}
        </span>
      </div>
    </AbsoluteFill>
  );
};
```

---

## StatAccent

A single bold number/stat that appears briefly. For use in Mode 2 split screen
(inside the top-half graphic area) or Mode 1 as a subtle overlay.

```tsx
// src/components/StatAccent.tsx
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { theme, fontFamily } from '../theme';

interface StatAccentProps {
  text: string;           // e.g. "$400" or "25¢" or "50%"
  label?: string;         // optional smaller text below
  onDark?: boolean;       // true = white (default), false = black on light bg
}

export const StatAccent: React.FC<StatAccentProps> = ({
  text,
  label,
  onDark = false,         // in SplitScreen top half, bg is light gray
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 8, 36, 44],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const color = onDark ? theme.white : theme.black;

  return (
    <div style={{ opacity, textAlign: 'center', fontFamily }}>
      <div
        style={{
          color,
          fontSize: 80,
          fontWeight: 800,
          letterSpacing: -2,
          lineHeight: 1,
        }}
      >
        {text}
      </div>
      {label && (
        <div
          style={{
            color,
            fontSize: 36,
            fontWeight: 500,
            opacity: 0.6,
            marginTop: 8,
            letterSpacing: 0,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
```

---

## Full composition example (all three modes)

This shows how a composition mixes the three modes using `<Sequence>`:

```tsx
import { AbsoluteFill, OffthreadVideo, Sequence, useVideoConfig } from 'remotion';
import { Caption } from '../components/Caption';
import { TextCard } from '../components/TextCard';
import { SplitScreen } from '../components/SplitScreen';
import { SectionLabel } from '../components/SectionLabel';
import { StatAccent } from '../components/StatAccent';
import { fontFamily } from '../theme';

const WORDS = [ /* full word array from transcript */ ];
const VIDEO_DURATION = 43.63;

export const MyReel: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const totalFrames = Math.round(VIDEO_DURATION * fps);

  return (
    <AbsoluteFill style={{ fontFamily }}>

      {/* ── MODE 3: Hook text card (0–2s, before face appears) ── */}
      <Sequence from={0} durationInFrames={f(2)}>
        <TextCard lines={["7 things to never", "spend money on."]} />
      </Sequence>

      {/* ── MODE 1: Full face-cam with captions (2s–4.27s, hook speech) ── */}
      <Sequence from={f(2)} durationInFrames={f(4.27) - f(2)}>
        <AbsoluteFill>
          <OffthreadVideo src={videoSrc} startFrom={f(2)} />
          <Caption words={WORDS} fps={fps} />
        </AbsoluteFill>
      </Sequence>

      {/* ── MODE 3: Section transition card — "1. Gambling" ── */}
      <Sequence from={f(4.27)} durationInFrames={30}>
        <TextCard lines={["1. Gambling"]} fontSize={96} holdFrames={20} />
      </Sequence>

      {/* ── MODE 1: Face-cam — gambling tip ── */}
      <Sequence from={f(4.57)} durationInFrames={f(19.35) - f(4.57)}>
        <AbsoluteFill>
          <OffthreadVideo src={videoSrc} startFrom={f(4.57)} />
          <Caption words={WORDS} fps={fps} />
        </AbsoluteFill>
      </Sequence>

      {/* ── MODE 2: Split screen — "25¢ at home" coffee tip ── */}
      <Sequence from={f(19.35)} durationInFrames={f(22.62) - f(19.35)}>
        <SplitScreen videoSrc={videoSrc} videoStartFrom={f(19.35)}>
          <StatAccent text="25¢" label="to make at home" />
        </SplitScreen>
        <Caption words={WORDS} fps={fps} bottomOffset="8%" fontSize={46} />
      </Sequence>

      {/* ── MODE 2: Split screen — "50% value loss" car tip ── */}
      <Sequence from={f(22.62)} durationInFrames={f(27.9) - f(22.62)}>
        <SplitScreen videoSrc={videoSrc} videoStartFrom={f(22.62)}>
          <StatAccent text="50%" label="value lost in 3 years" />
        </SplitScreen>
        <Caption words={WORDS} fps={fps} bottomOffset="8%" fontSize={46} />
      </Sequence>

      {/* ── MODE 1: Face-cam — designer clothes + outro ── */}
      <Sequence from={f(27.9)} durationInFrames={totalFrames - f(27.9)}>
        <AbsoluteFill>
          <OffthreadVideo src={videoSrc} startFrom={f(27.9)} />
          <Caption words={WORDS} fps={fps} />
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};
```

**Key rule:** Every frame of the video must be covered by exactly one `<Sequence>`.
Don't leave gaps — if no special mode is active, default to Mode 1 face-cam.
