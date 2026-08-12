import { ImageResponse } from "next/og";

export const alt = "Git for Prompts — Local-First VCS for AI Prompts";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          gap: "36px",
          fontFamily: "sans-serif",
          color: "#f4f4f5",
          padding: "40px",
        }}
      >
        {/* Top Squircle Logo Tile */}
        <div
          style={{
            width: "84px",
            height: "84px",
            borderRadius: "24px",
            backgroundColor: "#141414",
            border: "1.5px solid #2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 32 32">
            <g
              transform="translate(4, 4)"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="18" r="3" />
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="6" r="3" />
              <path d="M18 9v2c0 1.7-1.3 3-3 3h-6c-1.7 0-3-1.3-3-3V9" />
              <path d="M12 15V9" />
            </g>
          </svg>
        </div>

        {/* Center Main Title */}
        <h1
          style={{
            fontSize: "76px",
            fontWeight: 800,
            letterSpacing: "-2.5px",
            margin: 0,
            color: "#ffffff",
            lineHeight: 1.0,
          }}
        >
          gitforprompts.com
        </h1>

        {/* Bottom Command Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            backgroundColor: "#141414",
            borderRadius: "9999px",
            border: "1.5px solid #2a2a2a",
            padding: "16px 36px",
            boxShadow: "0 12px 30px -10px rgba(0, 0, 0, 0.6)",
          }}
        >
          <span
            style={{
              color: "#60a5fa",
              fontWeight: 800,
              fontFamily: "monospace",
              fontSize: "24px",
            }}
          >
            $
          </span>
          <span
            style={{
              color: "#f4f4f5",
              fontFamily: "monospace",
              fontSize: "22px",
              fontWeight: 500,
              letterSpacing: "-0.2px",
            }}
          >
            npx gfp init
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
