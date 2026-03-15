import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useVideoConfig } from 'remotion';
import { Caption, Word } from '../components/Caption';
import { SplitScreen } from '../components/SplitScreen';
import { SectionLabel } from '../components/SectionLabel';
import { StatAccent } from '../components/StatAccent';
import { fontFamily } from '../theme';

// ─── Source video ────────────────────────────────────────────────────────────
// Served from remotion-project/public/source.mp4 via staticFile()
const SOURCE = staticFile('source.mp4');

// ─── Clip definitions (from 7_things_20s yaml) ───────────────────────────────
// Each clip: source in/out points, computed roughcut start, duration
// Roughcut start accumulates clip durations
// Clip 1: source 0.03–4.30  (4.27s)  roughcut 0.00–4.27
// Clip 2: source 4.32–8.98  (4.66s)  roughcut 4.27–8.93
// Clip 3: source 9.00–16.21 (7.21s)  roughcut 8.93–16.14
// Clip 4: source 16.23–19.33 (3.10s) roughcut 16.14–19.24
// Clip 5: source 19.35–22.62 (3.27s) roughcut 19.24–22.51
// Clip 6: source 22.64–27.90 (5.26s) roughcut 22.51–27.77
// Clip 7: source 27.92–31.77 (3.85s) roughcut 27.77–31.62
// Clip 8: source 31.79–36.55 (4.76s) roughcut 31.62–36.38
// Clip 9: source 36.57–43.82 (7.25s) roughcut 36.38–43.63

const TOTAL_DURATION = 43.63;

// ─── Word arrays per clip ─────────────────────────────────────────────────────
// Timestamps are LOCAL to each clip (seconds from sequence start)
// = source_timestamp - source_in_point
// Words with no transcript timing (section numbers) are omitted

const WORDS_C1: Word[] = [
  { word: 'Seven',   start: 0.001, end: 0.201 },
  { word: 'things',  start: 0.221, end: 0.442 },
  { word: 'to',      start: 0.482, end: 0.602 },
  { word: 'never',   start: 0.642, end: 0.842 },
  { word: 'spend',   start: 0.902, end: 1.102 },
  { word: 'your',    start: 1.142, end: 1.282 },
  { word: 'money',   start: 1.323, end: 1.523 },
  { word: 'on',      start: 1.583, end: 1.663 },
  { word: 'in',      start: 1.723, end: 1.783 },
  { word: 'your',    start: 1.823, end: 1.963 },
  { word: '20s',     start: 2.384, end: 2.404 },
  { word: 'if',      start: 2.484, end: 2.544 },
  { word: 'you',     start: 2.564, end: 2.684 },
  { word: "don't",   start: 2.704, end: 2.844 },
  { word: 'want',    start: 2.864, end: 2.964 },
  { word: 'to',      start: 3.004, end: 3.065 },
  { word: 'go',      start: 3.085, end: 3.225 },
  { word: 'broke',   start: 3.245, end: 3.465 },
  { word: 'in',      start: 3.505, end: 3.565 },
  { word: 'your',    start: 3.585, end: 4.006 },
  { word: '30s',     start: 4.126, end: 4.266 },
];

const WORDS_C2: Word[] = [
  // source_in = 4.32, local = source - 4.32
  { word: 'Gambling,',     start: 0.036, end: 0.456 },
  { word: 'specifically',  start: 0.537, end: 1.077 },
  { word: 'sports',        start: 1.117, end: 1.478 },
  { word: 'betting.',      start: 1.538, end: 1.778 },
  { word: 'If',            start: 1.818, end: 1.878 },
  { word: "you're",        start: 1.898, end: 2.078 },
  { word: 'going',         start: 2.118, end: 2.279 },
  { word: 'to',            start: 2.319, end: 2.399 },
  { word: 'gamble,',       start: 2.439, end: 2.779 },
  { word: 'just',          start: 2.839, end: 2.999 },
  { word: 'day',           start: 3.039, end: 3.220 },
  { word: 'trade,',        start: 3.240, end: 3.480 },
  { word: 'at',            start: 3.560, end: 3.640 },
  { word: 'least',         start: 3.660, end: 3.840 },
  { word: "you'll",        start: 3.860, end: 4.061 },
  { word: 'learn',         start: 4.101, end: 4.281 },
  { word: 'something.',    start: 4.341, end: 4.661 },
];

