import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence } from 'remotion';
import { KineticCaption } from '../components/KineticCaption';
import { SectionTitle } from '../components/SectionTitle';
import { FlashTransition } from '../components/FlashTransition';
import { TextCallout } from '../components/TextCallout';
import { NumberCounter } from '../components/NumberCounter';
import { CTAEndCard } from '../components/CTAEndCard';

// All words with timestamps from WhisperX transcript.
// Words without timestamps ("1.", "2.", "25", "200", etc.) have been given
// estimated start/end times based on surrounding word gaps.
const WORDS = [
  // Clip 1: Hook (0–4.30s)
  { word: 'Seven',      start: 0.031, end: 0.251 },
  { word: 'things',     start: 0.251, end: 0.512 },
  { word: 'to',         start: 0.512, end: 0.672 },
  { word: 'never',      start: 0.672, end: 0.932 },
  { word: 'spend',      start: 0.932, end: 1.172 },
  { word: 'your',       start: 1.172, end: 1.353 },
  { word: 'money',      start: 1.353, end: 1.613 },
  { word: 'on',         start: 1.613, end: 1.753 },
  { word: 'in',         start: 1.753, end: 1.853 },
  { word: 'your',       start: 1.853, end: 2.414 },
  { word: '20s',        start: 2.414, end: 2.514 },
  { word: 'if',         start: 2.514, end: 2.594 },
  { word: 'you',        start: 2.594, end: 2.734 },
  { word: "don't",      start: 2.734, end: 2.894 },
  { word: 'want',       start: 2.894, end: 3.034 },
  { word: 'to',         start: 3.034, end: 3.115 },
  { word: 'go',         start: 3.115, end: 3.275 },
  { word: 'broke',      start: 3.275, end: 3.535 },
  { word: 'in',         start: 3.535, end: 3.615 },
  { word: 'your',       start: 3.615, end: 4.156 },
  { word: '30s',        start: 4.156, end: 4.356 },

  // Clip 2: Gambling (4.32–8.98s)
  { word: 'Gambling',   start: 4.356, end: 4.857 },
  { word: 'specifically', start: 4.857, end: 5.437 },
  { word: 'sports',     start: 5.437, end: 5.858 },
  { word: 'betting',    start: 5.858, end: 6.138 },
  { word: 'If',         start: 6.138, end: 6.218 },
  { word: "you're",     start: 6.218, end: 6.438 },
  { word: 'going',      start: 6.438, end: 6.639 },
  { word: 'to',         start: 6.639, end: 6.759 },
  { word: 'gamble',     start: 6.759, end: 7.159 },
  { word: 'just',       start: 7.159, end: 7.359 },
  { word: 'day',        start: 7.359, end: 7.560 },
  { word: 'trade',      start: 7.560, end: 7.880 },
  { word: 'at',         start: 7.880, end: 7.980 },
  { word: 'least',      start: 7.980, end: 8.180 },
  { word: "you'll",     start: 8.180, end: 8.421 },
  { word: 'learn',      start: 8.421, end: 8.661 },
  { word: 'something',  start: 8.661, end: 9.000 },

  // Clip 3: Expensive pets (9.00–16.21s)
  { word: 'Expensive',  start: 9.362,  end: 9.882  },
  { word: 'pets',       start: 9.882,  end: 10.283 },
  { word: 'Dogs',       start: 10.283, end: 10.543 },
  { word: 'and',        start: 10.543, end: 10.643 },
  { word: 'cats',       start: 10.643, end: 11.024 },
  { word: 'are',        start: 11.024, end: 11.204 },
  { word: 'way',        start: 11.204, end: 11.444 },
  { word: 'more',       start: 11.444, end: 11.644 },
  { word: 'expensive',  start: 11.644, end: 12.105 },
  { word: 'than',       start: 12.105, end: 12.285 },
  { word: 'people',     start: 12.285, end: 12.586 },
  { word: 'think',      start: 12.586, end: 12.866 },
  { word: 'They',       start: 12.866, end: 13.086 },
  { word: 'are',        start: 13.086, end: 13.306 },
  { word: 'literally',  start: 13.306, end: 13.707 },
  { word: 'like',       start: 13.707, end: 13.927 },
  { word: 'kids',       start: 13.927, end: 14.247 },
  { word: 'If',         start: 14.247, end: 14.348 },
  { word: 'you',        start: 14.348, end: 14.528 },
  { word: "don't",      start: 14.528, end: 14.768 },
  { word: 'have',       start: 14.768, end: 14.928 },
  { word: 'the',        start: 14.928, end: 15.048 },
  { word: 'time',       start: 15.048, end: 15.309 },
  { word: 'or',         start: 15.309, end: 15.429 },
  { word: 'money',      start: 15.429, end: 15.849 },
  { word: 'skip',       start: 15.849, end: 16.150 },
  { word: 'it',         start: 16.150, end: 16.230 },

  // Clip 4: Eating out (16.23–19.33s)
  { word: 'Eating',     start: 16.830, end: 17.111 },
  { word: 'out',        start: 17.111, end: 17.291 },
  { word: 'every',      start: 17.291, end: 17.491 },
  { word: 'day',        start: 17.491, end: 17.651 },
  { word: 'It',         start: 17.651, end: 17.832 },
  { word: 'adds',       start: 17.832, end: 18.032 },
  { word: 'up',         start: 18.032, end: 18.172 },
  { word: 'faster',     start: 18.172, end: 18.512 },
  { word: 'than',       start: 18.512, end: 18.653 },
  { word: 'you',        start: 18.653, end: 18.773 },
  { word: 'think',      start: 18.773, end: 19.350 },

  // Clip 5: Coffee runs (19.35–22.62s)
  { word: 'Daily',      start: 19.494, end: 19.854 },
  { word: 'coffee',     start: 19.854, end: 20.235 },
  { word: 'runs',       start: 20.235, end: 20.635 },
  { word: 'Make',       start: 20.635, end: 20.835 },
  { word: 'it',         start: 20.835, end: 20.935 },
  { word: 'at',         start: 20.935, end: 21.076 },
  { word: 'home',       start: 21.076, end: 21.336 },
  { word: 'for',        start: 21.336, end: 21.500 },
  { word: '25',         start: 21.500, end: 22.017 }, // estimated
  { word: 'cents',      start: 22.017, end: 22.640 },

  // Clip 6: Brand new car (22.64–27.90s)
  { word: 'Brand',      start: 22.758, end: 23.038 },
  { word: 'new',        start: 23.038, end: 23.218 },
  { word: 'car',        start: 23.218, end: 23.659 },
  { word: 'It',         start: 23.659, end: 23.839 },
  { word: 'loses',      start: 23.839, end: 24.179 },
  { word: 'half',       start: 24.179, end: 24.400 },
  { word: 'of',         start: 24.400, end: 24.540 },
  { word: 'its',        start: 24.540, end: 24.720 },
  { word: 'value',      start: 24.720, end: 25.080 },
  { word: 'in',         start: 25.080, end: 25.180 },
  { word: 'the',        start: 25.180, end: 25.321 },
  { word: 'first',      start: 25.321, end: 25.581 },
  { word: 'few',        start: 25.581, end: 25.781 },
  { word: 'years',      start: 25.781, end: 26.122 },
  { word: 'Get',        start: 26.122, end: 26.362 },
  { word: 'a',          start: 26.362, end: 26.502 },
  { word: 'beater',     start: 26.502, end: 26.943 },
  { word: 'and',        start: 26.943, end: 27.063 },
  { word: 'invest',     start: 27.063, end: 27.403 },
  { word: 'in',         start: 27.403, end: 27.523 },
  { word: 'the',        start: 27.523, end: 27.603 },
  { word: 'difference', start: 27.603, end: 27.920 },

  // Clip 7: Designer clothes (27.92–31.77s)
  { word: 'Designer',   start: 28.364, end: 28.825 },
  { word: 'and',        start: 28.825, end: 28.925 },
  { word: 'clothes',    start: 28.925, end: 29.225 },
  { word: 'Gucci',      start: 29.225, end: 29.526 },
  { word: 'Louis',      start: 29.526, end: 29.706 },
  { word: 'Vuitton',    start: 29.706, end: 30.166 },
  { word: 'None',       start: 30.166, end: 30.367 },
  { word: 'of',         start: 30.367, end: 30.467 },
  { word: 'this',       start: 30.467, end: 30.727 },
  { word: 'is',         start: 30.727, end: 30.907 },
  { word: 'worth',      start: 30.907, end: 31.228 },
  { word: 'in',         start: 31.228, end: 31.328 },
  { word: 'your',       start: 31.328, end: 31.608 },
  { word: '20s',        start: 31.608, end: 31.790 },

  // Clip 8: Speeding tickets (31.79–36.55s)
  { word: 'Speeding',   start: 31.949, end: 32.810 },
  { word: 'tickets',    start: 32.810, end: 33.250 },
  { word: 'I',          start: 33.250, end: 33.410 },
  { word: 'paid',       start: 33.410, end: 33.851 },
  { word: 'almost',     start: 33.851, end: 34.300 },
  { word: '$200',       start: 34.300, end: 34.832 }, // estimated
  { word: 'for',        start: 34.832, end: 35.112 },
  { word: 'one',        start: 35.112, end: 35.253 },
  { word: 'I',          start: 35.253, end: 35.373 },
  { word: 'drive',      start: 35.373, end: 35.673 },
  { word: 'like',       start: 35.673, end: 35.853 },
  { word: 'a',          start: 35.853, end: 35.933 },
  { word: 'grandma',    start: 35.933, end: 36.274 },
  { word: 'right',      start: 36.274, end: 36.434 },
  { word: 'now',        start: 36.434, end: 36.570 },

  // Clip 9: Outro (36.57–43.82s)
  { word: 'I',          start: 36.634, end: 36.754 },
  { word: "don't",      start: 36.754, end: 36.975 },
  { word: 'hate',       start: 36.975, end: 37.275 },
  { word: 'spending',   start: 37.275, end: 37.675 },
  { word: 'money',      start: 37.675, end: 37.956 },
  { word: 'I',          start: 37.956, end: 38.056 },
  { word: 'just',       start: 38.056, end: 38.256 },
  { word: 'hate',       start: 38.256, end: 38.476 },
  { word: 'spending',   start: 38.476, end: 38.857 },
  { word: 'money',      start: 38.857, end: 39.077 },
  { word: 'on',         start: 39.077, end: 39.197 },
  { word: 'things',     start: 39.197, end: 39.438 },
  { word: 'that',       start: 39.438, end: 39.658 },
  { word: "don't",      start: 39.658, end: 39.898 },
  { word: 'make',       start: 39.898, end: 40.078 },
  { word: 'sense',      start: 40.078, end: 40.419 },
  { word: 'If',         start: 40.419, end: 40.499 },
  { word: 'you',        start: 40.499, end: 40.659 },
  { word: 'think',      start: 40.659, end: 40.899 },
  { word: 'I',          start: 40.899, end: 41.040 },
  { word: 'missed',     start: 41.040, end: 41.260 },
  { word: 'something',  start: 41.260, end: 41.640 },
  { word: 'drop',       start: 41.640, end: 41.840 },
  { word: 'it',         start: 41.840, end: 41.961 },
  { word: 'in',         start: 41.961, end: 42.021 },
  { word: 'the',        start: 42.021, end: 42.101 },
  { word: 'comments',   start: 42.101, end: 42.441 },
  { word: 'and',        start: 42.441, end: 42.581 },
  { word: 'follow',     start: 42.581, end: 42.882 },
  { word: 'for',        start: 42.882, end: 43.062 },
  { word: 'more',       start: 43.062, end: 43.282 },
  { word: 'money',      start: 43.282, end: 43.502 },
  { word: 'content',    start: 43.502, end: 43.823 },
];

