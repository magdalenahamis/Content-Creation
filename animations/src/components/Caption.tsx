import React from 'react';
import { useCurrentFrame } from 'remotion';
import { theme, fontFamily } from '../theme';

export interface Word {
  word: string;
  start: number; // seconds, relative to this clip's sequence start
  end: number;
}

interface CaptionProps {
  words: Word[];
  fps: number;
  onDark?: boolean;      // true = white on video (default), false = black on light bg
  bottomOffset?: string; // CSS, default '18%'
  fontSize?: number;     // default 54
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

  const visibleWords = words.filter(
    (w) => w.end > currentTime - 0.1 && w.start < currentTime + 3.0
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
              textShadow: onDark ? '0 2px 8px rgba(0,0,0,0.6)' : 'none',
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};