const WORDS_C3: Word[] = [
  // source_in = 9.00, local = source - 9.00
  { word: 'Expensive',  start: 0.362, end: 0.822 },
  { word: 'pets.',      start: 0.882, end: 1.123 },
  { word: 'Dogs',       start: 1.283, end: 1.483 },
  { word: 'and',        start: 1.543, end: 1.623 },
  { word: 'cats',       start: 1.643, end: 1.864 },
  { word: 'are',        start: 2.024, end: 2.124 },
  { word: 'way',        start: 2.204, end: 2.404 },
  { word: 'more',       start: 2.444, end: 2.584 },
  { word: 'expensive',  start: 2.644, end: 3.065 },
  { word: 'than',       start: 3.105, end: 3.225 },
  { word: 'people',     start: 3.285, end: 3.525 },
  { word: 'think.',     start: 3.586, end: 3.766 },
  { word: 'They',       start: 3.866, end: 4.006 },
  { word: 'are',        start: 4.086, end: 4.206 },
  { word: 'literally',  start: 4.306, end: 4.667 },
  { word: 'like',       start: 4.707, end: 4.867 },
  { word: 'kids.',      start: 4.927, end: 5.147 },
  { word: 'If',         start: 5.247, end: 5.308 },
  { word: 'you',        start: 5.348, end: 5.488 },
  { word: "don't",      start: 5.528, end: 5.708 },
  { word: 'have',       start: 5.768, end: 5.908 },
  { word: 'the',        start: 5.928, end: 6.028 },
  { word: 'time',       start: 6.048, end: 6.229 },
  { word: 'or',         start: 6.309, end: 6.389 },
  { word: 'money,',     start: 6.429, end: 6.669 },
  { word: 'skip',       start: 6.849, end: 7.110 },
  { word: 'it.',        start: 7.150, end: 7.210 },
];

const WORDS_C4: Word[] = [
  // source_in = 16.23, local = source - 16.23
  { word: 'Eating',  start: 0.600, end: 0.781 },
  { word: 'out',     start: 0.881, end: 0.981 },
  { word: 'every',   start: 1.061, end: 1.221 },
  { word: 'day.',    start: 1.261, end: 1.401 },
  { word: 'It',      start: 1.421, end: 1.461 },
  { word: 'adds',    start: 1.602, end: 1.742 },
  { word: 'up',      start: 1.802, end: 1.902 },
  { word: 'faster',  start: 1.942, end: 2.262 },
  { word: 'than',    start: 2.282, end: 2.403 },
  { word: 'you',     start: 2.423, end: 2.523 },
  { word: 'think.',  start: 2.543, end: 3.103 },
];

const WORDS_C5: Word[] = [
  // source_in = 19.35, local = source - 19.35
  { word: 'Daily',   start: 0.144, end: 0.444 },
  { word: 'coffee',  start: 0.504, end: 0.844 },
  { word: 'runs.',   start: 0.885, end: 1.145 },
  { word: 'Make',    start: 1.285, end: 1.445 },
  { word: 'it',      start: 1.485, end: 1.545 },
  { word: 'at',      start: 1.585, end: 1.665 },
  { word: 'home',    start: 1.726, end: 1.926 },
  { word: 'for',     start: 1.986, end: 2.106 },
  { word: '25',      start: 2.150, end: 2.450 }, // estimated
  { word: 'cents.',  start: 2.667, end: 3.267 },
];

