import { useRouter } from "next/router";

export default function Predict() {
  const router = useRouter();

  const handleAnswer = (hasMRI: boolean) => {
    if (hasMRI) {
      router.push("/multimodal");
    } else {
      router.push("/rnn");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Do you have an MRI scan report?</h1>
      <div className="space-x-4">
        <button onClick={() => handleAnswer(true)} className="btn-primary">Yes</button>
        <button onClick={() => handleAnswer(false)} className="btn-secondary">No</button>
      </div>
    </div>
  );
}
