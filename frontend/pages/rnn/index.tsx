import { useState } from "react";
import QuestionForm from "../../components/QuestionForm";
import { RnnAnswers, submitRNN } from "../../utils/api";

export default function Behavioral() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (answers: RnnAnswers) => {
    try {
      setLoading(true);
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
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-xl font-bold mb-4">Behavioral Assessment</h1>

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
