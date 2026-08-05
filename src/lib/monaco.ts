'use client';

import { loader } from '@monaco-editor/react';

// Singleton Monaco loader configuration to prevent duplicate worker registration warnings on hot-reloads
if (typeof window !== 'undefined') {
  loader.config({
    paths: {
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs',
    },
  });
}

export { loader };
