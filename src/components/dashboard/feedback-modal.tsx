'use client';

import React, { useState } from 'react';
import { MessageSquare, Bug, Sparkles, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';

export function FeedbackModal({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('bug');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error('Please enter a short subject');
      return;
    }

    const titlePrefix = feedbackType === 'bug' ? '[BUG]' : feedbackType === 'feature' ? '[FEATURE]' : '[FEEDBACK]';
    const issueTitle = encodeURIComponent(`${titlePrefix} ${subject}`);
    const issueBody = encodeURIComponent(
      `### Type\n${feedbackType.toUpperCase()}\n\n### Description\n${details || 'No additional details provided.'}\n\n---\n*Submitted via Git for Prompts In-App Feedback Widget*`
    );

    const githubUrl = `https://github.com/kwakhare5/Git-for-Prompts/issues/new?title=${issueTitle}&body=${issueBody}`;

    toast.success('Opening GitHub Issues with pre-filled details...');
    window.open(githubUrl, '_blank', 'noopener,noreferrer');

    // Reset and close
    setSubject('');
    setDetails('');
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-zinc-800/80 transition-colors group cursor-pointer ${
          isCollapsed ? 'justify-center' : ''
        }`}
        title="Share feedback or report an issue"
      >
        <MessageSquare className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 shrink-0" />
        {!isCollapsed && <span>Feedback</span>}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-bg-card border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 font-sans z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/90 pb-4 mb-5">
              <div className="flex items-center gap-2.5 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                  Product Feedback &amp; Issues
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selectors */}
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setFeedbackType('bug')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer font-bold transition-all ${
                    feedbackType === 'bug'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-xs'
                      : 'bg-bg-page text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <Bug className="w-3.5 h-3.5" />
                  <span>Bug Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackType('feature')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer font-bold transition-all ${
                    feedbackType === 'feature'
                      ? 'bg-blue-500/15 text-blue-300 border-blue-500/40 shadow-xs'
                      : 'bg-bg-page text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Feature</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackType('general')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer font-bold transition-all ${
                    feedbackType === 'general'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-xs'
                      : 'bg-bg-page text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>General</span>
                </button>
              </div>

              {/* Subject */}
              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    feedbackType === 'bug'
                      ? 'e.g. Diff view fails on large Zod schemas'
                      : 'e.g. Add Anthropic Claude 3.7 Sonnet provider'
                  }
                  className="w-full bg-bg-page border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              {/* Details */}
              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">
                  Details / Reproduction Steps
                </label>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe what happened or the use case you want solved..."
                  className="w-full bg-bg-page border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors font-sans"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <span>Submit to GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
