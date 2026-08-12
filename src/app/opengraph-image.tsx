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
          gap: "48px",
          fontFamily: "sans-serif",
          color: "#f4f4f5",
          padding: "60px",
        }}
      >
        {/* Top Squircle Logo Badge Tile */}
        <div
          style={{
            width: "88px",
            height: "88px",
            borderRadius: "24px",
            backgroundColor: "#141414",
            border: "1.5px solid #2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
          }}
        >
          <svg width="58" height="58" viewBox="0 0 32 32">
            <g
              transform="translate(4, 4)"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.3"
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

        {/* Title: Git for Prompts in Bold Sans-Serif */}
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
          Git for Prompts
        </h1>

        {/* Bottom Hero Command Pill ($ npx gfp init) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            backgroundColor: "#141414",
            borderRadius: "9999px",
            border: "1.5px solid #2a2a2a",
            padding: "18px 40px",
            boxShadow: "0 12px 30px -10px rgba(0, 0, 0, 0.6)",
          }}
        >
          {/* Terminal Icon */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span
            style={{
              color: "#34d399",
              fontFamily: "monospace",
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            $ npx gfp init
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