const WORDS_C6: Word[] = [
  // source_in = 22.64, local = source - 22.64
  { word: 'Brand',       start: 0.118, end: 0.378 },
  { word: 'new',         start: 0.398, end: 0.538 },
  { word: 'car.',        start: 0.578, end: 0.838 },
  { word: 'It',          start: 1.019, end: 1.119 },
  { word: 'loses',       start: 1.199, end: 1.479 },
  { word: 'half',        start: 1.539, end: 1.740 },
  { word: 'of',          start: 1.760, end: 1.820 },
  { word: 'its',         start: 1.900, end: 2.040 },
  { word: 'value',       start: 2.080, end: 2.380 },
  { word: 'in',          start: 2.440, end: 2.500 },
  { word: 'the',         start: 2.540, end: 2.621 },
  { word: 'first',       start: 2.681, end: 2.901 },
  { word: 'few',         start: 2.941, end: 3.101 },
  { word: 'years.',      start: 3.141, end: 3.402 },
  { word: 'Get',         start: 3.482, end: 3.642 },
  { word: 'a',           start: 3.722, end: 3.802 },
  { word: 'beater',      start: 3.862, end: 4.182 },
  { word: 'and',         start: 4.303, end: 4.383 },
  { word: 'invest',      start: 4.423, end: 4.743 },
  { word: 'in',          start: 4.763, end: 4.843 },
  { word: 'the',         start: 4.883, end: 4.943 },
  { word: 'difference.', start: 4.963, end: 5.260 },
];

const WORDS_C7: Word[] = [
  // source_in = 27.92, local = source - 27.92
  { word: 'Designer', start: 0.444, end: 0.865 },
  { word: 'clothes.', start: 1.005, end: 1.265 },
  { word: 'Gucci',    start: 1.305, end: 1.566 },
  { word: 'Louis',    start: 1.606, end: 1.766 },
  { word: 'Vuitton.', start: 1.786, end: 2.186 },
  { word: 'None',     start: 2.246, end: 2.407 },
  { word: 'of',       start: 2.447, end: 2.527 },
  { word: 'this',     start: 2.547, end: 2.727 },
  { word: 'is',       start: 2.807, end: 2.887 },
  { word: 'worth',    start: 2.987, end: 3.228 },
  { word: 'in',       start: 3.308, end: 3.368 },
  { word: 'your',     start: 3.408, end: 3.528 },
  { word: '20s.',     start: 3.688, end: 3.848 },
];

const WORDS_C8: Word[] = [
  // source_in = 31.79, local = source - 31.79
  { word: 'Speeding',  start: 0.159, end: 0.960 },
  { word: 'tickets.',  start: 1.020, end: 1.360 },
  { word: 'I',         start: 1.460, end: 1.560 },
  { word: 'paid',      start: 1.620, end: 1.901 },
  { word: 'almost',    start: 2.061, end: 2.341 },
  { word: '$400',      start: 2.510, end: 2.900 }, // estimated
  { word: 'for',       start: 3.042, end: 3.182 },
  { word: 'one.',      start: 3.322, end: 3.423 },
  { word: 'I',         start: 3.463, end: 3.543 },
  { word: 'drive',     start: 3.583, end: 3.843 },
  { word: 'like',      start: 3.883, end: 4.023 },
  { word: 'a',         start: 4.063, end: 4.083 },
  { word: 'grandma',   start: 4.143, end: 4.444 },
  { word: 'right',     start: 4.484, end: 4.624 },
  { word: 'now.',      start: 4.644, end: 4.764 },
];

