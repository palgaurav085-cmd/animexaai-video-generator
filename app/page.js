"use client";

export default function HomePage() {
  return (
    <div
      style={{
        background: "#0A1437",
        color: "white",
        minHeight: "100vh",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "38px", marginBottom: "20px" }}>
        Animexa AI — Create Full Animation Videos Instantly
      </h1>

      <p style={{ fontSize: "18px", opacity: 0.85, maxWidth: "800px", margin: "0 auto" }}>
        Paste your script and let AI automatically generate a complete animation video
      </p>

      <a
        href="/generate"
        style={{
          backgroundColor: "#00C2FF",
          padding: "15px 25px",
          display: "inline-block",
          marginTop: "30px",
          borderRadius: "8px",
          fontWeight: "600",
          textDecoration: "none",
          color: "#000",
          fontSize: "18px",
          boxShadow: "0px 0px 12px rgba(0, 194, 255, 0.4)",
        }}
      >
        🚀 Launch AI Video Generator
      </a>
    </div>
  );
}
