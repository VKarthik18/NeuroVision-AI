// pages/index.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // Dark/light mode management
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  return (
    <>
      {/* HEAD AND META */}
      <Head>
        <title>NEUROVISION-AI | Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AI-powered Alzheimer’s detection platform for early intervention and better outcomes." />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* GLOBAL BACKGROUND */}
      <div className="bg-image" />
      <div className="aurora" />

      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-inner">
          <div className="brand">
            <Image src="/logo.png" alt="NeuroVision Logo" width={40} height={40} className="logo" priority />
            <div className="title">NEUROVISION-AI</div>
          </div>
          <div className="nav-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <nav className="nav-links">
              <Link href="/">Home</Link>
              </nav>
              <nav className="nav-links">
              <Link href="/predict">Predict</Link>
              </nav>
              <button
              aria-label="Toggle Dark Mode"
              className="mode-btn"
              onClick={() => setDarkMode(!darkMode)}
              >
              {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="container">
        <section className="hero-wrapper">
          <div className="hero-text" style={{ textAlign: 'center', width: '100%' }}>
        <h1>
          Early Alzheimers Detection
        </h1>
        <p style={{ margin: '0 auto' }}>
          NeuroVision AI empowers caregivers and clinicians to screen for Alzheimers disease at its earliest stages with modern, AI-powered tools.
        </p>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <Link href="/predict" className="btn btn-primary">Predict</Link>
        </div>
          </div>
          <div className="hero-img" style={{ display: 'flex', justifyContent: 'center' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="illusion-video"
          style={{
            borderRadius: '20px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
            width: '100%',
            maxWidth: '420px'
          }}
        >
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
            <p style={{ fontSize: '14px' }}>
              AI-powered Alzheimer’s detection and screening platform for early intervention and better outcomes.
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
            <p style={{ fontSize: '14px' }}>
              Address: 123 HealthTech Road, Innovation City<br />
              Email: support@neurovision.ai<br />
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
        <div className="footer-bottom">© 2025 NEUROVISION-AI. All rights reserved.</div>
      </footer>

      {/* Custom Styles: Modern, Responsive, Glassmorphism & Animations */}
      <style jsx global>{`
        :root {
          --primary: #3c62de;
          --muted: #7d89c5;
          --glass: rgba(255,255,255,0.16);
          --bg-soft: #f6f8fb;
          --text: #2e354b;
        }
        body.dark {
          --primary: #a8b9fc;
          --muted: #e4e7f7;
          --glass: rgba(34,34,54,0.56);
          --bg-soft: #22263c;
          --text: #e4e7f7;
          background: linear-gradient(135deg,#181734 0%,#123b78 100%);
        }
        html, body {
          margin: 0; padding: 0;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          min-height: 100vh;
          background: var(--bg-soft);
          color: var(--text);
          transition: background 0.5s, color 0.5s;
        }
        .bg-image {
          position: fixed; inset: 0;
          z-index: 0;
          background: linear-gradient(120deg,#d1e3ff 0%,#f6f8fb 100%);
          pointer-events: none;
        }
        .aurora {
          position: fixed; inset: 0;
          z-index: 1;
          background:
            radial-gradient(ellipse 50% 60% at 60% 15%,rgba(60,98,222,0.16),transparent 70%),
            radial-gradient(ellipse 30% 23% at 45% 80%,rgba(92,176,255,0.18),transparent 80%);
          pointer-events: none;
          filter: blur(30px);
        }
        .container { position: relative; z-index: 2; }
        .nav { background: transparent; position: relative; z-index: 10; }
        .nav-inner { display: flex; justify-content: space-between; align-items: center; max-width: 1100px; margin: auto; padding: 30px 20px; }
        .brand { display: flex; align-items: center; gap: 14px; font-weight: 700; font-size: 1.4rem; }
        .title { letter-spacing: 1.2px; }
        .logo { border-radius: 12px; }
        .nav-links a { margin: 0 14px; font-weight: 600; color: var(--text); transition: color 0.25s; }
        .nav-links a:hover { color: var(--primary); }
        .mode-btn {
          font-size: 1.3rem;
          border: none; background: var(--glass); padding: 7px 16px;
          border-radius: 9px; cursor: pointer;
          box-shadow: 0 2px 16px rgba(60,98,222,0.07);
          transition: background 0.3s;
        }
        .mode-btn:hover { background: var(--primary); color: #fff; }
        @media(max-width:900px){
          .nav-inner { flex-direction: column; align-items: stretch; gap: 18px; }
          .brand { justify-content: center; }
        }
        .hero-wrapper {
          display: grid; grid-template-columns: 1fr 1fr;
          align-items: center; gap: 40px; padding: 80px 20px;
          animation: fadeInHero 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeInHero {
          0% { opacity: 0; transform: translateY(70px) scale(0.92);}
          100% { opacity: 1; transform: none;}
        }
        @media(max-width:900px){
          .hero-wrapper { grid-template-columns:1fr; text-align:center; padding:56px 10px; }
        }
        .hero-text h1 {
          font-size: clamp(34px, 4vw, 54px); font-weight: 800;
          margin-bottom: 16px; color: var(--primary);
          line-height: 1.1;
          text-shadow: 0 4px 22px rgba(60,98,222,0.06);
        }
        .hero-text p {
          font-size: 18px; color: var(--muted); margin-bottom: 28px; max-width: 500px;
        }
        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: flex-start;}
        @media(max-width:900px){ .hero-actions { justify-content: center;} }
        .btn {
          font-weight: 600; font-size: 1.12rem;
          padding: 13px 36px; border-radius: 11px; border: none; cursor: pointer;
          box-shadow: 0 4px 18px rgba(60,98,222,0.06);
          transition: background 0.28s, color 0.28s;
        }
        .btn-primary {
          background: var(--primary); color: #fff;
        }
        .btn-primary:hover { background: #2345a5; }
        .btn-ghost {
          background: transparent; color: var(--primary); border: 2px solid var(--primary);
        }
        .btn-ghost:hover { background: var(--primary); color: #fff; }
        .hero-img video {
          width: 100%; max-width: 420px; border-radius: 20px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.26); aspect-ratio: 16/9;
        }
        .features {
          display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
          gap: 20px; margin: 60px auto 80px; max-width: 1100px;
          animation: fadeInFeatures 0.8s cubic-bezier(.6,0,.4,1);
        }
        @keyframes fadeInFeatures { 0% { opacity:0; transform: scale(0.97);} 100%{opacity:1; transform:none;} }
        .feature-tile {
          padding: 26px;
          border-radius: 16px;
          background: var(--glass);
          backdrop-filter: blur(14px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 6px 18px rgba(0,0,0,0.24);
          transition: transform .22s;
        }
        .feature-tile:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 28px rgba(60,98,222,0.09);}
        .feature-tile h3 { margin: 0 0 10px; font-size: 18px; color: var(--primary);}
        .feature-tile p { margin: 0; color: var(--muted); font-size: 15px;}
        .footer {
          background: var(--bg-soft); color: var(--muted);
          padding: 40px 20px; border-top: 1px solid rgba(255,255,255,0.06); z-index:3;
        }
        .footer-content {
          max-width: 1100px; margin: auto; display: grid;
          grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 30px;
        }
        .footer h4 {color: var(--text); margin-bottom:12px; font-size:16px;}
        .footer a { display: block; text-decoration: none;
          color: var(--muted); margin-bottom:8px; font-size:14px; transition:color .2s;}
        .footer a:hover {color: var(--primary);}
        .footer-bottom {
          text-align: center; margin-top: 30px; font-size: 13px; color: var(--muted);}
      `}
      </style>
    </>
  );
}
