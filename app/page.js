export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '32px',
      fontWeight: 'bold'
    }}>
      Animexa AI is LIVE 🎉
    </div>
  );
}
"use client";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #0A0F24, #1A2337)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: "42px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Animexa AI — Create Full Animation Videos Instantly
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: "20px",
          maxWidth: "650px",
          opacity: 0.85,
          lineHeight: "30px",
          marginBottom: "35px",
        }}
      >
        Paste your script and let AI automatically generate a complete animation
        video — characters, actions, voiceover, backgrounds, and everything
        included.
      </p>

      {/* CTA Button */}
      <a
        href="https://animexaai-video-generator.vercel.app/editor"
        style={{
          backgroundColor: "#00C2FF",
          padding: "14px 32px",
          borderRadius: "8px",
          color: "black",
          textDecoration: "none",
          fontSize: "20px",
          fontWeight: "600",
          boxShadow: "0px 0px 20px rgba(0, 194, 255, 0.6)",
          transition: "0.3s",
        }}
      >
        🚀 Launch AI Video Generator
      </a>

      {/* Features Section */}
      <div
        style={{
          marginTop: "60px",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <h2 style={{ fontSize: "30px", marginBottom: "25px" }}>
          Why Animexa AI?
        </h2>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            fontSize: "18px",
            lineHeight: "32px",
            opacity: 0.9,
          }}
        >
          <li>🎬 Full animation videos generated instantly</li>
          <li>🗣️ AI voiceover with your selected tone</li>
          <li>🧍 Add your custom character image</li>
          <li>📜 Auto-created scenes from script</li>
          <li>⚡ Fast rendering & easy download</li>
        </ul>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "80px",
          opacity: 0.6,
          fontSize: "14px",
        }}
      >
        © {new Date().getFullYear()} Animexa AI — Powered by Next.js & Vercel
      </div>
    </div>
  );
}
