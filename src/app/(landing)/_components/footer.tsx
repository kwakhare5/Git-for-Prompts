import Link from 'next/link';
import { siteConfig } from '@/config/site';

const LINKS = [
  {
    group: 'Product',
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Explore', href: '/explore' },
      { label: 'API Keys', href: '/dashboard/api-keys' },
    ],
  },
  {
    group: 'Developers',
    items: [
      { label: 'REST API', href: '#docs' },
      { label: 'CLI Reference', href: '#docs' },
      { label: 'Webhooks', href: '#docs' },
    ],
  },
  {
    group: 'Project',
    items: [
      { label: 'GitHub', href: 'https://github.com/kwakhare5/Git-for-Prompts', external: true },
      { label: 'Twitter / X', href: 'https://x.com/kwakhare5', external: true },
      { label: 'Changelog', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <div className="text-white font-semibold tracking-tight text-sm">
            git for prompts
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
            {siteConfig.tagline}
          </p>
          <p className="text-[10px] font-mono text-zinc-700 mt-auto">
            MIT License
          </p>
        </div>

        {/* Link groups */}
        {LINKS.map((group) => (
          <div key={group.group} className="flex flex-col gap-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600">
              {group.group}
            </p>
            <ul className="flex flex-col gap-2">
              {group.items.map((item) => (
                <li key={item.label}>
                  {'external' in item && item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      {item.label} ↗
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-xs text-zinc-400 hover:text-white transition-colors"
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

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04] py-5 px-6 max-w-6xl mx-auto flex items-center justify-between">
        <p className="text-[11px] font-mono text-zinc-500">
          © {new Date().getFullYear()} Git for Prompts · Built by{' '}
          <a
            href="https://github.com/kwakhare5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Karan Wakhare
          </a>
        </p>
        <p className="text-xs text-zinc-500">
          Crafted for prompt engineers & LLM teams.
        </p>
      </div>
    </footer>
  );
}
