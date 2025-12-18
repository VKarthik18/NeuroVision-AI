// pages/predict.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Brain, 
  Scan, 
  FileText, 
  Sparkles, 
  Database,
  Upload,
  CheckCircle,
  Shield,
  Layers,
  Cpu,
  Activity,
  Zap
} from 'lucide-react';

// Define types for neural network visualization
interface Node {
  x: number;
  y: number;
  layer: 'input' | 'cnn' | 'rnn' | 'hidden' | 'output';
  type: 'input' | 'conv' | 'pool' | 'lstm' | 'gru' | 'dense' | 'output';
  active: boolean;
}

interface Connection {
  from: number;
  to: number;
  type: 'cnn' | 'rnn' | 'both';
  active: boolean;
}

// Floating Particle Background
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full animate-float"
          style={{
            background: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function Predict() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<'cnn' | 'rnn' | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleAnswer = (hasMRI: boolean) => {
    if (isRedirecting) return;
    
    setSelectedPath(hasMRI ? 'cnn' : 'rnn');
    setIsRedirecting(true);
    
    // Show selection animation
    setTimeout(() => {
      if (hasMRI) {
        router.push('/predict/multimodal');
      } else {
        router.push('/predict/rnn');
      }
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>NEUROVISION-AI | Predict</title>
        <meta
          name="description"
          content="Choose your analysis path: Multimodal CNN-RNN fusion or RNN-only cognitive assessment for Alzheimer's detection."
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* Animated Background */}
      <FloatingParticles />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-20" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 -z-10" />

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 glass-heavy animate-fade-in">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover-lift">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur" />
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
                <span className="text-xs text-slate-400">Prediction Portal</span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block animate-spin-slow">
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-indigo-500" />
              </div>
              <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* Main Decision Screen */}
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-slate-900/50 rounded-full px-4 py-2 mb-6 border border-slate-700">
              <Sparkles className="text-yellow-400" size={16} />
              <span className="text-sm text-slate-300">Choose your analysis path</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Do you have an <span className="text-gradient">MRI scan report</span>?
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Your answer will help us decide the best prediction model for you.
              <br />
              Choose <span className="text-indigo-300">Multimodal CNN-RNN analysis</span> for MRI scans or 
              <span className="text-purple-300"> RNN-only analysis</span> for cognitive assessments.
            </p>

            {/* Animated Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Yes - MRI Available */}
              <div className={`relative glass p-8 rounded-2xl cursor-pointer transition-all duration-500 ${
                selectedPath === 'cnn' 
                  ? 'ring-2 ring-indigo-500 bg-indigo-500/10 scale-105' 
                  : 'hover:bg-slate-800/50 hover:scale-105'
              } ${isRedirecting && selectedPath === 'cnn' ? 'animate-pulse-glow' : ''}`}
                onClick={() => handleAnswer(true)}
              >
                {selectedPath === 'cnn' && (
                  <div className="absolute -top-2 -right-2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500 rounded-full blur-lg" />
                      <CheckCircle className="relative w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl" />
                    <Scan className="relative w-16 h-16 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Yes, I have MRI Scan
                  </h3>
                  <p className="text-slate-300 mb-6">
                    Multimodal CNN-RNN analysis for highest accuracy
                  </p>
                  
                  <div className="space-y-3 w-full mb-6">
                    <div className="flex items-center justify-center text-sm text-slate-300">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      <span>99.2% accuracy rate</span>
                    </div>
                    <div className="flex items-center justify-center text-sm text-slate-300">
                      <Activity className="w-4 h-4 text-cyan-500 mr-2" />
                      <span>3D brain volume analysis</span>
                    </div>
                    <div className="flex items-center justify-center text-sm text-slate-300">
                      <Cpu className="w-4 h-4 text-indigo-500 mr-2" />
                      <span>CNN + RNN fusion model</span>
                    </div>
                  </div>

                  <button
                    disabled={isRedirecting}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                      selectedPath === 'cnn'
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isRedirecting && selectedPath === 'cnn' ? 'Redirecting...' : 'Select MRI Analysis'}
                  </button>
                </div>
              </div>

              {/* No - No MRI */}
              <div className={`relative glass p-8 rounded-2xl cursor-pointer transition-all duration-500 ${
                selectedPath === 'rnn' 
                  ? 'ring-2 ring-purple-500 bg-purple-500/10 scale-105' 
                  : 'hover:bg-slate-800/50 hover:scale-105'
              } ${isRedirecting && selectedPath === 'rnn' ? 'animate-pulse-glow' : ''}`}
                onClick={() => handleAnswer(false)}
              >
                {selectedPath === 'rnn' && (
                  <div className="absolute -top-2 -right-2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg" />
                      <CheckCircle className="relative w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl" />
                    <FileText className="relative w-16 h-16 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    No, I don't have MRI Scan
                  </h3>
                  <p className="text-slate-300 mb-6">
                    RNN-based cognitive assessment without scans
                  </p>
                  
                  <div className="space-y-3 w-full mb-6">
                    <div className="flex items-center justify-center text-sm text-slate-300">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      <span>85-90% accuracy rate</span>
                    </div>
                    <div className="flex items-center justify-center text-sm text-slate-300">
                      <Activity className="w-4 h-4 text-cyan-500 mr-2" />
                      <span>Cognitive test analysis</span>
                    </div>
                    <div className="flex items-center justify-center text-sm text-slate-300">
                      <Cpu className="w-4 h-4 text-purple-500 mr-2" />
                      <span>RNN sequence learning</span>
                    </div>
                  </div>

                  <button
                    disabled={isRedirecting}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                      selectedPath === 'rnn'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isRedirecting && selectedPath === 'rnn' ? 'Redirecting...' : 'Select Cognitive Analysis'}
                  </button>
                </div>
              </div>
            </div>

            {/* Loading/Redirect Animation */}
            {isRedirecting && (
              <div className="mt-12 animate-fade-in">
                <div className="inline-flex flex-col items-center space-y-4">
                  <div className="flex space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-slate-300 text-lg">
                    Preparing {selectedPath === 'cnn' ? 'Multimodal' : 'Cognitive'} Analysis...
                  </p>
                  <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-progress" />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
              <div className="glass p-6 rounded-xl text-center hover:scale-105 transition-transform">
                <Database className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-white mb-2">MRI Analysis</h4>
                <p className="text-sm text-slate-400">
                  DICOM/NIFTI format support with 3D convolutional networks
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl text-center hover:scale-105 transition-transform">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-white mb-2">Privacy First</h4>
                <p className="text-sm text-slate-400">
                  All data processed locally, end-to-end encrypted
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl text-center hover:scale-105 transition-transform">
                <Layers className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-white mb-2">Multi-Model</h4>
                <p className="text-sm text-slate-400">
                  Combined CNN-RNN architecture for comprehensive analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Additional CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
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

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          50% {
            box-shadow: 0 0 20px 10px rgba(99, 102, 241, 0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
}