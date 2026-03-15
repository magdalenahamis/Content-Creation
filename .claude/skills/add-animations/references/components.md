# Animation Component Templates

Copy these into your composition or into separate files under `src/components/`.
All components assume the brand theme is imported from `../theme`.

---

## theme.ts

Put this at `src/theme.ts`:

```ts
export const theme = {
  yellow:  '#F5C842',
  white:   '#FFFFFF',
  black:   '#111111',
  overlay: 'rgba(17, 17, 17, 0.78)',
};
```

---

## TextCallout

A bold stat/quote overlay that springs in from below, holds, then fades out.
Use this for any number or key phrase you want to emphasize.

```tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

interface TextCalloutProps {
  text: string;        // e.g. "$200" or "25¢ at home"
  label?: string;      // optional smaller label above, e.g. "vs $6 at Starbucks"
  holdFrames?: number; // how long to stay visible, default 45 (1.5s at 30fps)
  position?: 'top' | 'bottom'; // where on screen, default 'bottom'
}

export const TextCallout: React.FC<TextCalloutProps> = ({
  text,
  label,
  holdFrames = 45,
  position = 'bottom',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = holdFrames + 10; // 10 frames for exit fade

  // Spring entrance
  const translateY = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 180, mass: 0.6 },
    from: 60,
    to: 0,
  });

  // Exit fade
  const opacity = interpolate(frame, [holdFrames, totalFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const verticalPos = position === 'bottom'
    ? { bottom: 160 }
    : { top: 160 };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        ...verticalPos,
        background: theme.overlay,
        borderRadius: 16,
        padding: '18px 36px',
        textAlign: 'center',
        maxWidth: '80%',
      }}>
        {label && (
          <div style={{
            color: theme.white,
            fontSize: 28,
            fontWeight: 500,
            marginBottom: 6,
            letterSpacing: 1,
            textTransform: 'uppercase',
            opacity: 0.75,
          }}>
            {label}
          </div>
        )}
        <div style={{
          color: theme.yellow,
          fontSize: 72,
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: -1,
        }}>
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

---

## NumberCounter

Counts up from 0 to a target number with easing. Great for dollar amounts and
percentages. Pairs well with a TextCallout label.

```tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

interface NumberCounterProps {
  to: number;          // target value, e.g. 200
  prefix?: string;     // e.g. "$"
  suffix?: string;     // e.g. "%" or "k"
  label?: string;      // context label below, e.g. "speeding ticket"
  durationFrames?: number; // how long to count up, default 30 (1s)
}

export const NumberCounter: React.FC<NumberCounterProps> = ({
  to,
  prefix = '',
  suffix = '',
  label,
  durationFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame,
    config: { damping: 20, stiffness: 80, mass: 1 },
    durationInFrames: durationFrames,
  });

  const value = Math.round(interpolate(progress, [0, 1], [0, to]));

  const scaleIn = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 200 },
    from: 0.7,
    to: 1,
  });

  return (
    <AbsoluteFill style={{
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        background: theme.overlay,
        borderRadius: 24,
        padding: '28px 56px',
        textAlign: 'center',
        transform: `scale(${scaleIn})`,
      }}>
        <div style={{
          color: theme.yellow,
          fontSize: 120,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: -2,
        }}>
          {prefix}{value.toLocaleString()}{suffix}
        </div>
        {label && (
          <div style={{
            color: theme.white,
            fontSize: 32,
            fontWeight: 600,
            marginTop: 12,
            textTransform: 'uppercase',
            letterSpacing: 2,
            opacity: 0.85,
          }}>
            {label}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
```

---

## SectionTitle

Slides in from the bottom to announce a numbered tip. Use at the start of each section.
Holds for ~1s then slides back down.

```tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

interface SectionTitleProps {
  number: number;   // tip number, e.g. 1
  title: string;    // tip title, e.g. "Gambling"
  holdFrames?: number; // default 30
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  number,
  title,
  holdFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide in
  const slideIn = spring({
    fps,
    frame,
    config: { damping: 18, stiffness: 200, mass: 0.7 },
    from: 120,
    to: 0,
  });

  // Slide out
  const slideOut = interpolate(frame, [holdFrames, holdFrames + 12], [0, 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = frame < holdFrames ? slideIn : slideOut;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        bottom: 220,
        left: 0,
        right: 0,
        transform: `translateY(${translateY}px)`,
        padding: '0 48px',
      }}>
        <div style={{
          background: theme.yellow,
          borderRadius: 14,
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}>
          <div style={{
            color: theme.black,
            fontSize: 52,
            fontWeight: 900,
            lineHeight: 1,
            minWidth: 44,
          }}>
            {number}.
          </div>
          <div style={{
            color: theme.black,
            fontSize: 42,
            fontWeight: 800,
            lineHeight: 1.2,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
            {title}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

---

## FlashTransition

A white flash between clips — gives energy and signals a new section.
Wrap the clip boundary frame in a `<Sequence>` with this component.

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface FlashTransitionProps {
  durationFrames?: number; // default 6 frames (~0.2s)
}

export const FlashTransition: React.FC<FlashTransitionProps> = ({
  durationFrames = 6,
}) => {
  const frame = useCurrentFrame();

  // Flash in then out: peaks at midpoint
  const opacity = interpolate(
    frame,
    [0, durationFrames / 2, durationFrames],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{
      background: '#FFFFFF',
      opacity,
      pointerEvents: 'none',
    }} />
  );
};
```

Usage — place this at each clip boundary frame:
```tsx
// clip 1 ends at 4.27s = frame 128
<Sequence from={125} durationInFrames={6}>
  <FlashTransition />
</Sequence>
```

---

## Full composition example

Here's a minimal full composition wiring everything together:

```tsx
import { AbsoluteFill, OffthreadVideo, Sequence, useVideoConfig } from 'remotion';
import { TextCallout } from '../components/TextCallout';
import { SectionTitle } from '../components/SectionTitle';
import { FlashTransition } from '../components/FlashTransition';
import { NumberCounter } from '../components/NumberCounter';

export const MyReel: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  return (
    <AbsoluteFill>
      <OffthreadVideo src={videoSrc} />

      {/* Section title: "1. Gambling" appears at 4.32s */}
      <Sequence from={f(4.32)} durationInFrames={42}>
        <SectionTitle number={1} title="Gambling" />
      </Sequence>

      {/* Flash transition at clip 1→2 boundary */}
      <Sequence from={f(4.27) - 3} durationInFrames={6}>
        <FlashTransition />
      </Sequence>

      {/* Stat callout: "25¢" at the word "25" in transcript */}
      <Sequence from={f(21.8)} durationInFrames={55}>
        <TextCallout text="25¢" label="make it at home" />
      </Sequence>

      {/* Number counter: $200 speeding ticket */}
      <Sequence from={f(33.1)} durationInFrames={60}>
        <NumberCounter to={200} prefix="$" label="speeding ticket" />
      </Sequence>
    </AbsoluteFill>
  );
};
```
