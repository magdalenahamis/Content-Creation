import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

interface NumberCounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  durationFrames?: number;
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
