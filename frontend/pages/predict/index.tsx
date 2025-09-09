import { useRouter } from "next/router"; 
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";

export default function Predict() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const handleAnswer = (hasMRI: boolean) => {
    if (hasMRI) {
      router.push("/multimodal");
    } else {
      router.push("/rnn");
    }
  };

  return (
    <>
      {/* HEAD */}
      <Head>
        <title>NEUROVISION-AI | Predict</title>
        <meta
          name="description"
          content="AI-powered Alzheimer’s detection platform for early intervention and better outcomes."
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-inner">
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

      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-r from-indigo-100 via-white to-indigo-50 font-sans">
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">
            Do you have an MRI scan report?
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Your answer will help us decide the best prediction model for you.
          </p>
          <div className="flex space-x-6 justify-center">
            <button
              onClick={() => handleAnswer(true)}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 hover:scale-105 transform transition"
            >
              Yes, I have
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl shadow-md hover:bg-gray-300 hover:scale-105 transform transition"
            >
              No, I don’t
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
