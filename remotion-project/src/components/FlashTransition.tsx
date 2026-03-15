import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface FlashTransitionProps {
  durationFrames?: number;
}

export const FlashTransition: React.FC<FlashTransitionProps> = ({
  durationFrames = 6,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, durationFrames / 2, durationFrames],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{
      background: '#FFFFFF',
      opacity,
      pointerEvents: 'none',
    }} />
  );
};
