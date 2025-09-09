import { useState } from "react";
import { RnnAnswers } from "../utils/api"; // import the type

interface QuestionFormProps {
  onSubmit: (answers: RnnAnswers) => void;
}

// User-friendly questions
const questions = [
  "How often do you forget recent events or conversations?",  
  "Do you sometimes get confused about time, date, or place?", 
  "Do you find it difficult to plan or solve problems?",        
  "Do you struggle to find the right words when speaking?",      
  "Do you have difficulty performing daily tasks like cooking or dressing?", 
  "Have you noticed changes in your mood or personality?",       
  "Do you feel you need assistance from others to manage daily life?", 
  "Do you often misplace items or forget names of familiar people?", 
  "Do you get lost in familiar places?",                         
  "Do you have trouble managing finances, shopping, or other routines?" 
];

// Dev mode preset answers
const DEV_PRESET: RnnAnswers = {
  Q1_Memory: "Yes, clearly",
  Q2_Orientation: "Yes",
  Q3_Cognitive: "Yes",
  Q4_Language: "Rarely",
  Q5_ADLs: "Independent",
  Q6_Behavior: "Rarely",
  Q7_Caregiver: "Yes",
  Q8_Memory: "Yes, all",
  Q9_Orientation: "Yes",
  Q10_ADLs: "Always"
};

// Options for each question
const options = [
  ["Yes, clearly", "Somewhat, not sure", "No, cannot recall"], 
  ["Yes", "Approximate but not exact", "No idea"],              
  ["Yes", "Need reminders", "Cannot follow"],                  
  ["Rarely", "Sometimes", "Frequently"],                       
  ["Independent", "Need some help", "Fully dependent"],        
  ["Rarely", "Sometimes", "Frequently"],                       
  ["Yes", "Only for short time", "Not safe at all"],           
  ["Yes, all", "Sometimes forget", "Rarely/never"],            
  ["Yes", "Somewhat confused", "Not at all"],                  
  ["Always", "Sometimes forget", "Always need reminders"]      
];

export default function QuestionForm({ onSubmit }: QuestionFormProps) {
  const [answers, setAnswers] = useState<RnnAnswers>({
    Q1_Memory: "",
    Q2_Orientation: "",
    Q3_Cognitive: "",
    Q4_Language: "",
    Q5_ADLs: "",
    Q6_Behavior: "",
    Q7_Caregiver: "",
    Q8_Memory: "",
    Q9_Orientation: "",
    Q10_ADLs: ""
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
    {/* Question text in black */}
    <label className="font-medium mb-1 text-black">{questions[idx]}</label>

    {/* Dropdown with black text */}
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


      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
}
