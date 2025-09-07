import { useState } from "react";
import QuestionForm from "../../components/QuestionForm";
import { RnnAnswers, submitMultimodal } from "../../utils/api";

export default function Multimodal() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<RnnAnswers | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-xl font-bold mb-4">Multimodal Assessment</h1>

      <div className="mb-4">
        <label className="block font-medium mb-2">Upload MRI Scan (optional for multimodal)</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded w-full" />
        {selectedFile && <div className="mt-2 text-gray-700">Selected file: {selectedFile.name}</div>}
      </div>

      <QuestionForm onSubmit={handleSubmit} />

      {loading && <div className="mt-4 text-gray-600">Predicting...</div>}

      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded text-green-800 font-semibold">
          Prediction: {result}
        </div>
      )}
    </div>
  );
}
