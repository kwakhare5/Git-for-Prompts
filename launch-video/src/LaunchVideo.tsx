import React from 'react';
import { AbsoluteFill, Audio, Sequence, Series, staticFile } from 'remotion';
import { Scene1Pain } from './scenes/Scene1Pain';
import { Scene2Reveal } from './scenes/Scene2Reveal';
import { Scene3Terminal } from './scenes/Scene3Terminal';
import { Scene4Showcase } from './scenes/Scene4Showcase';
import { Scene5Outro } from './scenes/Scene5Outro';

export const LaunchVideo: React.FC = () => {
  return (
    <AbsoluteFill className="w-full h-full bg-[#0D0D10] text-[#FAFAFA] relative overflow-hidden font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. MASTER AUDIO LAYER: BGM + TACTILE SOUND DESIGN (30 FPS EXACT FRAMES)   */}
      {/* ========================================================================= */}
      
      {/* Master Background Music (Volume 0.55) */}
      <Audio src={staticFile('bgm.mp3')} volume={0.55} />

      {/* SFX 1: Scene 1 Hero Prompt Typing (Frames 2 - 52) */}
      <Sequence from={2} durationInFrames={50}>
        <Audio src={staticFile('sfx/mixkit-keyboard-typing-1386.wav')} volume={0.35} />
      </Sequence>

      {/* SFX 2: Scene 1 Slot Machine Final Lock on "history." (Frame 148) */}
      <Sequence from={148} durationInFrames={30}>
        <Audio src={staticFile('sfx/click_soft.mp3')} volume={0.30} />
      </Sequence>

      {/* SFX 3: Scene 2 Hero Logo Tile Pop (Frame 160) */}
      <Sequence from={160} durationInFrames={30}>
        <Audio src={staticFile('sfx/notification_pop.mp3')} volume={0.38} />
      </Sequence>

      {/* SFX 4: Scene 3 Terminal CLI Typing 1 (Frames 289 - 305) & Enter Keystroke (Frame 305) */}
      <Sequence from={289} durationInFrames={16}>
        <Audio src={staticFile('sfx/mixkit-keyboard-typing-1386.wav')} volume={0.30} />
      </Sequence>
      <Sequence from={305} durationInFrames={25}>
        <Audio src={staticFile('sfx/keyboard_enter_holypanda.mp3')} volume={0.38} />
      </Sequence>

      {/* SFX 5: Scene 3 Terminal CLI Typing 2 (Frames 323 - 343) & Enter Keystroke (Frame 343) */}
      <Sequence from={323} durationInFrames={20}>
        <Audio src={staticFile('sfx/mixkit-keyboard-typing-1386.wav')} volume={0.30} />
      </Sequence>
      <Sequence from={343} durationInFrames={25}>
        <Audio src={staticFile('sfx/keyboard_enter_holypanda.mp3')} volume={0.38} />
      </Sequence>

      {/* SFX 6: Scene 3 Terminal CLI Typing 3 (Frames 367 - 395) & Enter Keystroke (Frame 395) */}
      <Sequence from={367} durationInFrames={28}>
        <Audio src={staticFile('sfx/mixkit-keyboard-typing-1386.wav')} volume={0.30} />
      </Sequence>
      <Sequence from={395} durationInFrames={25}>
        <Audio src={staticFile('sfx/keyboard_enter_holypanda.mp3')} volume={0.38} />
      </Sequence>

      {/* SFX 7: Scene 3 Terminal Verified Publish Chime (Frame 420) */}
      <Sequence from={420} durationInFrames={35}>
        <Audio src={staticFile('sfx/chime_success.mp3')} volume={0.35} />
      </Sequence>

      {/* SFX 8: Scene 4 Groq Speed Surge Whoosh (Frame 525) */}
      <Sequence from={525} durationInFrames={30}>
        <Audio src={staticFile('sfx/mixkit-arrow-whoosh-1491.wav')} volume={0.30} />
      </Sequence>

      {/* SFX 9: Scene 5 CTA Mouse Click & Celebration Chime (Frame 715) */}
      <Sequence from={715} durationInFrames={30}>
        <Audio src={staticFile('sfx/mixkit-mouse-click-close-1113.wav')} volume={0.45} />
      </Sequence>
      <Sequence from={715} durationInFrames={50}>
        <Audio src={staticFile('sfx/chime_success.mp3')} volume={0.35} />
      </Sequence>

      {/* ========================================================================= */}
      {/* 2. VISUAL CANVAS & AMBIENT SCRIM (IDENTICAL TO HTML STUDIO PLAYER)        */}
      {/* ========================================================================= */}
      <AbsoluteFill className="z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(24,24,28,0.6)_0%,rgba(13,13,16,1)_100%)] pointer-events-none" />

      {/* Clean 5-Scene Sequential Series (795 Frames / ~26.5s) */}
      <AbsoluteFill className="z-10 w-full h-full">
        <Series>
          {/* Scene 1: The Developer Pain (0f - 160f / 5.33s) */}
          <Series.Sequence durationInFrames={160}>
            <Scene1Pain />
          </Series.Sequence>

          {/* Scene 2: The Hero Reveal (160f - 285f / 4.17s) */}
          <Series.Sequence durationInFrames={125}>
            <Scene2Reveal />
          </Series.Sequence>

          {/* Scene 3: Terminal CLI Workflow (285f - 435f / 5.00s) */}
          <Series.Sequence durationInFrames={150}>
            <Scene3Terminal />
          </Series.Sequence>

          {/* Scene 4: Deep Tech Showcase (435f - 675f / 8.00s) */}
          <Series.Sequence durationInFrames={240}>
            <Scene4Showcase />
          </Series.Sequence>

          {/* Scene 5: Outro & Call to Action (675f - 795f / 4.00s) */}
          <Series.Sequence durationInFrames={120}>
            <Scene5Outro />
          </Series.Sequence>
        </Series>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
