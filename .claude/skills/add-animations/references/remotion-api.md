# Key Remotion APIs

Quick reference for the APIs used in this skill. All from `remotion` package.

## Core hooks

```ts
const frame = useCurrentFrame();         // current frame number (0-based)
const { fps, durationInFrames, width, height } = useVideoConfig();
```

## Sequencing

```tsx
// Show content starting at frame 30, lasting 60 frames
<Sequence from={30} durationInFrames={60}>
  <MyComponent />
</Sequence>

// Sequences nest — inner frame resets to 0 inside each Sequence
```

## Animations

```ts
// Smooth spring physics animation
const value = spring({
  fps,
  frame,
  config: { damping: 14, stiffness: 180, mass: 0.8 },
  from: 0,
  to: 100,
  durationInFrames: 30, // optional clamp
});

// Linear interpolation between keyframes
const opacity = interpolate(
  frame,
  [0, 15, 30],     // input frames
  [0, 1, 0],       // output values
  {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }
);
```

## Video

```tsx
// OffthreadVideo is preferred over <Video> for rendering — handles seeking better
<OffthreadVideo src={videoSrc} />

// Trim the video (start at 5s, show 10s worth)
<OffthreadVideo src={videoSrc} startFrom={5 * fps} endAt={15 * fps} />
```

## Layout

```tsx
// Full-bleed container (use as wrapper for each layer)
<AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
  ...
</AbsoluteFill>
```

## CLI commands

```bash
# Open Remotion Studio (scrub, preview)
cd /c/Content-Creation/remotion-project
npx remotion studio

# List compositions
npx remotion compositions

# Render a composition
npx remotion render <CompositionId> --output /path/to/output.mp4

# Render with specific codec (default h264)
npx remotion render <CompositionId> --codec h264 --output /path/to/output.mp4
```

## Root.tsx registration

```tsx
import { Composition } from 'remotion';
import { MyReel } from './compositions/MyReel';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyReel"
        component={MyReel}
        durationInFrames={totalFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoSrc: '/absolute/path/to/roughcut.mp4' }}
      />
    </>
  );
};
```

## Duration calculation

```ts
// Always use 30fps for Instagram Reels
const fps = 30;
const totalFrames = Math.round(totalDurationSeconds * fps);

// Convert a transcript timestamp (seconds) to frame number
const frame = Math.round(timestampSeconds * fps);
```
