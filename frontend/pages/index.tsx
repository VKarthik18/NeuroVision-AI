// pages/index.tsx
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  return (
    <>
      {/* HEAD */}
      <Head>
        <title>NEUROVISION-AI | Home</title>
        <meta
          name="description"
          content="AI-powered Alzheimer’s detection platform for early intervention and better outcomes."
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-inner">
          <Link href="/" className="brand">
          <div className="brand">
            <Image
              src="/logo.png"
              alt="NeuroVision Logo"
              width={40}
              height={40}
              className="logo"
              priority
            />
            <div className="title">NEUROVISION-AI</div>
          </div>
          </Link>
          <div className="nav-actions">
            <nav className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/predict">Predict</Link>
            </nav>
            <button
              aria-label="Toggle Dark Mode"
              className="mode-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="container">
        <section className="hero-wrapper">
          <div className="hero-text">
            <h1>Early Alzheimer’s Detection</h1>
            <p>
              NeuroVision AI empowers caregivers and clinicians to screen for
              Alzheimer’s disease at its earliest stages with modern, AI-powered
              tools.
            </p>
            <div className="hero-actions">
              <Link href="/predict" className="btn btn-primary">
                Predict
              </Link>
            </div>
          </div>
          <div className="hero-img">
            <video autoPlay loop muted playsInline>
              <source src="/illusion.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features">
          <div className="feature-tile">
            <h3>Privacy First</h3>
            <p>Your data stays secure. Local demo only — no information leaves your browser.</p>
          </div>
          <div className="feature-tile">
            <h3>Fast & Simple</h3>
            <p>Quick questionnaires and scan uploads for instant results.</p>
          </div>
          <div className="feature-tile">
            <h3>Clinician Friendly</h3>
            <p>Easy to adopt in hospitals and clinics, with familiar workflows.</p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <h4>About NEUROVISION-AI</h4>
            <p>
              AI-powered Alzheimer’s detection and screening platform for early
              intervention and better outcomes.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
            <Link href="/assessment">Assessment</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <p>
              Address: 123 HealthTech Road, Innovation City <br />
              Email: support@neurovision.ai <br />
              Phone: +91 98765 43210
            </p>
          </div>
          <div>
            <h4>Follow Us</h4>
            <a href="#">Website</a>
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
            <a href="#">Instagram</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 NEUROVISION-AI. All rights reserved.
        </div>
      </footer>

      {/* STYLES */}
      <style jsx global>{`
        :root {
          --primary: #3c62de;
          --muted: #7d89c5;
          --glass: rgba(255, 255, 255, 0.16);
          --bg-soft: #f6f8fb;
          --text: #2e354b;
        }
        body.dark {
          --primary: #a8b9fc;
          --muted: #e4e7f7;
          --glass: rgba(34, 34, 54, 0.56);
          --bg-soft: #22263c;
          --text: #e4e7f7;
          background: linear-gradient(135deg, #181734 0%, #123b78 100%);
        }
        html,
        body {
          margin: 0;
          padding: 0;
          font-family: "Inter", "Segoe UI", Arial, sans-serif;
          min-height: 100vh;
          background: var(--bg-soft);
          color: var(--text);
          transition: background 0.5s, color 0.5s;
        }

        /* NAVBAR */
        .nav {
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .nav-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: auto;
          padding: 20px 30px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          font-size: 1.4rem;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .nav-links a {
          margin: 0 10px;
          font-weight: 600;
          color: var(--text);
          text-decoration: none;
        }
        .nav-links a:hover {
          color: var(--primary);
        }
        .mode-btn {
          font-size: 1.3rem;
          border: none;
          background: var(--glass);
          padding: 7px 16px;
          border-radius: 9px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .mode-btn:hover {
          background: var(--primary);
          color: #fff;
        }

        /* HERO */
        .hero-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 40px;
          padding: 80px 20px;
          max-width: 1200px;
          margin: auto;
          text-align: center;
        }
        .hero-text h1 {
          font-size: clamp(34px, 4vw, 54px);
          font-weight: 800;
          margin-bottom: 16px;
          color: var(--primary);
        }
        .hero-text p {
          font-size: 18px;
          color: var(--muted);
          margin-bottom: 28px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .btn {
          font-weight: 600;
          padding: 13px 36px;
          border-radius: 11px;
          border: none;
          cursor: pointer;
        }
        .btn-primary {
          background: var(--primary);
          color: #fff;
        }
        .btn-primary:hover {
          background: #2345a5;
        }
        .hero-img video {
          width: 100%;
          max-width: 420px;
          border-radius: 20px;
        }

        /* FEATURES */
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin: 60px auto 80px;
          max-width: 1200px;
        }
        .feature-tile {
          padding: 26px;
          border-radius: 16px;
          background: var(--glass);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.09);
        }
        .feature-tile h3 {
          color: var(--primary);
        }

        /* FOOTER */
        .footer {
          background: var(--bg-soft);
          color: var(--muted);
          padding: 40px 20px;
        }
        .footer-content {
          max-width: 1200px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 30px;
        }
        .footer h4 {
          color: var(--text);
          margin-bottom: 12px;
        }
        .footer a {
          display: block;
          color: var(--muted);
          margin-bottom: 8px;
          font-size: 14px;
          text-decoration: none;
        }
        .footer a:hover {
          color: var(--primary);
        }
        .footer-bottom {
          text-align: center;
          margin-top: 30px;
          font-size: 13px;
          color: var(--muted);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 15px;
        }

        @media (max-width: 900px) {
          .hero-wrapper {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
