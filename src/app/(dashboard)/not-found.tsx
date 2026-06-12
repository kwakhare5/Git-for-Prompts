import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="font-mono text-6xl text-zinc-700 mb-4">404</div>
      <h2 className="text-xl font-semibold text-zinc-100 mb-2">
        Page not found
      </h2>
      <p className="text-sm text-zinc-500 max-w-md mb-6">
        The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have
        access to it.
      </p>
      <Link
        href="/dashboard"
        className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition-colors border border-zinc-700"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