const WORDS_C9: Word[] = [
  // source_in = 36.57, local = source - 36.57
  { word: 'I',          start: 0.064, end: 0.144 },
  { word: "don't",      start: 0.184, end: 0.365 },
  { word: 'hate',       start: 0.405, end: 0.625 },
  { word: 'spending',   start: 0.705, end: 1.045 },
  { word: 'money.',     start: 1.105, end: 1.306 },
  { word: 'I',          start: 1.386, end: 1.466 },
  { word: 'just',       start: 1.486, end: 1.646 },
  { word: 'hate',       start: 1.686, end: 1.866 },
  { word: 'spending',   start: 1.906, end: 2.247 },
  { word: 'money',      start: 2.287, end: 2.467 },
  { word: 'on',         start: 2.507, end: 2.587 },
  { word: 'things',     start: 2.627, end: 2.828 },
  { word: 'that',       start: 2.868, end: 3.028 },
  { word: "don't",      start: 3.088, end: 3.288 },
  { word: 'make',       start: 3.328, end: 3.468 },
  { word: 'sense.',     start: 3.508, end: 3.769 },
  { word: 'If',         start: 3.849, end: 3.889 },
  { word: 'you',        start: 3.929, end: 4.049 },
  { word: 'think',      start: 4.089, end: 4.249 },
  { word: 'I',          start: 4.329, end: 4.429 },
  { word: 'missed',     start: 4.470, end: 4.670 },
  { word: 'something,', start: 4.690, end: 5.010 },
  { word: 'drop',       start: 5.070, end: 5.250 },
  { word: 'it',         start: 5.270, end: 5.351 },
  { word: 'in',         start: 5.391, end: 5.431 },
  { word: 'the',        start: 5.431, end: 5.511 },
  { word: 'comments',   start: 5.531, end: 5.811 },
  { word: 'and',        start: 5.871, end: 5.951 },
  { word: 'follow',     start: 6.011, end: 6.292 },
  { word: 'for',        start: 6.312, end: 6.452 },
  { word: 'more',       start: 6.492, end: 6.652 },
  { word: 'money',      start: 6.712, end: 6.872 },
  { word: 'content.',   start: 6.932, end: 7.253 },
];

// ─── Composition ─────────────────────────────────────────────────────────────

