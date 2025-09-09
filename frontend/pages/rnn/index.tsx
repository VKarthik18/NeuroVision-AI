import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import QuestionForm from "../../components/QuestionForm";
import { RnnAnswers, submitRNN } from "../../utils/api";

export default function Behavioral() {
  const [darkMode, setDarkMode] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const handleSubmit = async (answers: RnnAnswers) => {
    try {
      setLoading(true);
      setResult(null);
      const res = await submitRNN(answers);
      console.log("Server response:", res);
      setResult(res.predicted_stage);
    } catch (err) {
      console.error(err);
      setResult("Error contacting server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>NEUROVISION-AI | Behavioral Assessment</title>
        <meta
          name="description"
          content="Behavioral assessment for Alzheimer’s prediction using RNN model."
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* NAVBAR */}
      <header className="bg-indigo-700 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <Link href="/" className="brand">
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="NeuroVision AI" width={40} height={40} />
            <span className="text-xl font-bold">NEUROVISION-AI</span>
          </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-200">Home</Link>
            <Link href="/predict" className="hover:text-gray-200">Predict</Link>
            <button
              aria-label="Toggle Dark Mode"
              className="ml-4 text-lg"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-r from-indigo-100 via-white to-indigo-50 font-sans px-4">
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
            Behavioral Assessment
          </h1>

          <p className="text-gray-600 mb-8 text-center">
            Answer the following questions to help predict the stage using our RNN model.
          </p>

          <QuestionForm onSubmit={handleSubmit} />

          {/* Loading */}
          {loading && (
            <div className="mt-6 text-indigo-700 font-semibold text-center">
              ⏳ Predicting...
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-6 p-4 bg-green-100 rounded text-green-800 font-semibold text-center">
              Prediction: {result}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
