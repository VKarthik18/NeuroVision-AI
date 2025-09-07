import { useState } from "react";
import { submitMultimodal } from "../utils/api";


export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(0));
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!file) return alert("Please upload MRI scan.");
    // answers is an array, but submitMultimodal expects RnnAnswers object
    // Map answers array to RnnAnswers keys
    const rnnAnswers = {
      Q1_Memory: answers[0].toString(),
      Q2_Orientation: answers[1].toString(),
      Q3_Cognitive: answers[2].toString(),
      Q4_Language: answers[3].toString(),
      Q5_ADLs: answers[4].toString(),
      Q6_Behavior: answers[5].toString(),
      Q7_Caregiver: answers[6].toString(),
      Q8_Memory: answers[7].toString(),
      Q9_Orientation: answers[8].toString(),
      Q10_ADLs: answers[9].toString(),
    };

    try {
      const res = await submitMultimodal(file, rnnAnswers);
      setResult(res.final_predicted_stage);
    } catch (err) {
      setResult("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <input type="file" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
      {/* Render dropdowns for 10 questions */}
      {answers.map((a, idx) => (
        <select key={idx} onChange={(e) => {
          const newAnswers = [...answers]; 
          newAnswers[idx] = parseInt(e.target.value); 
          setAnswers(newAnswers);
        }}>
          <option value={0}>Select answer</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      ))}
      <button onClick={handleSubmit} className="btn-primary">Predict</button>

      {result && <div className="mt-4 p-4 bg-green-100 rounded">{result}</div>}
    </div>
  );
}
