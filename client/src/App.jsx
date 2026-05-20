import React, { useState, useEffect } from "react";

const themes = {
  light: {
    bg: "#f8fafc",
    card: "rgba(255,255,255,0.9)",
    text: "#0f172a",
    muted: "#64748b",
    accent: "#2563eb",
    heading: "#1e3a8a"
  },
  dark: {
    bg: "#0b1220",
    card: "rgba(17,24,39,0.85)",
    text: "#e5e7eb",
    muted: "#9ca3af",
    accent: "#38bdf8",
    heading: "#93c5fd"
  },
  ocean: {
    bg: "linear-gradient(135deg,#0ea5e9,#1e3a8a)",
    card: "rgba(255,255,255,0.08)",
    text: "#ffffff",
    muted: "#cbd5e1",
    accent: "#22d3ee",
    heading: "#e0f2fe"
  }
};

export default function App() {
  const [theme, setTheme] = useState("light");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [inputType, setInputType] = useState("text");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = themes[theme];

  // save theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  const changeTheme = (val) => {
    setTheme(val);
    localStorage.setItem("theme", val);
  };

  const analyze = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputType, text, url })
    });

    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  return (
    <div style={{
      background: t.bg,
      minHeight: "100vh",
      padding: 30,
      color: t.text,
      transition: "0.4s"
    }}>

      {/* HEADER */}
      <h1 style={{
        textAlign: "center",
        fontSize: 32,
        fontWeight: 800,
        color: t.heading,
        letterSpacing: "1px"
      }}>
        🧠 Veracity Intelligence Engine
      </h1>

      <p style={{
        textAlign: "center",
        color: t.muted,
        marginBottom: 20
      }}>
        AI-powered real-time news verification system
      </p>

      {/* 🌙 MODERN TOGGLE SWITCH */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>

        {["light", "dark", "ocean"].map((mode) => (
          <button
            key={mode}
            onClick={() => changeTheme(mode)}
            style={{
              padding: "8px 14px",
              margin: "0 6px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              background: theme === mode ? t.accent : "rgba(255,255,255,0.1)",
              color: theme === mode ? "#000" : t.text,
              transform: theme === mode ? "scale(1.05)" : "scale(1)",
              transition: "0.3s"
            }}
          >
            {mode === "light" && "🌞 Light"}
            {mode === "dark" && "🌙 Dark"}
            {mode === "ocean" && "🌊 Ocean"}
          </button>
        ))}

      </div>

      {/* FORM CARD */}
      <form
        onSubmit={analyze}
        style={{
          maxWidth: 520,
          margin: "auto",
          padding: 24,
          borderRadius: 16,
          background: t.card,
          backdropFilter: "blur(12px)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={() => setInputType("text")}>📝 Text</button>
          <button type="button" onClick={() => setInputType("url")}>🔗 URL</button>
        </div>

        {inputType === "text" ? (
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              marginTop: 10,
              padding: 12,
              borderRadius: 10,
              border: "none",
              outline: "none"
            }}
          />
        ) : (
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "100%",
              marginTop: 10,
              padding: 12,
              borderRadius: 10,
              border: "none"
            }}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 15,
            padding: 12,
            borderRadius: 12,
            background: `linear-gradient(90deg, ${t.accent}, #60a5fa)`,
            border: "none",
            fontWeight: "700",
            cursor: "pointer",
            color: "#000",
            transition: "0.3s"
          }}
        >
          {loading ? "🔍 Analyzing..." : "🚀 Analyze News"}
        </button>
      </form>

      {/* RESULTS */}
      {data && (
        <div style={{ maxWidth: 900, margin: "40px auto" }}>

          <h2 style={{
            textAlign: "center",
            color: t.heading,
            fontSize: 28
          }}>
            {data.verdict}
          </h2>

          {/* ARTICLES */}
          <h3 style={{
            marginTop: 20,
            color: t.heading
          }}>
            📰 Verified Related Articles
          </h3>

          {data.relatedArticles?.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                marginTop: 12,
                padding: 16,
                borderRadius: 14,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                color: t.text,
                textDecoration: "none",
                transition: "0.3s",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              🔗 {item.title}

              <div style={{ fontSize: 12, color: t.muted }}>
                {item.source} • Match: {item.score}%
              </div>
            </a>
          ))}

        </div>
      )}
    </div>
  );
}