// Words to show in yellow instead of white
const YELLOW_STARTS = new Set([
  3.275,  // broke
  21.500, // 25 (cents)
  24.179, // half
  34.300, // $200
  42.581, // follow
]);

const VIDEO_DURATION = 43.63;
const FPS = 30;

export const SevenThings: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const f = (s: number) => Math.round(s * FPS);
  const totalFrames = Math.round(VIDEO_DURATION * FPS);

  return (
    <AbsoluteFill>
      {/* ── BASE VIDEO ────────────────────────────────────────── */}
      <OffthreadVideo src={videoSrc} />

      {/* ── KINETIC CAPTIONS (full video) ─────────────────────── */}
      <Sequence from={0} durationInFrames={totalFrames}>
        <KineticCaption words={WORDS} yellowStarts={YELLOW_STARTS} />
      </Sequence>

      {/* ── SECTION TITLES ────────────────────────────────────── */}
      <Sequence from={f(4.32)}  durationInFrames={42}><SectionTitle number={1} title="Gambling"         /></Sequence>
      <Sequence from={f(9.00)}  durationInFrames={42}><SectionTitle number={2} title="Expensive Pets"   /></Sequence>
      <Sequence from={f(16.23)} durationInFrames={42}><SectionTitle number={3} title="Eating Out"       /></Sequence>
      <Sequence from={f(19.35)} durationInFrames={42}><SectionTitle number={4} title="Coffee Runs"      /></Sequence>
      <Sequence from={f(22.64)} durationInFrames={42}><SectionTitle number={5} title="Brand New Car"    /></Sequence>
      <Sequence from={f(27.92)} durationInFrames={42}><SectionTitle number={6} title="Designer Clothes" /></Sequence>
      <Sequence from={f(31.79)} durationInFrames={42}><SectionTitle number={7} title="Speeding Tickets" /></Sequence>

      {/* ── FLASH TRANSITIONS (at each clip boundary) ─────────── */}
      <Sequence from={f(4.27)  - 3} durationInFrames={6}><FlashTransition /></Sequence>
      <Sequence from={f(8.97)  - 3} durationInFrames={6}><FlashTransition /></Sequence>
      <Sequence from={f(16.20) - 3} durationInFrames={6}><FlashTransition /></Sequence>
      <Sequence from={f(19.32) - 3} durationInFrames={6}><FlashTransition /></Sequence>
      <Sequence from={f(22.61) - 3} durationInFrames={6}><FlashTransition /></Sequence>
      <Sequence from={f(27.89) - 3} durationInFrames={6}><FlashTransition /></Sequence>
      <Sequence from={f(31.76) - 3} durationInFrames={6}><FlashTransition /></Sequence>
      <Sequence from={f(36.54) - 3} durationInFrames={6}><FlashTransition /></Sequence>

      {/* ── STAT CALLOUTS ─────────────────────────────────────── */}

      {/* "25¢ at home" — coffee tip (21.5s, when "25" is spoken) */}
      <Sequence from={f(21.5)} durationInFrames={50}>
        <NumberCounter to={25} suffix="¢" label="at home" />
      </Sequence>

      {/* "50% value loss" — car depreciation (24.18s, when "half" is spoken) */}
      <Sequence from={f(24.18)} durationInFrames={48}>
        <TextCallout text="50%" label="value loss" position="bottom" />
      </Sequence>

      {/* "$200 speeding ticket" (34.13s, after "almost") */}
      <Sequence from={f(34.13)} durationInFrames={55}>
        <NumberCounter to={200} prefix="$" label="speeding ticket" />
      </Sequence>

      {/* ── CTA END CARD (last ~2s, when she says "follow") ───── */}
      <Sequence from={f(41.5)} durationInFrames={totalFrames - f(41.5)}>
        <CTAEndCard
          brandName="@moneywithmagdalena"
          ctaWord="FOLLOW"
          supportingText="for more money tips"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
