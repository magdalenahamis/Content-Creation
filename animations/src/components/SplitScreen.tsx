import React from 'react';
import { AbsoluteFill, OffthreadVideo } from 'remotion';
import { theme } from '../theme';

interface SplitScreenProps {
  videoSrc: string;
  videoStartFrom?: number; // frames into source video
  children?: React.ReactNode; // content for top half
}

export const SplitScreen: React.FC<SplitScreenProps> = ({
  videoSrc,
  videoStartFrom = 0,
  children,
}) => {
  return (
    <AbsoluteFill style={{ background: theme.lightGray }}>
      {/* Top half — animation / graphic */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>

      {/* Bottom half — face-cam */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          overflow: 'hidden',
        }}
      >
        <OffthreadVideo
          src={videoSrc}
          startFrom={videoStartFrom}
          style={{
            width: '100%',
            height: '200%',
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
