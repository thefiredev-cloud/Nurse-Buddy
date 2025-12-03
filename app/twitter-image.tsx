import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nurse Buddy - AI-Powered Nursing School Test Prep";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #EBF5FF 0%, #FFFFFF 50%, #F3E8FF 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Background patterns */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "linear-gradient(135deg, #0089ED 0%, #A855F7 100%)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 14,
            }}
          >
            <span style={{ color: "white", fontSize: 28, fontWeight: 700 }}>N</span>
          </div>
          <span
            style={{
              fontSize: 42,
              fontWeight: 700,
              background: "linear-gradient(135deg, #0089ED 0%, #A855F7 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Nurse Buddy
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#1F2937",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 850,
            marginBottom: 20,
          }}
        >
          Upload Slides. Get Practice Tests.
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: 26,
            color: "#6B7280",
            textAlign: "center",
            maxWidth: 650,
            marginBottom: 36,
          }}
        >
          AI-powered nursing exam prep with 100 questions & rationales
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(135deg, #0089ED 0%, #0073CF 100%)",
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 16,
            paddingBottom: 16,
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0, 137, 237, 0.3)",
          }}
        >
          <span style={{ color: "white", fontSize: 22, fontWeight: 600 }}>
            5 Free Uploads • $35/month
          </span>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 18,
            color: "#9CA3AF",
          }}
        >
          nursebuddy.io
        </div>
      </div>
    ),
    { ...size }
  );
}
