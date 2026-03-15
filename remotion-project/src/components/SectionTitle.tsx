import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

interface SectionTitleProps {
  number: number;
  title: string;
  holdFrames?: number;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  number,
  title,
  holdFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    fps,
    frame,
    config: { damping: 18, stiffness: 200, mass: 0.7 },
    from: 120,
    to: 0,
  });

  const slideOut = interpolate(frame, [holdFrames, holdFrames + 12], [0, 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = frame < holdFrames ? slideIn : slideOut;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute',
        bottom: 200,
        left: 0,
        right: 0,
        transform: `translateY(${translateY}px)`,
        padding: '0 48px',
      }}>
        <div style={{
          background: theme.yellow,
          borderRadius: 14,
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}>
          <div style={{
            color: theme.black,
            fontSize: 52,
            fontWeight: 900,
            lineHeight: 1,
            minWidth: 44,
          }}>
            {number}.
          </div>
          <div style={{
            color: theme.black,
            fontSize: 40,
            fontWeight: 800,
            lineHeight: 1.2,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
            {title}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
