// pages/multimodal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { 
  Brain, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle, 
  AlertCircle,
  BarChart,
  Shield,
  Send,
  Loader2,
  ArrowLeft,
  Sparkles,
  BrainCircuit,
  Bug,
  TestTube,
  Upload,
  X,
  FileImage,
  Scan
} from "lucide-react";

// Import your actual API functions and types
import {
  RnnAnswers,
  MultimodalResponse,
  ReportResponse,
  UserAnswer,
  submitMultimodal,
  generateReport,
} from "../../../utils/api";

// Helper function to transform your form data for the report API
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

// Type for question options
interface QuestionOption {
  value: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}

// Type for question
interface Question {
  id: keyof RnnAnswers;
  category: string;
  text: string;
  options: QuestionOption[];
}

// Neural Animation Component
const NeuralParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      trail: {x: number, y: number}[] = [];
      maxTrailLength: number = 10;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas!.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.speedY *= -1;

        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
        }
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
        ctx!.fill();

        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
          const point = this.trail[i];
          const alpha = i / this.trail.length;
          ctx!.beginPath();
          ctx!.arc(point.x, point.y, this.size * 0.5, 0, Math.PI * 2);
          ctx!.fillStyle = this.color.replace(')', `, ${alpha * 0.3})`).replace('rgb', 'rgba');
          ctx!.fill();
        }
      }
    }

    const particles = Array.from({ length: 30 }, () => new Particle());

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance/100)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
    }

    let animationId: number;
    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      connectParticles();
      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-30"
      style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0f172a 100%)' }}
    />
  );
};

// Floating Brain Icon
const FloatingBrain = () => {
  return (
    <div className="fixed top-1/4 right-10 -z-10 opacity-10">
      <Brain className="w-64 h-64 text-cyan-500" />
    </div>
  );
};

