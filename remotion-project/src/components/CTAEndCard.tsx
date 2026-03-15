import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

interface CTAEndCardProps {
  brandName?: string;
  ctaWord: string;
  supportingText?: string;
  background?: string;
}

export const CTAEndCard: React.FC<CTAEndCardProps> = ({
  brandName,
  ctaWord,
  supportingText,
  background = theme.white,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = spring({
    fps,
    frame,
    config: { damping: 18, stiffness: 200, mass: 0.9 },
    from: 300,
    to: 0,
  });

  const ctaScale = spring({
    fps,
    frame: Math.max(0, frame - 8),
    config: { damping: 12, stiffness: 250, mass: 0.5 },
    from: 0.5,
    to: 1,
  });

  return (
    <AbsoluteFill style={{
      background,
      transform: `translateY(${slideUp}px)`,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 20,
    }}>
      {brandName && (
        <div style={{
          color: theme.black,
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: 2,
          opacity: 0.55,
          textTransform: 'uppercase',
        }}>
          {brandName}
        </div>
      )}

      <div style={{
        color: theme.yellow,
        fontSize: 148,
        fontWeight: 900,
        lineHeight: 1,
        letterSpacing: -3,
        transform: `scale(${ctaScale})`,
        textTransform: 'uppercase',
      }}>
        {ctaWord}
      </div>

      {supportingText && (
        <div style={{
          color: theme.black,
          fontSize: 38,
          fontWeight: 500,
          textAlign: 'center',
          padding: '0 60px',
          opacity: 0.7,
        }}>
          {supportingText}
        </div>
      )}
    </AbsoluteFill>
  );
};
