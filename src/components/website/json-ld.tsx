export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Git for Prompts",
        "operatingSystem": "All",
        "applicationCategory": "DeveloperApplication",
        "softwareVersion": "0.1.0",
        "description": "Local-first prompt package manager and version control system for AI engineering.",
        "url": "https://gitforprompts.vercel.app",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "author": {
          "@type": "Organization",
          "name": "Git for Prompts",
          "url": "https://gitforprompts.vercel.app",
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Does Git for Prompts store my LLM API keys?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Local evals run directly in your terminal using your environment API keys. On the cloud SaaS, API keys are stored as non-reversible SHA-256 lookup hashes.",
            },
          },
          {
            "@type": "Question",
            "name": "How does local-first SQLite versioning work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The CLI uses Wasm SQLite (sql.js) locally in your directory. Every prompt save creates an immutable version row without requiring a network connection.",
            },
          },
          {
            "@type": "Question",
            "name": "What is a Prompt Bundle?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A prompt bundle is the atomic unit of versioning in Git for Prompts. It includes the system prompt, user template, model configurations (provider, model, temperature, topP), tools, and Zod response format schema.",
            },
          },
          {
            "@type": "Question",
            "name": "How do concurrent pushes handle version collisions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cloud sync uses PostgreSQL transaction advisory locking (pg_advisory_xact_lock) via insertNextVersion to ensure concurrent pushes never overwrite or collision version numbers.",
            },
          },
          {
            "@type": "Question",
            "name": "Can I migrate my existing raw prompt strings to Git for Prompts?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Running npx gitforprompts init automatically detects existing prompt templates and wraps them into valid Prompt Bundles.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
