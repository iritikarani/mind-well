import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 64,
          background: "linear-gradient(135deg, #f3ecfc 0%, #ffe6f1 55%, #fff1d9 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <svg width="300" height="300" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="16" fill="#E6DAF8" />
          <rect x="43" y="13" width="7" height="13" rx="2" fill="#5B3F8F" />
          <rect x="13" y="29" width="38" height="27" rx="7" fill="#FFE2CF" />
          <path
            d="M5 38L32 11l27 27c0 5-3 10-6 13-1-4-1-7-3-11-8 2-14-1-18-7-4 6-10 9-18 7-2 4-2 7-3 11-3-3-6-8-6-13z"
            fill="#7B5BC7"
          />
          <path d="M24 25l8-10c1 4-1 8-8 10z" fill="#8F72D8" />
          <path d="M32 11c0-4 5-5 6-2" fill="none" stroke="#5B3F8F" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M22 42q2.5-3 5 0M37 42q2.5-3 5 0" fill="none" stroke="#4A3A73" strokeWidth="2" strokeLinecap="round" />
          <circle cx="19.5" cy="47" r="2.6" fill="#FFB3C7" />
          <circle cx="44.5" cy="47" r="2.6" fill="#FFB3C7" />
          <path d="M28.5 47q3.5 3.5 7 0" fill="none" stroke="#4A3A73" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 31c0-2 3-2.5 3.5-.3.5-2.2 3.5-1.7 3.5.3 0 2-3.5 4-3.5 4s-3.5-2-3.5-4z" fill="#FF8FB1" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 84, fontWeight: 800, color: "#5b4b73", lineHeight: 1.05 }}>
            {SITE_NAME}
          </div>
          <div style={{ marginTop: 20, fontSize: 38, color: "#675a7c", lineHeight: 1.3 }}>
            {SITE_TAGLINE}
          </div>
          <div style={{ marginTop: 28, fontSize: 26, color: "#7b5bc7", fontWeight: 700 }}>
            A cozy room · daily letters · calm sounds
          </div>
        </div>
      </div>
    ),
    size,
  );
}
