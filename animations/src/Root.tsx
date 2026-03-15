import React from 'react';
import { Composition } from 'remotion';
import { SevenThingsV2 } from './compositions/SevenThingsV2';
import { BitcoinChart } from './compositions/BitcoinChart';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SevenThingsV2"
        component={SevenThingsV2}
        durationInFrames={Math.round(43.63 * 30)} // 1309 frames
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="BitcoinChart"
        component={BitcoinChart}
        durationInFrames={300} // 10 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
