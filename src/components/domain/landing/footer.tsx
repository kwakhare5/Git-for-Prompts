import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';

const LINKS = [
  {
    group: 'Product',
    items: [
      { label: 'Cloud Dashboard', href: '/dashboard' },
      { label: 'Explore Prompts', href: '/explore' },
      { label: 'API Keys', href: '/dashboard/api-keys' },
      { label: 'Webhooks', href: '/dashboard/webhooks' },
    ],
  },
  {
    group: 'Developers',
    items: [
      { label: 'gfp CLI (Wasm)', href: '#cli' },
      { label: 'REST API v1', href: '/api/v1/prompts' },
      { label: 'Node.js SDK', href: '#cli' },
      { label: 'Python SDK', href: '#cli' },
    ],
  },
  {
    group: 'Project & Community',
    items: [
      { label: 'GitHub Repository', href: 'https://github.com/kwakhare5/Git-for-Prompts', external: true },
      { label: 'Twitter / X', href: 'https://x.com/kwakhare5', external: true },
      { label: 'MIT Open-Source', href: 'https://github.com/kwakhare5/Git-for-Prompts/blob/main/LICENSE', external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-[#09090b] font-sans">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand & Mission Column */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-bold tracking-tight text-base font-sans">
              git for prompts
            </span>
            <Badge variant="outline" className="font-mono text-[9px] text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0">
              v0.2.0
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans">
            {siteConfig.tagline}
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono text-muted-foreground">All Systems Operational</span>
          </div>
        </div>

        {/* Tailark Footer-2 Link Groups */}
        {LINKS.map((group) => (
          <div key={group.group} className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              {group.group}
            </p>
            <ul className="flex flex-col gap-2.5">
              {group.items.map((item) => (
                <li key={item.label}>
                  {'external' in item && item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans flex items-center gap-1"
                    >
                      {item.label} <span className="text-[10px] text-zinc-500">↗</span>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-border/50 py-6 px-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-mono text-muted-foreground">
          © {new Date().getFullYear()} Git for Prompts · Built by{' '}
          <a
            href="https://github.com/kwakhare5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline font-semibold"
          >
            Karan Wakhare
          </a>
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-sans">
          <span>Tailark UI Architecture</span>
          <span>·</span>
          <span>MIT License</span>
        </div>
      </div>
    </footer>
  );
}

