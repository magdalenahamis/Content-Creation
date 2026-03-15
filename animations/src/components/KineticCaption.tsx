import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

interface Word {
  word: string;
  start: number;
  end: number;
}

interface KineticCaptionProps {
  words: Word[];
  yellowStarts?: Set<number>; // start timestamps of words to show in yellow
}

export const KineticCaption: React.FC<KineticCaptionProps> = ({ words, yellowStarts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentSeconds = frame / fps;

  // Find the last word whose start time has been reached
  let activeWord: Word | null = null;
  for (let i = words.length - 1; i >= 0; i--) {
    if (currentSeconds >= words[i].start) {
      activeWord = words[i];
      break;
    }
  }

  // Don't show if no word active, or past its end time
  if (!activeWord || currentSeconds >= activeWord.end) return null;

  const isYellow = yellowStarts?.has(activeWord.start) ?? false;
  const color = isYellow ? theme.yellow : theme.white;

  const wordStartFrame = Math.round(activeWord.start * fps);
  const localFrame = frame - wordStartFrame;

  // Punchy pop-in: scale springs from 0.6 → 1.08 → 1.0
  const scale = interpolate(localFrame, [0, 4, 8], [0.6, 1.08, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(localFrame, [0, 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 48px',
      }}>
        <span style={{
          color,
          fontSize: 66,
          fontWeight: 900,
          letterSpacing: -1,
          textAlign: 'center',
          textShadow: '0 2px 14px rgba(0,0,0,0.65)',
          transform: `scale(${scale})`,
          opacity,
          display: 'inline-block',
          textTransform: 'uppercase',
        }}>
          {activeWord.word}
        </span>
      </div>
    </AbsoluteFill>
  );
};