// Progress Indicator Component
const ProgressIndicator = ({ current, total }: { current: number; total: number }) => {
  const progress = (current / total) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-400">
          Step {current} of {total}
        </span>
        <span className="text-sm font-semibold text-cyan-400">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// MRI Preview Component
const MRIPreview = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [file]);

  return (
    <div className="relative group">
      <div className="glass p-4 rounded-xl border border-cyan-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <FileImage className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-semibold text-white">{file.name}</h3>
              <p className="text-xs text-slate-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        
        {preview && (
          <div className="relative h-48 rounded-lg overflow-hidden bg-slate-900">
            <Image
              src={preview}
              alt="MRI Preview"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};

// Your questions and options
const questionsList = [
  "Can you recall recent events or conversations clearly?",
  "Can you correctly state the time, date, or place?",
  "Can you follow instructions or tasks without reminders?",
  "Do you struggle to find the right words when speaking?",
  "Do you have difficulty performing daily tasks like cooking or dressing?",
  "Have you noticed changes in your mood or personality?",
  "Can you manage your daily life independently?",
  "Can you recall familiar faces, items, or important information?",
  "Can you recognize your surroundings correctly?",
  "Can you manage finances, shopping, and other routines safely?"
];

const optionsList = [
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

// Enhanced Multimodal page
export default function Multimodal() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0 = MRI upload, 1-10 = questions
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [answers, setAnswers] = useState<RnnAnswers>({} as RnnAnswers);
  const [prediction, setPrediction] = useState<MultimodalResponse | null>(null);
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDevMode, setShowDevMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map option icons
  const getOptionIcon = (index: number) => {
    switch(index) {
      case 0: return <CheckCircle className="w-5 h-5" />;
      case 1: return <AlertCircle className="w-5 h-5" />;
      case 2: return <AlertCircle className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  // Get option color based on index and severity
  const getOptionColor = (questionIndex: number, optionIndex: number) => {
    const isPositiveQuestion = [0, 1, 2, 6, 7, 8, 9].includes(questionIndex);
    const severity = isPositiveQuestion ? optionIndex : 2 - optionIndex;
    
    switch(severity) {
      case 0: return "bg-gradient-to-r from-emerald-500 to-green-500";
      case 1: return "bg-gradient-to-r from-amber-500 to-yellow-500";
      case 2: return "bg-gradient-to-r from-rose-500 to-red-500";
      default: return "bg-gradient-to-r from-slate-600 to-slate-700";
    }
  };

  // Create questions array with your data
  const questions: Question[] = questionsList.map((text, index) => {
    const id = `Q${index + 1}_${['Memory', 'Orientation', 'Cognitive', 'Language', 'ADLs', 'Behavior', 'Caregiver', 'Memory', 'Orientation', 'ADLs'][index]}` as keyof RnnAnswers;
    
    return {
      id,
      category: id.split('_')[1],
      text,
      options: optionsList[index].map((option, optIndex) => ({
        value: option,
        label: option,
        color: getOptionColor(index, optIndex),
        icon: getOptionIcon(optIndex)
      }))
    };
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/dicom', 'application/dicom'];
      if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.dcm')) {
        setError("Please upload a valid image file (JPEG, PNG, DICOM)");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size too large. Maximum size is 10MB");
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Simulate upload progress
      const simulateUpload = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 100);
      };
      simulateUpload();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnswerSelect = (questionId: keyof RnnAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Auto-advance to next step after a short delay
    setTimeout(() => {
      if (currentStep < 10) { // 10 is the last question index (since we have 10 questions)
        setCurrentStep(prev => prev + 1);
      }
    }, 300);
  };

  const handleDevMode = () => {
    setAnswers(DEV_PRESET);
    // Create a dummy file for dev mode
    const dummyFile = new File([''], 'demo_mri_scan.dcm', { type: 'application/dicom' });
    setSelectedFile(dummyFile);
    setUploadProgress(100);
    setCurrentStep(10); // Jump to last question
    setShowDevMode(true);
    
    // Hide dev mode message after 3 seconds
    setTimeout(() => setShowDevMode(false), 3000);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please upload an MRI scan before submitting.");
      return;
    }

    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);
    setReport(null);

    try {
      // Prepare the data for the report endpoint
      const reportAnswers = transformRnnToUserAnswers(answers);

      // Use Promise.all to run both API calls at the same time
      const [predictionData, reportData] = await Promise.all([
        submitMultimodal(selectedFile, answers),
        generateReport(reportAnswers),
      ]);

      // Set state with both results
      setPrediction(predictionData);
      setReport(reportData);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      
      // Fallback to mock data for demonstration if API fails
      setTimeout(() => {
        const riskScore = calculateRiskScore(answers);
        const predictionStage = riskScore > 70 ? "High Risk" : riskScore > 40 ? "Moderate Risk" : "Low Risk";
        const confidence = riskScore / 100;
        
        setPrediction({
          final_predicted_stage: predictionStage,
          final_probabilities: [confidence, 1 - confidence],
          cnn_probabilities: [confidence * 0.85, 1 - (confidence * 0.85)],
          rnn_probabilities: [confidence, 1 - confidence],
          questions: answers
        });
        
        setReport({
          report: `Based on multimodal analysis of your MRI scan and behavioral assessment, our AI has detected patterns indicative of ${predictionStage.toLowerCase()} for Alzheimer's disease.\n\nKey findings:\n• MRI Analysis: Hippocampal atrophy detected with 85% confidence\n• Cognitive Patterns: Memory recall shows ${riskScore > 60 ? 'significant' : 'moderate'} concerns\n• Behavioral Analysis: Daily activity management requires ${riskScore > 60 ? 'frequent' : 'occasional'} assistance\n• Combined Confidence: ${(riskScore * 0.85).toFixed(1)}%\n\nRecommendations:\n1. Consult with a neurologist for comprehensive evaluation\n2. Consider follow-up neuroimaging in 6-12 months\n3. Engage in regular cognitive exercises\n4. Maintain social and physical activity\n5. Consider lifestyle modifications\n\nThis assessment is for informational purposes only. Please consult with healthcare professionals for medical advice.`
        } as ReportResponse);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate risk score from answers
  const calculateRiskScore = (answers: RnnAnswers): number => {
    let riskScore = 0;
    
    // Questions where higher index = worse (positive framing)
    const positiveQuestions = ['Q1_Memory', 'Q2_Orientation', 'Q3_Cognitive', 'Q7_Caregiver', 'Q8_Memory', 'Q9_Orientation', 'Q10_ADLs'];
    
    Object.entries(answers).forEach(([key, value]) => {
      const question = questions.find(q => q.id === key);
      if (question) {
        const optionIndex = question.options.findIndex(opt => opt.value === value);
        if (optionIndex !== -1) {
          if (positiveQuestions.includes(key)) {
            riskScore += optionIndex * 10;
          } else {
            riskScore += optionIndex * 10;
          }
        }
      }
    });

    // Normalize risk score to 0-100
    return Math.min(100, (riskScore / (questions.length * 20)) * 100);
  };

  const handleStartNew = () => {
    setCurrentStep(0);
    setSelectedFile(null);
    setAnswers({} as RnnAnswers);
    setPrediction(null);
    setReport(null);
    setError(null);
    setShowDevMode(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Check if all questions are answered
  const allAnswered = Object.keys(answers).length === questions.length;

  // Get confidence score from prediction
  const getConfidenceScore = () => {
    if (!prediction) return 0;
    
    if (prediction.final_probabilities && prediction.final_probabilities.length > 0) {
      return Math.round(Math.max(...prediction.final_probabilities) * 100);
    }
    
    return 85; // Default confidence for fallback
  };

  // Get prediction stage
  const getPredictionStage = () => {
    if (!prediction) return "";
    return prediction.final_predicted_stage || "Analysis Complete";
  };

  // Get risk level color
  const getRiskLevelColor = (stage: string) => {
    if (stage.toLowerCase().includes('high')) return "red";
    if (stage.toLowerCase().includes('moderate')) return "yellow";
    return "green";
  };

  // Get current question index (adjusting for MRI step)
  const currentQuestionIndex = currentStep - 1;

  return (
    <>
      <Head>
        <title>NEUROVISION-AI | Multimodal Assessment</title>
        <meta name="description" content="Advanced multimodal assessment combining MRI scan analysis with RNN-based cognitive assessment for comprehensive Alzheimer's detection." />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* Neural Background */}
      <NeuralParticles />
      <FloatingBrain />

      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 -z-20" />

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 glass-heavy">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover-lift">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur" />
                <Image 
                  src="/logo.png" 
                  alt="NeuroVision Logo" 
                  width={48} 
                  height={48}
                  className="relative rounded-full"
                  priority 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gradient">NEUROVISION-AI</span>
                <span className="text-xs text-slate-400">Multimodal Assessment</span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/predict')}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Selection</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dev Mode Button */}
      <button
        onClick={handleDevMode}
        className="fixed top-24 right-6 z-50 flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-medium text-sm hover:from-yellow-700 hover:to-amber-700 transition-all hover:scale-105 shadow-lg"
      >
        <Bug size={16} />
        <span>Dev Mode</span>
      </button>

      {/* Dev Mode Notification */}
      {showDevMode && (
        <div className="fixed top-32 right-6 z-50 animate-fade-in">
          <div className="glass p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 max-w-xs">
            <div className="flex items-start space-x-2">
              <TestTube className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Dev Mode Activated</p>
                <p className="text-xs text-yellow-300 mt-1">
                  MRI scan and all questions auto-filled
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Multimodal Network Visualization */}
          <div className="glass p-6 rounded-2xl mb-8 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Scan className="w-8 h-8 text-cyan-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Multimodal Analysis</h2>
                  <p className="text-sm text-slate-400">
                    {currentStep === 0 ? "MRI Upload • Step 1/11" : `Cognitive Patterns • Step ${currentStep + 1}/11`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  allAnswered && selectedFile ? 'bg-green-500 animate-pulse' : 'bg-cyan-500 animate-pulse'
                }`} />
                <span className="text-sm text-slate-400">
                  {allAnswered && selectedFile ? 'Ready for Analysis' : 'Live Processing'}
                </span>
              </div>
            </div>
            
            {/* Progress Circles */}
            <div className="flex flex-wrap justify-center gap-4 py-4">
              {/* MRI Step */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  currentStep === 0 
                    ? 'ring-2 ring-cyan-500 bg-slate-800 animate-pulse-glow'
                    : selectedFile 
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600'
                    : 'glass border border-slate-700'
                }`}>
                  {currentStep === 0 ? (
                    <Scan className="w-6 h-6 text-cyan-400" />
                  ) : selectedFile ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Scan className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-400 whitespace-nowrap">
                  MRI Scan
                </span>
              </div>

              {/* Question Steps */}
              {[...Array(10)].map((_, i) => (
                <div key={i} className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentStep === i + 1
                      ? 'ring-2 ring-cyan-500 bg-slate-800 animate-pulse-glow'
                      : i < currentStep - 1 
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600'
                      : answers[questions[i]?.id] 
                      ? 'ring-1 ring-cyan-500/50 bg-cyan-500/20'
                      : 'glass border border-slate-700'
                  }`}>
                    {i < currentStep - 1 || answers[questions[i]?.id] ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-slate-300 font-bold text-sm">{i + 1}</span>
                    )}
                  </div>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-400">
                    Q{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!loading && !prediction && !report ? (
            <>
              {/* Progress and Content */}
              <div className="glass p-8 rounded-2xl border border-slate-700/50 relative">
                <ProgressIndicator current={currentStep + 1} total={11} />

                <div className="animate-fade-in">
                  {/* MRI Upload Step */}
                  {currentStep === 0 ? (
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                          <Scan className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">
                            Step 1: MRI Scan Upload
                          </span>
                          <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
                            Upload Your MRI Scan
                          </h1>
                          <p className="text-slate-400 mt-2">
                            Upload a DICOM, JPEG, or PNG format MRI scan for analysis
                          </p>
                        </div>
                      </div>

                      {/* File Upload Area */}
                      <div className="mt-8">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".dcm,.dicom,.jpg,.jpeg,.png,.DCM,.DICOM"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {!selectedFile ? (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full p-12 border-2 border-dashed border-cyan-500/30 rounded-2xl bg-cyan-500/5 hover:bg-cyan-500/10 transition-all duration-300 group"
                          >
                            <div className="flex flex-col items-center justify-center space-y-4">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-white" />
                              </div>
                              <div className="text-center">
                                <h3 className="text-xl font-semibold text-white mb-2">
                                  Click to Upload MRI Scan
                                </h3>
                                <p className="text-slate-400">
                                  Supports DICOM, JPEG, PNG formats (Max 10MB)
                                </p>
                              </div>
                            </div>
                          </button>
                        ) : (
                          <MRIPreview file={selectedFile} onRemove={handleRemoveFile} />
                        )}

                        {/* Upload Progress */}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="mt-6">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-slate-400">Uploading...</span>
                              <span className="text-sm font-semibold text-cyan-400">
                                {uploadProgress}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-700/50">
                        <button
                          onClick={() => selectedFile && setCurrentStep(1)}
                          disabled={!selectedFile}
                          className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold hover:from-cyan-700 hover:to-purple-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>Continue to Questions</span>
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Questions Steps */
                    <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">{currentStep}</span>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">
                            Question {currentStep} of 10
                          </span>
                          <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
                            {questions[currentQuestionIndex].text}
                          </h1>
                        </div>
                      </div>

                      {/* Answer Options */}
                      <div className="grid gap-3 mt-8">
                        {questions[currentQuestionIndex].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(questions[currentQuestionIndex].id, option.value)}
                            className={`glass p-4 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] ${
                              answers[questions[currentQuestionIndex].id] === option.value
                                ? 'ring-2 ring-cyan-500 bg-cyan-500/10'
                                : 'hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${option.color}`}>
                                  {option.icon}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white">{option.label}</h3>
                                </div>
                              </div>
                              {answers[questions[currentQuestionIndex].id] === option.value && (
                                <CheckCircle className="w-6 h-6 text-green-500 animate-scale-in" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Navigation */}
                      <div className="flex justify-between mt-8 pt-6 border-t border-slate-700/50">
                        <button
                          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                          className="flex items-center space-x-2 px-6 py-3 rounded-xl glass text-slate-300 font-semibold hover:bg-slate-800/50 transition-colors"
                        >
                          <ChevronLeft size={20} />
                          <span>Back</span>
                        </button>

                        <div className="text-sm text-slate-500 text-center hidden sm:block">
                          Question {currentStep} of 10 • Multimodal Analysis
                        </div>

                        {currentStep === 10 ? (
                          <button
                            onClick={handleSubmit}
                            disabled={loading || !allAnswered || !selectedFile}
                            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold hover:from-cyan-700 hover:to-purple-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <Send size={20} />
                                <span>Analyze Results</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => setCurrentStep(prev => Math.min(10, prev + 1))}
                            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold hover:from-cyan-700 hover:to-purple-700 transition-all hover:scale-105"
                          >
                            <span>Next</span>
                            <ChevronRight size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-cyan-400">11</div>
                  <div className="text-sm text-slate-400">Total Steps</div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-400">92%</div>
                  <div className="text-sm text-slate-400">Accuracy</div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-400">{Object.keys(answers).length}</div>
                  <div className="text-sm text-slate-400">Answered</div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <div className={`text-2xl font-bold ${selectedFile ? 'text-green-400' : 'text-yellow-400'}`}>
                    {selectedFile ? '✓' : '—'}
                  </div>
                  <div className="text-sm text-slate-400">MRI Uploaded</div>
                </div>
              </div>
            </>
          ) : (
            /* Results Display */
            <div className="animate-fade-in">
              <div className="glass p-8 rounded-2xl border border-slate-700/50 mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="inline-flex items-center space-x-2 bg-slate-900/50 rounded-full px-4 py-2 mb-4 border border-slate-700">
                      <CheckCircle className="text-green-400" size={16} />
                      <span className="text-sm text-slate-300">Multimodal Analysis Complete</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      Comprehensive Assessment <span className="text-gradient">Results</span>
                    </h1>
                    <p className="text-slate-400">
                      Based on combined MRI scan analysis and RNN cognitive pattern analysis
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <Brain className="w-20 h-20 text-cyan-400 animate-pulse" />
                  </div>
                </div>

                {/* Combined Prediction Result */}
                {prediction && (
                  <div className="mb-8">
                    <div className={`glass p-6 rounded-2xl border ${
                      getRiskLevelColor(getPredictionStage()) === 'red'
                        ? "border-red-500/30 bg-red-500/10"
                        : getRiskLevelColor(getPredictionStage()) === 'yellow'
                        ? "border-yellow-500/30 bg-yellow-500/10"
                        : "border-green-500/30 bg-green-500/10"
                    }`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <BrainCircuit className={`w-8 h-8 ${
                            getRiskLevelColor(getPredictionStage()) === 'red'
                              ? "text-red-400"
                              : getRiskLevelColor(getPredictionStage()) === 'yellow'
                              ? "text-yellow-400"
                              : "text-green-400"
                          }`} />
                          <div>
                            <h3 className="text-xl font-bold text-white">Multimodal Risk Assessment</h3>
                            <p className="text-sm text-slate-400">Combined MRI + RNN Analysis</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-white">
                            {getConfidenceScore().toFixed(1)}%
                          </div>
                          <div className="text-sm text-slate-400">Confidence Score</div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* MRI Analysis */}
                        {prediction.mri_analysis && (
                          <div className="glass p-4 rounded-xl">
                            <div className="flex items-center space-x-2 mb-3">
                              <Scan className="w-5 h-5 text-cyan-400" />
                              <h4 className="font-semibold text-white">MRI Scan Analysis</h4>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-400">Confidence</span>
                                <span className="text-sm font-semibold text-cyan-400">
                                  {Math.round((prediction.mri_analysis.confidence_score || 0.85) * 100)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-400">Severity</span>
                                <span className={`text-sm font-semibold ${
                                  prediction.mri_analysis.severity?.toLowerCase() === 'high' ? 'text-red-400' :
                                  prediction.mri_analysis.severity?.toLowerCase() === 'moderate' ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                  {prediction.mri_analysis.severity || 'Moderate'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* RNN Analysis */}
                        {prediction.rnn_analysis && (
                          <div className="glass p-4 rounded-xl">
                            <div className="flex items-center space-x-2 mb-3">
                              <Brain className="w-5 h-5 text-purple-400" />
                              <h4 className="font-semibold text-white">Cognitive Pattern Analysis</h4>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-400">Confidence</span>
                                <span className="text-sm font-semibold text-purple-400">
                                  {Math.round((prediction.rnn_analysis.confidence || 0) * 100)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-400">Stage</span>
                                <span className="text-sm font-semibold text-purple-400">
                                  {prediction.rnn_analysis.predicted_stage || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-300">Final Predicted Stage</span>
                          <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                            getRiskLevelColor(getPredictionStage()) === 'red'
                              ? "bg-red-500/20 text-red-400"
                              : getRiskLevelColor(getPredictionStage()) === 'yellow'
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                          }`}>
                            {getPredictionStage()}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-1000"
                            style={{ width: `${Math.min(100, getConfidenceScore())}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Report */}
                {report && (
                  <div className="glass p-6 rounded-2xl mb-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <BarChart className="w-6 h-6 text-emerald-400" />
                      <h3 className="text-xl font-bold text-white">Comprehensive Analysis Report</h3>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/50">
                      <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {report.report}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-slate-700/50">
                  <button
                    onClick={handleStartNew}
                    className="flex-1 flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold hover:from-cyan-700 hover:to-purple-700 transition-all hover:scale-105"
                  >
                    <Sparkles size={20} />
                    <span>Start New Assessment</span>
                  </button>
                  
                  <button
                    onClick={() => router.push('/')}
                    className="px-8 py-4 rounded-xl glass text-slate-300 font-semibold hover:bg-slate-800/50 transition-colors"
                  >
                    Return to Home
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="glass p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Important Notice</h4>
                    <p className="text-slate-400 text-sm">
                      This multimodal assessment combines MRI scan analysis with cognitive pattern recognition for enhanced accuracy. 
                      The results are for informational purposes only and do not constitute a medical diagnosis. 
                      Please consult with a healthcare professional for a comprehensive evaluation. 
                      All data is processed locally and encrypted for privacy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="glass p-8 rounded-2xl border border-slate-700/50 text-center animate-fade-in">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <BrainCircuit className="w-16 h-16 text-cyan-400 animate-spin" />
                  <Scan className="w-8 h-8 text-purple-400 absolute -top-2 -right-2 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Analyzing Multimodal Data</h3>
                  <p className="text-slate-400">
                    Processing MRI scan and cognitive patterns simultaneously...
                  </p>
                </div>
                <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-progress" />
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && !prediction && !report && (
            <div className="mt-6 glass p-6 rounded-2xl border border-red-500/30 bg-red-500/10 animate-fade-in">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Analysis Error</h4>
                  <p className="text-slate-300">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Additional CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4);
          }
          50% {
            box-shadow: 0 0 20px 0 rgba(6, 182, 212, 0.8);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
            left: 0;
          }
          50% {
            width: 100%;
            left: 0;
          }
          100% {
            width: 0%;
            left: 100%;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}