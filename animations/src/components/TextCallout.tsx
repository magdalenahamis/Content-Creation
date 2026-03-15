import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

interface TextCalloutProps {
  text: string;
  label?: string;
  holdFrames?: number;
  position?: 'top' | 'bottom';
}

export const TextCallout: React.FC<TextCalloutProps> = ({
  text,
  label,
  holdFrames = 45,
  position = 'bottom',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = holdFrames + 10;

  const translateY = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 180, mass: 0.6 },
    from: 60,
    to: 0,
  });

  const opacity = interpolate(frame, [holdFrames, totalFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const verticalPos = position === 'bottom' ? { bottom: 240 } : { top: 200 };

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
          fontSize: 80,
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
