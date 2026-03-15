import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme, fontFamily } from '../theme';

interface TextCardProps {
  lines: string[];
  holdFrames?: number; // default 40
  fontSize?: number;   // default 88
  align?: 'left' | 'center';
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
