import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme, fontFamily } from '../theme';

interface SectionLabelProps {
  number: number;
  title: string;
  holdFrames?: number; // default 30
  onDark?: boolean;    // true = white on video (default), false = black on light bg
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  number,
  title,
  holdFrames = 30,
  onDark = true,
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
            color: onDark ? theme.white : theme.black,
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: -0.5,
            textShadow: onDark ? '0 2px 10px rgba(0,0,0,0.4)' : 'none',
          }}
        >
          {number}. {title}
        </span>
      </div>
    </AbsoluteFill>
  );
};
