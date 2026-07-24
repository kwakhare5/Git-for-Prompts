export const runtime = 'edge';
export const alt = 'Git for Prompts';
export const contentType = 'image/png';

export default async function Image() {
  try {
    const targetUrl = 'https://gitforprompts.vercel.app';
    const screenshotApi = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&embed=screenshot.url&waitForTimeout=3000&waitUntil=networkidle0&viewport.width=1200&viewport.height=630&force=true`;
    
    const res = await fetch(screenshotApi);
    if (!res.ok) throw new Error('Failed to fetch screenshot');
    
    const imageBuffer = await res.arrayBuffer();
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('OG Image fetch failed, falling back to basic card:', error);
    // Return a simple SVG fallback if API fails
    return new Response(
      `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#09090B"/>
        <text x="600" y="315" font-family="sans-serif" font-size="64" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Git for Prompts</text>
        <text x="600" y="380" font-family="sans-serif" font-size="28" fill="#A1A1AA" text-anchor="middle">Treat your prompts like production code.</text>
      </svg>`,
      {
        headers: {
          'Content-Type': 'image/svg+xml',
        },
      }
    );
  }
}
