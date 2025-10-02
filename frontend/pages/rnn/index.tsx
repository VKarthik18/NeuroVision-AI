import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import QuestionForm from "../../components/QuestionForm";

// ADDED: Import the new functions and types
import {
  RnnAnswers,
  RnnResponse,
  ReportResponse,
  UserAnswer,
  submitRNN,
  generateReport,
} from "../../utils/api";

// ADDED: Helper function to transform your form data for the report API
const transformRnnToUserAnswers = (answers: RnnAnswers): UserAnswer[] => {
  const keyMap: { [key in keyof RnnAnswers]: string } = {
    Q1_Memory: "q1", Q2_Orientation: "q2", Q3_Cognitive: "q3", Q4_Language: "q4",
    Q5_ADLs: "q5", Q6_Behavior: "q6", Q7_Caregiver: "q7", Q8_Memory: "q8",
    Q9_Orientation: "q9", Q10_ADLs: "q10",
  };
  return Object.entries(answers).map(([key, value]) => ({
    qId: keyMap[key as keyof RnnAnswers],
    answer: value,
  }));
};

export default function Behavioral() {
  const router = useRouter(); // ADDED: To allow starting a new assessment
  const [darkMode, setDarkMode] = useState(false);
  
  // UPDATED: State variables to hold both results and handle errors
  const [prediction, setPrediction] = useState<RnnResponse | null>(null);
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  // UPDATED: The handleSubmit function to call both APIs concurrently
  const handleSubmit = async (answers: RnnAnswers) => {
    setLoading(true);
    setError(null);
    setPrediction(null);
    setReport(null);

    try {
      // Prepare the data for the report endpoint
      const reportAnswers = transformRnnToUserAnswers(answers);

      // Use Promise.all to run both API calls at the same time
      const [predictionData, reportData] = await Promise.all([
        submitRNN(answers),
        generateReport(reportAnswers),
      ]);

      // Set state with both results
      setPrediction(predictionData);
      setReport(reportData);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>NEUROVISION-AI | Behavioral Assessment</title>
        <meta name="description" content="Behavioral assessment for Alzheimer’s prediction."/>
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* NAVBAR */}
      <header className="bg-indigo-700 text-white shadow-md">
        {/* Your header JSX... */}
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-r from-indigo-100 via-white to-indigo-50 font-sans px-4 py-8">
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-2xl w-full">
          
          {/* UPDATED: This logic now decides whether to show the form or the results */}
          {!loading && !prediction && !report ? (
            <>
              <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
              Behavioral Assessment
              </h1>
              <p className="text-gray-600 mb-8 text-center">
              Answer the following questions for a prediction and detailed analysis.
              </p>
              {/* Pass loading state as isLoading prop if required by QuestionForm */}
              <QuestionForm onSubmit={handleSubmit} isLoading={loading} />
            </>
          ) : (
            // ADDED: This is the new results display area
            <div className="results-container">
              <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
                Analysis Complete
              </h1>
              
              {prediction && (
                <div className="mt-6 p-4 bg-green-100 rounded text-green-800 font-semibold text-center">
                  Prediction: {prediction.predicted_stage}
                </div>
              )}

              {report && (
                 <div className="report-result mt-4 p-6 border rounded-lg shadow-inner bg-gray-50 text-left" style={{ whiteSpace: 'pre-wrap' }}>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Detailed Analysis Report</h2>
                    <p className="text-gray-700">{report.report}</p>
                 </div>
              )}

              <button
                onClick={() => router.reload()}
                className="w-full mt-8 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                Start New Assessment
              </button>
            </div>
          )}

          {/* Loading and Error states are handled outside the main conditional for better UX */}
          {loading && <div className="mt-6 text-indigo-700 font-semibold text-center">⏳ Analyzing...</div>}
          {error && <div className="mt-6 p-4 bg-red-100 rounded text-red-800 font-semibold text-center">Error: {error}</div>}

        </div>
      </div>
    </>
  );
}