import React from 'react';
import { Composition } from 'remotion';
import { LaunchVideo } from './LaunchVideo';
import './tailwind.built.css';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="LaunchVideo"
        component={LaunchVideo}
        durationInFrames={795}
        fps={30}
        width={1024}
        height={576}
      />
    </>
  );
};
