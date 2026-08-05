'use client';

import { loader } from '@monaco-editor/react';

// Singleton Monaco loader configuration guarded by window flag to prevent duplicate worker module definition warnings
if (typeof window !== 'undefined' && !(window as any).__monaco_loader_init) {
  (window as any).__monaco_loader_init = true;
  loader.config({
    paths: {
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs',
    },
  });
}

export { loader };
