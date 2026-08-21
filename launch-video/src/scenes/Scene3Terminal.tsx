import React from 'react';
import { useCurrentFrame } from 'remotion';

export const Scene3Terminal: React.FC = () => {
  const local = useCurrentFrame();

  const cmd1 = "npx gfp init";
  const cmd1TypedChars = Math.min(cmd1.length, Math.floor(Math.max(0, local - 4) / 1.4));
  const showCmd1Cursor = local >= 4 && local < 20;
  const cmd1Running = local >= 20 && local < 32;
  const cmd1Done = local >= 32;

  const cmd2 = "gfp run main";
  const showCmd2Line = local >= 38;
  const cmd2TypedChars = Math.min(cmd2.length, Math.floor(Math.max(0, local - 38) / 1.4));
  const showCmd2Cursor = local >= 38 && local < 58;
  const cmd2Running = local >= 58 && local < 76;
  const cmd2Done = local >= 76;

  const cmd3 = "gfp push main.prompt";
  const showCmd3Line = local >= 82;
  const cmd3TypedChars = Math.min(cmd3.length, Math.floor(Math.max(0, local - 82) / 1.4));
  const showCmd3Cursor = local >= 82 && local < 110;
  const cmd3Running = local >= 110 && local < 135;
  const cmd3Done = local >= 135;

  const spinnerChars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const spinIndex = Math.floor(local / 3) % spinnerChars.length;
  const currentSpinner = spinnerChars[spinIndex];

  return (
    <div className="w-full h-full flex items-center justify-center font-sans bg-transparent select-none px-20">
      <div className="w-full max-w-[820px] bg-[#121214] border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs text-left my-auto">
        <div className="bg-[#18181B] px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between text-zinc-400">
          <div className="flex items-center gap-2.5 w-24">
            <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56]/80" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E]/80" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F]/80" />
          </div>
          <div className="text-xs text-zinc-300 font-mono font-semibold text-center flex-1 tracking-wide">
            gfp — zsh — terminal
          </div>
          <div className="w-24 text-right text-[11px] text-zinc-500 font-mono">
            v0.1.0
          </div>
        </div>

        <div className="p-8 bg-[#0A0A0C] h-[360px] space-y-6 text-left overflow-hidden flex flex-col justify-start">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-white">
              <span className="text-emerald-400 font-extrabold">$</span>
              <span>{cmd1.slice(0, cmd1TypedChars)}</span>
              {showCmd1Cursor && <span className="inline-block w-2.5 h-5 bg-emerald-400 animate-pulse" />}
            </div>
            {cmd1Running && (
              <div className="text-zinc-300 text-xs sm:text-sm flex items-center gap-2.5 pl-6">
                <span className="text-yellow-400 font-bold">{currentSpinner}</span>
                <span>Initializing local repository...</span>
              </div>
            )}
            {cmd1Done && (
              <div className="text-emerald-400 text-xs sm:text-sm flex items-center gap-2.5 pl-6 font-medium">
                <span className="font-bold">✔</span>
                <span>Initialized .gfp/ repository</span>
              </div>
            )}
          </div>

          {showCmd2Line && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-white">
                <span className="text-emerald-400 font-extrabold">$</span>
                <span>{cmd2.slice(0, cmd2TypedChars)}</span>
                {showCmd2Cursor && <span className="inline-block w-2.5 h-5 bg-emerald-400 animate-pulse" />}
              </div>
              {cmd2Running && (
                <div className="text-zinc-300 text-xs sm:text-sm flex items-center gap-2.5 pl-6">
                  <span className="text-yellow-400 font-bold">{currentSpinner}</span>
                  <span>Running evals across Groq & Anthropic...</span>
                </div>
              )}
              {cmd2Done && (
                <div className="text-emerald-400 text-xs sm:text-sm flex items-center gap-2.5 pl-6 font-medium">
                  <span className="font-bold">✔</span>
                  <span>12/12 assertions passed (Groq 120ms / Claude 1.5s)</span>
                </div>
              )}
            </div>
          )}

          {showCmd3Line && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-white">
                <span className="text-emerald-400 font-extrabold">$</span>
                <span>{cmd3.slice(0, cmd3TypedChars)}</span>
                {showCmd3Cursor && <span className="inline-block w-2.5 h-5 bg-emerald-400 animate-pulse" />}
              </div>
              {cmd3Running && (
                <div className="text-zinc-300 text-xs sm:text-sm flex items-center gap-2.5 pl-6">
                  <span className="text-yellow-400 font-bold">{currentSpinner}</span>
                  <span>Acquiring advisory lock & hashing SHA-256...</span>
                </div>
              )}
              {cmd3Done && (
                <div className="text-emerald-400 text-xs sm:text-sm pl-6 font-bold flex items-center gap-3">
                  <span className="font-bold">✔</span>
                  <span className="text-zinc-200">Published main.prompt v2</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-medium">sha256: 7f3a9e04</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
