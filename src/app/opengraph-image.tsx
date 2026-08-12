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
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 70%), radial-gradient(circle at 90% 90%, rgba(24, 24, 27, 0.8), transparent 50%)",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "#f4f4f5",
          border: "1px solid #27272a",
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3v12M12 15l-4-4M12 15l4-4"
                stroke="#60a5fa"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 19h14"
                stroke="#a1a1aa"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "-0.5px" }}>
              Git for Prompts
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#a1a1aa",
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid #27272a",
                letterSpacing: "0.5px",
              }}
            >
              LOCAL-FIRST VCS
            </span>
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              margin: 0,
              color: "#ffffff",
            }}
          >
            Treat your prompts like production code.
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Local-first prompt package manager &amp; version control for AI engineering.
          </p>
        </div>

        {/* Bottom Mock Terminal Snippet */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: "#18181b",
            borderRadius: "14px",
            border: "1px solid #27272a",
            padding: "16px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "monospace" }}>
            <span style={{ color: "#60a5fa", fontWeight: "bold" }}>$</span>
            <span style={{ color: "#f4f4f5", fontSize: "18px" }}>gfp push prompt.v2.md --commit &quot;feat: optimize output format&quot;</span>
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#34d399",
              fontWeight: 600,
              backgroundColor: "rgba(52, 211, 153, 0.1)",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(52, 211, 153, 0.2)",
            }}
          >
            v2.1.0 • Live
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
