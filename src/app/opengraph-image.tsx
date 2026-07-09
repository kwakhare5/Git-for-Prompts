import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Git for Prompts — Version control for AI prompts';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#f4f4f5',
          padding: '48px',
          position: 'relative',
        }}
      >
        {/* Decorative Grid Effect (Satori compatible background accents) */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '4px',
            background: 'linear-gradient(to right, #27272a, #52525b, #27272a)',
          }}
        />

        {/* Logo / Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            border: '1px solid #27272a',
            backgroundColor: '#18181b',
            padding: '6px 12px',
            borderRadius: '20px',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', letterSpacing: '0.05em' }}>
            GIT-FOR-PROMPTS.VERCEL.APP
          </span>
        </div>

        {/* Big Premium Header */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.15,
            marginBottom: '16px',
            maxWidth: '900px',
            letterSpacing: '-0.02em',
          }}
        >
          Treat your prompts like production code.
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: '18px',
            color: '#a1a1aa',
            textAlign: 'center',
            maxWidth: '750px',
            lineHeight: 1.5,
            marginBottom: '36px',
            fontWeight: 300,
          }}
        >
          Version, test, A/B compare, and deploy AI prompt templates using a clean, developer-first Git workflow. No more prompt chaos.
        </div>

        {/* Buttons / Actions */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          <div
            style={{
              backgroundColor: '#f4f4f5',
              color: '#09090b',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Try Sandbox
          </div>
          <div
            style={{
              border: '1px solid #27272a',
              color: '#e4e4e7',
              backgroundColor: 'rgba(24, 24, 27, 0.4)',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Dashboard
          </div>
        </div>

        {/* Mini macOS Window mockup */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '640px',
            border: '1px solid #27272a',
            borderRadius: '10px',
            backgroundColor: '#18181b',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Mock bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px',
              borderBottom: '1px solid #27272a',
              backgroundColor: '#09090b',
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FF5F56' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27C93F' }} />
            </div>
            <span style={{ fontSize: '11px', color: '#71717a', fontFamily: 'monospace' }}>
              returns_agent_v3.git
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ fontSize: '9px', color: '#10b981', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Live
              </span>
            </div>
          </div>
          {/* Mock console */}
          <div
            style={{
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12px',
              fontFamily: 'monospace',
              lineHeight: 1.4,
            }}
          >
            <div style={{ display: 'flex', color: '#71717a' }}>
              $ git commit -m &quot;Refactor: offer full refund for broken item&quot;
            </div>
            <div style={{ display: 'flex', color: '#a1a1aa' }}>
              [main 4f89d3a] Refactor: offer full refund for broken item
            </div>
            <div style={{ display: 'flex', color: '#10b981' }}>
              ✔ Running evaluation pipeline... (100% tests passed)
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
