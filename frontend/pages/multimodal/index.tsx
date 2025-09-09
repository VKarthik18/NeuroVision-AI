import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import QuestionForm from "../../components/QuestionForm";
import { RnnAnswers, submitMultimodal } from "../../utils/api";

export default function Multimodal() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<RnnAnswers | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (answers: RnnAnswers) => {
    if (!selectedFile) {
      alert("Please upload an MRI scan file before submitting.");
      return;
    }
    setSelectedAnswers(answers);
    setLoading(true);
    setResult(null);

    try {
      const res = await submitMultimodal(selectedFile, answers);
      console.log("Server response:", res);
      setResult(res.final_predicted_stage);
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
        <title>NEUROVISION-AI | Multimodal Assessment</title>
        <meta
          name="description"
          content="Multimodal assessment for Alzheimer’s prediction using MRI + behavioral data."
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* HEADER */}
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
            Multimodal Assessment
          </h1>

          <p className="text-gray-600 mb-8 text-center">
            Upload your MRI scan and answer the questions below to predict Alzheimer’s stage.
          </p>

          {/* MRI Upload */}
<div className="mb-6">
  <label className="block font-medium mb-2 text-black">
    Upload MRI Scan (required)
  </label>

  <label className="flex items-center justify-center w-full p-3 bg-indigo-100 border-2 border-dashed border-indigo-400 rounded cursor-pointer hover:bg-indigo-200 transition">
    <span className="text-2xl mr-2">📤</span>
    <span className="text-black font-medium">Click to upload MRI</span>
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
    />
  </label>

  {selectedFile && (
    <div className="mt-2 text-gray-700 font-medium">📂 {selectedFile.name}</div>
  )}
</div>


          {/* Question Form */}
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
