"use client";

export default function GlobalRootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          textAlign: "center",
          padding: "2rem",
          background: "linear-gradient(160deg, #f3ecfc 0%, #fff6ea 100%)",
          fontFamily: "sans-serif",
          color: "#5b4b73",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Oops! Something doesn&apos;t look right. ♡
        </h1>
        <p style={{ maxWidth: "24rem", color: "#7d7090" }}>
          Try again in a moment — your data is safe.
        </p>
        <button
          onClick={reset}
          style={{
            minHeight: "44px",
            borderRadius: "9999px",
            background: "#7b5bc7",
            color: "white",
            fontWeight: 600,
            fontSize: "0.875rem",
            padding: "0.625rem 1.5rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
