'use client';

import { loader } from '@monaco-editor/react';

declare global {
  interface Window {
    __monaco_loader_init?: boolean;
  }
}

// Singleton Monaco loader configuration guarded by window flag to prevent duplicate worker module definition warnings
if (typeof window !== 'undefined' && !window.__monaco_loader_init) {
  window.__monaco_loader_init = true;
  loader.config({
    paths: {
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs',
    },
  });
}


