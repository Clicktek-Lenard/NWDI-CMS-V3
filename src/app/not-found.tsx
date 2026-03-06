import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#f8fafc" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "#f1f5f9",
              borderRadius: "9999px",
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "2rem", fontWeight: 700, color: "#94a3b8" }}>404</span>
          </div>
          <h1 style={{ color: "#1e293b", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
            Page not found
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/queue"
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Back to Queue
          </Link>
        </div>
      </body>
    </html>
  );
}
