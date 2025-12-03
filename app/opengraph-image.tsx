import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nurse Buddy - AI-Powered Nursing School Test Prep";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #EBF5FF 0%, #FFFFFF 50%, #ECFDF5 100%)",
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
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(0, 137, 237, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Logo/Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #0089ED 0%, #0073CF 100%)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <span style={{ color: "white", fontSize: 32, fontWeight: 700 }}>N</span>
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#0089ED",
            }}
          >
            Nurse Buddy
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#1F2937",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 900,
            marginBottom: 24,
          }}
        >
          Turn Your Slides Into
          <span style={{ color: "#0089ED" }}> Practice Tests</span>
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: 28,
            color: "#6B7280",
            textAlign: "center",
            maxWidth: 700,
            marginBottom: 40,
          }}
        >
          AI-powered nursing school test prep from your own materials
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 32,
          }}
        >
          {[
            "Upload PowerPoints",
            "100-Question Tests",
            "AI Rationales",
          ].map((feature) => (
            <div
              key={feature}
              style={{
                display: "flex",
                alignItems: "center",
                background: "white",
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 12,
                paddingBottom: 12,
                borderRadius: 12,
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  background: "#10B981",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <span style={{ color: "white", fontSize: 14 }}>✓</span>
              </div>
              <span style={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
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
