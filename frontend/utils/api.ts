// utils/api.ts

// -----------------------------
// Interfaces
// -----------------------------

export interface RnnAnswers {
  Q1_Memory: string;
  Q2_Orientation: string;
  Q3_Cognitive: string;
  Q4_Language: string;
  Q5_ADLs: string;
  Q6_Behavior: string;
  Q7_Caregiver: string;
  Q8_Memory: string;
  Q9_Orientation: string;
  Q10_ADLs: string;
}

export interface RnnResponse {
  predicted_stage: string;
  probabilities: number[];
  questions: RnnAnswers;
}

export interface CnnResponse {
  predicted_stage: string;
  probabilities: number[];
}

export interface MultimodalResponse {
  final_predicted_stage: string;
  final_probabilities: number[];
  cnn_probabilities: number[];
  rnn_probabilities: number[];
  questions: RnnAnswers;
}

// -----------------------------
// API Config
// -----------------------------

// Use environment variable (fallback to localhost in dev)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL  ;

// -----------------------------
// API Calls
// -----------------------------

// RNN only
export async function submitRNN(data: RnnAnswers): Promise<RnnResponse> {
  const response = await fetch(`${BASE_URL}/rnn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return (await response.json()) as RnnResponse;
}

// CNN only
export async function submitCNN(file: File): Promise<CnnResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/cnn`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return (await response.json()) as CnnResponse;
}

// CNN + RNN (multimodal)
export async function submitMultimodal(
  file: File,
  data: RnnAnswers
): Promise<MultimodalResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_data", JSON.stringify(data));

  const response = await fetch(`${BASE_URL}/multimodal`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return (await response.json()) as MultimodalResponse;
}
// In utils/api.ts

// ... (keep all your existing interfaces) ...

// ADD THIS NEW INTERFACE for the report response
export interface ReportResponse {
  report: string;
}

// We'll also define the type for the array of answers our new endpoint needs
export interface UserAnswer {
  qId: string;
  answer: string;
}

// ... (keep your existing API Calls: submitRNN, submitCNN, submitMultimodal) ...


// ADD THIS NEW API CALL FUNCTION for the report
export async function generateReport(
  data: UserAnswer[]
): Promise<ReportResponse> {
  const response = await fetch(`${BASE_URL}/generate-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // The Python backend expects the data inside an "answers" key
    body: JSON.stringify({ answers: data }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return (await response.json()) as ReportResponse;
}