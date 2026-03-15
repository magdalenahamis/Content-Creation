import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { theme, fontFamily } from '../theme';

interface StatAccentProps {
  text: string;       // e.g. "$400" or "25¢" or "50%"
  label?: string;     // optional smaller text below
  onDark?: boolean;   // true = white, false = black on light bg (default)
}

export const StatAccent: React.FC<StatAccentProps> = ({
  text,
  label,
  onDark = false,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 8, 40, 48],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const color = onDark ? theme.white : theme.black;

  return (
    <div style={{ opacity, textAlign: 'center', fontFamily }}>
      <div
        style={{
          color,
          fontSize: 100,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1,
        }}
      >
        {text}
      </div>
      {label && (
        <div
          style={{
            color,
            fontSize: 38,
            fontWeight: 500,
            opacity: 0.6,
            marginTop: 10,
            letterSpacing: 0,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
