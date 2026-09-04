import React from 'react';
import { useCurrentFrame } from 'remotion';

export const Scene3Terminal: React.FC = () => {
  const local = useCurrentFrame();

  const cmd1 = "npx gitforprompts init";
  const cmd1TypedChars = Math.min(cmd1.length, Math.max(0, local - 4));
  const showCmd1Cursor = local >= 4 && local < 28;
  const cmd1Running = local >= 28 && local < 38;
  const cmd1Done = local >= 38;

  const cmd2 = "gitforprompts add rag-agent";
  const showCmd2Line = local >= 44;
  const cmd2TypedChars = Math.min(cmd2.length, Math.max(0, local - 46));
  const showCmd2Cursor = local >= 44 && local < 74;
  const cmd2Running = local >= 74 && local < 84;
  const cmd2Done = local >= 84;

  const cmd3 = "gitforprompts push rag-agent";
  const showCmd3Line = local >= 90;
  const cmd3TypedChars = Math.min(cmd3.length, Math.max(0, local - 92));
  const showCmd3Cursor = local >= 90 && local < 122;
  const cmd3Running = local >= 122 && local < 134;
  const cmd3Done = local >= 134;

  const spinnerChars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const spinIndex = Math.floor(local / 3) % spinnerChars.length;
  const currentSpinner = spinnerChars[spinIndex];

  const cursorBlink = Math.floor(local / 8) % 2 === 0;

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
            gitforprompts — zsh — terminal
          </div>
          <div className="w-24 text-right text-[11px] text-zinc-500 font-mono">
            v1.0.0
          </div>
        </div>

        <div className="p-8 bg-[#0A0A0C] h-[360px] space-y-6 text-left overflow-hidden flex flex-col justify-start">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-white">
              <span className="text-emerald-400 font-extrabold">$</span>
              <span>{cmd1.slice(0, cmd1TypedChars)}</span>
              {showCmd1Cursor && (
                <span 
                  className="inline-block w-2.5 h-5 bg-emerald-400" 
                  style={{ opacity: cursorBlink ? 1 : 0 }} 
                />
              )}
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
                <span>Initialized .gitforprompts/ repository</span>
              </div>
            )}
          </div>

          {showCmd2Line && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-white">
                <span className="text-emerald-400 font-extrabold">$</span>
                <span>{cmd2.slice(0, cmd2TypedChars)}</span>
                {showCmd2Cursor && (
                  <span 
                    className="inline-block w-2.5 h-5 bg-emerald-400" 
                    style={{ opacity: cursorBlink ? 1 : 0 }} 
                  />
                )}
              </div>
              {cmd2Running && (
                <div className="text-zinc-300 text-xs sm:text-sm flex items-center gap-2.5 pl-6">
                  <span className="text-yellow-400 font-bold">{currentSpinner}</span>
                  <span>Saving snapshot to local SQLite...</span>
                </div>
              )}
              {cmd2Done && (
                <div className="text-emerald-400 text-xs sm:text-sm flex items-center gap-2.5 pl-6 font-medium">
                  <span className="font-bold">✔</span>
                  <span>Saved version v1 (rag-agent)</span>
                </div>
              )}
            </div>
          )}

          {showCmd3Line && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-white">
                <span className="text-emerald-400 font-extrabold">$</span>
                <span>{cmd3.slice(0, cmd3TypedChars)}</span>
                {showCmd3Cursor && (
                  <span 
                    className="inline-block w-2.5 h-5 bg-emerald-400" 
                    style={{ opacity: cursorBlink ? 1 : 0 }} 
                  />
                )}
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
                  <span className="text-zinc-200">Published rag-agent v1</span>
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
