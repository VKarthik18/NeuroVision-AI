import { useState } from "react";
import { RnnAnswers } from "../utils/api"; // import the type

// 1. UPDATE THIS INTERFACE to accept the isLoading prop
interface QuestionFormProps {
  onSubmit: (answers: RnnAnswers) => void;
  isLoading: boolean; // This line is added
}

// User-friendly questions (no changes here)
const questions = [
  "Can you recall recent events or conversations clearly?", "Can you correctly state the time, date, or place?", "Can you follow instructions or tasks without reminders?", "Do you struggle to find the right words when speaking?", "Do you have difficulty performing daily tasks like cooking or dressing?", "Have you noticed changes in your mood or personality?", "Can you manage your daily life independently?", "Can you recall familiar faces, items, or important information?", "Can you recognize your surroundings correctly?", "Can you manage finances, shopping, and other routines safely?"
];

// Dev mode preset answers (no changes here)
const DEV_PRESET: RnnAnswers = {
  Q1_Memory: "Yes, clearly", Q2_Orientation: "Yes", Q3_Cognitive: "Yes",
  Q4_Language: "Rarely", Q5_ADLs: "Independent", Q6_Behavior: "Rarely",
  Q7_Caregiver: "Yes", Q8_Memory: "Yes, all", Q9_Orientation: "Yes",
  Q10_ADLs: "Always"
};

// Options for each question (no changes here)
const options = [
  ["Yes, clearly", "Somewhat, not sure", "No, cannot recall"], ["Yes", "Approximate but not exact", "No idea"], ["Yes", "Need reminders", "Cannot follow"], ["Rarely", "Sometimes", "Frequently"], ["Independent", "Need some help", "Fully dependent"], ["Rarely", "Sometimes", "Frequently"], ["Yes", "Only for short time", "Not safe at all"], ["Yes, all", "Sometimes forget", "Rarely/never"], ["Yes", "Somewhat confused", "Not at all"], ["Always", "Sometimes forget", "Always need reminders"]
];

// 2. UPDATE THE COMPONENT SIGNATURE to receive isLoading as a prop
export default function QuestionForm({ onSubmit, isLoading }: QuestionFormProps) {
  const [answers, setAnswers] = useState<RnnAnswers>({
    Q1_Memory: "", Q2_Orientation: "", Q3_Cognitive: "", Q4_Language: "",
    Q5_ADLs: "", Q6_Behavior: "", Q7_Caregiver: "", Q8_Memory: "",
    Q9_Orientation: "", Q10_ADLs: ""
  });

  const handleChange = (key: keyof RnnAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleDevMode = () => {
    setAnswers(DEV_PRESET);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  const keys = Object.keys(answers) as (keyof RnnAnswers)[];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-md mx-auto">
      <button
        type="button"
        onClick={handleDevMode}
        className="bg-gray-600 text-white py-1 px-2 rounded hover:bg-gray-700 mb-4"
      >
        Dev Mode: Auto Fill
      </button>

      {keys.map((key, idx) => (
        <div key={key} className="flex flex-col">
          <label className="font-medium mb-1 text-black">{questions[idx]}</label>
          <select
            value={answers[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="border rounded p-2 text-black"
            required
          >
            <option value="" className="text-gray-500">Select answer</option>
            {options[idx].map((opt) => (
              <option key={opt} value={opt} className="text-black">
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* 3. USE THE isLoading PROP to disable the button and change its text */}
      <button 
        type="submit" 
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Submit'}
      </button>
    </form>
  );
}
