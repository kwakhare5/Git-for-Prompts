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
      { label: 'Webhooks', href: '/dashboard/webhooks' },
    ],
  },
  {
    group: 'Project',
    items: [
      { label: 'GitHub', href: 'https://github.com/kwakhare5/Git-for-Prompts', external: true },
      { label: 'Twitter / X', href: 'https://x.com/kwakhare5', external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <div className="text-[#f5f0eb] font-bold tracking-tight text-base font-sans">
            git for prompts
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-[220px] font-sans">
            {siteConfig.tagline}
          </p>
          <p className="text-xs font-mono text-zinc-500 mt-auto">
            MIT License
          </p>
        </div>

        {/* Link groups */}
        {LINKS.map((group) => (
          <div key={group.group} className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
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
                      className="text-sm text-zinc-400 hover:text-[#f5f0eb] transition-colors font-sans"
                    >
                      {item.label} ↗
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm text-zinc-400 hover:text-[#f5f0eb] transition-colors font-sans"
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
      <div className="border-t border-white/[0.04] py-6 px-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-mono text-zinc-400">
          © {new Date().getFullYear()} Git for Prompts · Built by{' '}
          <a
            href="https://github.com/kwakhare5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-white transition-colors"
          >
            Karan Wakhare
          </a>
        </p>
        <p className="text-sm text-zinc-400 font-sans">
          Built for developers who care about their prompts.
        </p>
      </div>
    </footer>
  );
}