export const SevenThingsV2: React.FC<{ videoSrc?: string }> = ({ videoSrc = SOURCE }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  // Roughcut boundaries
  const C1 = { start: f(0.00),  dur: f(4.27),  srcIn: f(0.03)  };
  const C2 = { start: f(4.27),  dur: f(4.66),  srcIn: f(4.32)  };
  const C3 = { start: f(8.93),  dur: f(7.21),  srcIn: f(9.00)  };
  const C4 = { start: f(16.14), dur: f(3.10),  srcIn: f(16.23) };
  const C5 = { start: f(19.24), dur: f(3.27),  srcIn: f(19.35) };
  const C6 = { start: f(22.51), dur: f(5.26),  srcIn: f(22.64) };
  const C7 = { start: f(27.77), dur: f(3.85),  srcIn: f(27.92) };
  const C8 = { start: f(31.62), dur: f(4.76),  srcIn: f(31.79) };
  const C9 = { start: f(36.38), dur: f(7.25),  srcIn: f(36.57) };

  return (
    <AbsoluteFill style={{ fontFamily, background: '#111111' }}>

      {/* ── CLIP 1: Hook — Mode 1 full face-cam ────────────────────────── */}
      <Sequence from={C1.start} durationInFrames={C1.dur}>
        <AbsoluteFill>
          <OffthreadVideo src={videoSrc} startFrom={C1.srcIn} />
          <Caption words={WORDS_C1} fps={fps} />
        </AbsoluteFill>
      </Sequence>

      {/* ── CLIP 2: Gambling — Mode 1 + section label ──────────────────── */}
      <Sequence from={C2.start} durationInFrames={C2.dur}>
        <AbsoluteFill>
          <OffthreadVideo src={videoSrc} startFrom={C2.srcIn} />
          <Caption words={WORDS_C2} fps={fps} />
          <Sequence from={0} durationInFrames={46}>
            <SectionLabel number={1} title="Gambling" />
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* ── CLIP 3: Expensive pets — Mode 1 + section label ────────────── */}
      <Sequence from={C3.start} durationInFrames={C3.dur}>
        <AbsoluteFill>
          <OffthreadVideo src={videoSrc} startFrom={C3.srcIn} />
          <Caption words={WORDS_C3} fps={fps} />
          <Sequence from={0} durationInFrames={46}>
            <SectionLabel number={2} title="Expensive pets" />
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* ── CLIP 4: Eating out — Mode 1 + section label ────────────────── */}
      <Sequence from={C4.start} durationInFrames={C4.dur}>
        <AbsoluteFill>
          <OffthreadVideo src={videoSrc} startFrom={C4.srcIn} />
          <Caption words={WORDS_C4} fps={fps} />
          <Sequence from={0} durationInFrames={46}>
            <SectionLabel number={3} title="Eating out" />
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* ── CLIP 5: Coffee runs — Mode 2 split screen ──────────────────── */}
      <Sequence from={C5.start} durationInFrames={C5.dur}>
        <SplitScreen videoSrc={videoSrc} videoStartFrom={C5.srcIn}>
          {/* Section label fades in first */}
          <Sequence from={0} durationInFrames={46}>
            <SectionLabel number={4} title="Coffee runs" onDark={false} />
          </Sequence>
          {/* Stat appears when "25 cents" is spoken (~2.15s local) */}
          <Sequence from={f(2.0)} durationInFrames={f(1.27)}>
            <StatAccent text="25¢" label="at home" />
          </Sequence>
        </SplitScreen>
        {/* Captions in bottom half */}
        <Caption words={WORDS_C5} fps={fps} bottomOffset="6%" fontSize={46} />
      </Sequence>

      {/* ── CLIP 6: Brand new car — Mode 2 split screen ────────────────── */}
      <Sequence from={C6.start} durationInFrames={C6.dur}>
        <SplitScreen videoSrc={videoSrc} videoStartFrom={C6.srcIn}>
          {/* Section label */}
          <Sequence from={0} durationInFrames={46}>
            <SectionLabel number={5} title="Brand new car" onDark={false} />
          </Sequence>
          {/* "50%" appears when "loses half" is spoken (~1.54s local) */}
          <Sequence from={f(1.4)} durationInFrames={f(2.0)}>
            <StatAccent text="50%" label="value lost in years 1–3" />
          </Sequence>
        </SplitScreen>
        <Caption words={WORDS_C6} fps={fps} bottomOffset="6%" fontSize={46} />
      </Sequence>

      {/* ── CLIP 7: Designer clothes — Mode 1 + section label ──────────── */}
      <Sequence from={C7.start} durationInFrames={C7.dur}>
        <AbsoluteFill>
          <OffthreadVideo src={videoSrc} startFrom={C7.srcIn} />
          <Caption words={WORDS_C7} fps={fps} />
          <Sequence from={0} durationInFrames={46}>
            <SectionLabel number={6} title="Designer clothes" />
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* ── CLIP 8: Speeding tickets — Mode 2 split screen ─────────────── */}
      <Sequence from={C8.start} durationInFrames={C8.dur}>
        <SplitScreen videoSrc={videoSrc} videoStartFrom={C8.srcIn}>
          {/* Section label */}
          <Sequence from={0} durationInFrames={46}>
            <SectionLabel number={7} title="Speeding tickets" onDark={false} />
          </Sequence>
          {/* "$400" appears when "almost $400" is spoken (~2.51s local) */}
          <Sequence from={f(2.4)} durationInFrames={f(1.8)}>
            <StatAccent text="$400" label="for one ticket" />
          </Sequence>
        </SplitScreen>
        <Caption words={WORDS_C8} fps={fps} bottomOffset="6%" fontSize={46} />
      </Sequence>

      {/* ── CLIP 9: Outro — Mode 1 full face-cam ───────────────────────── */}
      <Sequence from={C9.start} durationInFrames={C9.dur}>
        <AbsoluteFill>
          <OffthreadVideo src={videoSrc} startFrom={C9.srcIn} />
          <Caption words={WORDS_C9} fps={fps} />
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};
