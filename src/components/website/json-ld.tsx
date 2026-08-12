export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Git for Prompts",
    "operatingSystem": "All",
    "applicationCategory": "DeveloperApplication",
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
