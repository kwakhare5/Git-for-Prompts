import React from 'react';
import { useCurrentFrame } from 'remotion';

const FULL_TEXT = "Your prompts are scattered in text files";

const KEYFRAMES = [
  { f: 0.0, o: 51 },   // "Your"
  { f: 0.18, o: 212 }, // "prompts"
  { f: 0.35, o: 358 }, // "are"
  { f: 0.55, o: 532 }, // "scattered"
  { f: 0.72, o: 692 }, // "in"
  { f: 0.82, o: 774 }, // "text"
  { f: 1.0, o: 880 },  // "files"
];

export const Scene1Pain: React.FC = () => {
  const frame = useCurrentFrame();

  // Sub-beat 1: Linear Smooth Typing (0f - 66f, typing across 42 frames, followed by a 22-frame reading pause)
  if (frame < 66) {
    const progress = Math.min(1, Math.max(0, (frame - 2) / 42));
    const typedChars = Math.min(FULL_TEXT.length, Math.floor(progress * FULL_TEXT.length));
    const currentTyped = FULL_TEXT.slice(0, typedChars);
    const isTyping = frame >= 2 && typedChars < FULL_TEXT.length;

    let continuousOffset = KEYFRAMES[0].o;
    for (let i = 0; i < KEYFRAMES.length - 1; i++) {
      const k1 = KEYFRAMES[i];
      const k2 = KEYFRAMES[i + 1];
      if (progress >= k1.f && progress <= k2.f) {
        const segP = (progress - k1.f) / (k2.f - k1.f);
        continuousOffset = k1.o + segP * (k2.o - k1.o);
        break;
      }
    }
    if (progress >= 1.0) continuousOffset = KEYFRAMES[KEYFRAMES.length - 1].o;

    // 2-frame micro-dissolve blur at exit
    const exitBlur = frame >= 64 ? (frame - 63) * 1.5 : 0;
    const exitOpacity = frame >= 64 ? Math.max(0, 1 - (frame - 63) * 0.4) : 1;

    return (
      <div className="w-full h-full font-sans overflow-hidden bg-transparent relative select-none flex items-center justify-center">
        <div 
          className="absolute top-1/2 flex items-center whitespace-nowrap will-change-transform"
          style={{
            left: '62%',
            transform: `translate3d(-${continuousOffset}px, -50%, 0)`,
            filter: exitBlur > 0 ? `blur(${exitBlur}px)` : 'none',
            opacity: exitOpacity,
          }}
        >
          <span className="text-5xl font-extrabold text-[#FAFAFA] tracking-tight">
            {currentTyped}
          </span>
          <span 
            className="inline-block w-1.5 h-10 ml-2" 
            style={{ 
              backgroundColor: '#10B981',
              opacity: isTyping ? 1 : Math.floor(frame / 12) % 2 === 0 ? 1 : 0 
            }} 
          />
        </div>
      </div>
    );
  }

  // Sub-beat 2: Stationary "No" + 3D Slot Reel (66f - 160f)
  const words = ["diffs.", "evals.", "tests.", "history."];
  const ats = [88, 110, 134];
  const itemHeight = 64;

  let continuousOffset = 0;
  for (let i = 0; i < ats.length; i++) {
    if (frame >= ats[i]) {
      const p = Math.min(1, (frame - ats[i]) / 14);
      // Snappy mechanical deceleration curve with crisp settle
      const eased = 1 - Math.pow(1 - p, 3.5);
      continuousOffset += eased;
    }
  }

  const localSub2 = frame - 66;
  const enterBlur = localSub2 <= 3 ? (3 - localSub2) * 1.0 : 0;
  const enterOpacity = localSub2 <= 3 ? (localSub2 + 1) * 0.33 : 1;
  const sub2Zoom = 1.0 + (localSub2 / 94) * 0.04;
  const exitDissolve = frame >= 150 ? Math.max(0, 1 - (frame - 150) / 10) : 1;

  return (
    <div 
      className="w-full h-full font-sans overflow-hidden bg-transparent relative select-none flex items-center justify-center"
      style={{
        transform: `scale(${sub2Zoom})`,
        opacity: exitDissolve * enterOpacity,
        filter: enterBlur > 0 ? `blur(${enterBlur}px)` : 'none',
      }}
    >
      <div className="flex items-center justify-center text-6xl font-extrabold tracking-tight">
        <span className="text-white mr-4 shrink-0 font-extrabold">No</span>
        <span 
          className="inline-block relative overflow-hidden align-middle text-emerald-400 font-extrabold" 
          style={{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px`, verticalAlign: 'middle' }}
        >
          <span className="invisible opacity-0 px-1">history.</span>
          <span 
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              display: 'flex',
              flexDirection: 'column',
              transform: `translateY(-${continuousOffset * itemHeight}px)`
            }}
          >
            {words.map((w, idx) => {
              const dist = continuousOffset - idx;
              const tilt = Math.max(-45, Math.min(45, dist * 35));
              const op = Math.max(0.2, 1 - Math.abs(dist) * 0.7);
              return (
                <span 
                  key={w}
                  style={{
                    height: `${itemHeight}px`,
                    lineHeight: `${itemHeight}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    opacity: op,
                    transform: `perspective(400px) rotateX(${tilt}deg)`
                  }}
                >
                  {w}
                </span>
              );
            })}
          </span>
        </span>
      </div>
    </div>
  );
};
