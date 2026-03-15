import React from 'react';
import { Composition, staticFile } from 'remotion';
import { SevenThings } from './compositions/SevenThings';

const VIDEO_SRC = staticFile('roughcut.mp4');

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SevenThings"
        component={SevenThings}
        durationInFrames={Math.round(43.63 * 30)} // 1309 frames
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoSrc: VIDEO_SRC }}
      />
    </>
  );
};
