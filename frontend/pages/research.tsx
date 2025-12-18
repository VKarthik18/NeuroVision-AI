// pages/research.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { 
  Brain, 
  FileText, 
  Users, 
  BarChart3,
  Cpu,
  Zap,
  CheckCircle,
  Award,
  TrendingUp,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Mail,
  University,
  Download,
  Share2,
  Quote
} from "lucide-react";

// Neural Animation Component (same as your other pages)
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
      <Brain className="w-64 h-64 text-purple-500" />
    </div>
  );
};

// Collapsible Section Component
const CollapsibleSection = ({ 
  title, 
  children,
  defaultOpen = false 
}: { 
  title: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="glass p-6 rounded-2xl border border-slate-700/50 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-6 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

// Author Card Component
const AuthorCard = ({ 
  name, 
  role, 
  affiliation, 
  email 
}: { 
  name: string; 
  role: string; 
  affiliation: string; 
  email: string;
}) => {
  return (
    <div className="glass p-4 rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-white">{name}</h4>
          <p className="text-sm text-purple-400">{role}</p>
          <p className="text-sm text-slate-400 mt-1">{affiliation}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <a 
              href={`mailto:${email}`}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ 
  value, 
  label, 
  description,
  icon: Icon 
}: { 
  value: string; 
  label: string; 
  description: string;
  icon: React.ElementType;
}) => {
  return (
    <div className="glass p-6 rounded-2xl border border-slate-700/50">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <div className="text-3xl font-bold text-gradient">{value}</div>
          <div className="text-sm text-slate-400">{label}</div>
        </div>
      </div>
      <p className="text-slate-300 text-sm">{description}</p>
    </div>
  );
};

export default function ResearchPage() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "abstract", "authors", "results"
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isSectionOpen = (section: string) => expandedSections.includes(section);

  return (
    <>
      <Head>
        <title>NEUROVISION-AI | Research Publications</title>
        <meta name="description" content="Research publications and scientific papers on Alzheimer's detection using multimodal deep learning" />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* Neural Background */}
      <NeuralParticles />
      <FloatingBrain />

      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 -z-20" />

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 glass-heavy">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover-lift">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur" />
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
                <span className="text-xs text-slate-400">Research & Publications</span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Paper Header */}
          <div className="glass p-8 rounded-2xl border border-purple-500/20 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center space-x-2 bg-purple-500/10 rounded-full px-4 py-2 mb-4 border border-purple-500/30">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">IEEE Conference Paper</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  NEUROVISION-AI: Alzheimer's Disease Detection Using Multimodal Deep Learning
                </h1>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-sm border border-purple-500/20">
                    Deep Learning
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-500/20">
                    Medical AI
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/20">
                    Healthcare
                  </span>
                  <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-sm border border-yellow-500/20">
                    Neurology
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl glass text-slate-300 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700 transition-all">
                  <Share2 className="w-4 h-4" />
                  <span>Cite Paper</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              value="99%"
              label="Accuracy"
              description="Validation accuracy achieved by our hybrid CNN-RNN model"
              icon={Award}
            />
            <MetricCard
              value="4-Stage"
              label="Classification"
              description="Detects Normal, Mild, Moderate, and Severe stages"
              icon={BarChart3}
            />
            <MetricCard
              value="CNN+RNN"
              label="Hybrid Architecture"
              description="Combines spatial (MRI) and temporal (cognitive) analysis"
              icon={Cpu}
            />
            <MetricCard
              value="0.99 AUC"
              label="Performance"
              description="Area under the curve for robust disease detection"
              icon={TrendingUp}
            />
          </div>

          {/* Abstract Section */}
          <CollapsibleSection title="Abstract" defaultOpen={true}>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border-l-4 border-purple-500">
                <Quote className="w-6 h-6 text-purple-400 mb-2" />
                <p className="text-slate-300">
                  Early and accurate detection of Alzheimer's Disease (AD) is critical for effective intervention, 
                  a task where traditional methods often fall short. This paper presents a multimodal deep learning 
                  framework to address this diagnostic challenge.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl glass border border-slate-700/50">
                  <h4 className="font-bold text-white mb-2">Problem Statement</h4>
                  <p className="text-sm text-slate-300">
                    Traditional diagnostic protocols often fail to provide definitive diagnosis until the disease 
                    has advanced, limiting intervention effectiveness.
                  </p>
                </div>
                <div className="p-4 rounded-xl glass border border-slate-700/50">
                  <h4 className="font-bold text-white mb-2">Solution</h4>
                  <p className="text-sm text-slate-300">
                    Hybrid CNN-RNN architecture combining spatial MRI features with temporal cognitive patterns 
                    for comprehensive AD staging.
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Authors Section */}
          <CollapsibleSection title="Research Team" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AuthorCard
                name="Dr. R. Priyadarshini"
                role="Principal Investigator"
                affiliation="Siddartha Institute of Science and Technology"
                email=""
              />
              <AuthorCard
                name="A Chandhana"
                role="Research Scholar"
                affiliation="Dept. of CSM, SIST"
                email="arungolamchandhana@gmail.com"
              />
              <AuthorCard
                name="Vidyala Karthik"
                role="Research Scholar"
                affiliation="Dept. of CSM, SIST"
                email="karthikvidyala@gmail.com"
              />
              <AuthorCard
                name="Avula Hemanth Kumar Reddy"
                role="Research Scholar"
                affiliation="Dept. of CSM, SIST"
                email="hemanthavula29@gmail.com"
              />
              <AuthorCard
                name="Tholeti Keerthana Reddy"
                role="Research Scholar"
                affiliation="Dept. of CSM, SIST"
                email="keerthanareddytholeti15@gmail.com"
              />
              <AuthorCard
                name="Kasanna Gari Guru Venkat Sai"
                role="Research Scholar"
                affiliation="Dept. of CSM, SIST"
                email="royalguru16@gmail.com"
              />
            </div>
          </CollapsibleSection>

          {/* Architecture Section */}
          <CollapsibleSection title="System Architecture">
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-slate-900/50">
                <h4 className="font-bold text-white mb-4 text-center">CNN-RNN Hybrid Pipeline</h4>
                
                {/* Architecture Flow */}
                <div className="space-y-4">
                  {/* Data Input Row */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <div className="glass p-4 rounded-xl text-center min-w-[200px] border border-purple-500/30">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-2">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h5 className="font-bold text-white">MRI Input</h5>
                      <p className="text-xs text-slate-400">Preprocessed 3D brain scans</p>
                    </div>
                    
                    <div className="glass p-4 rounded-xl text-center min-w-[200px] border border-cyan-500/30">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-2">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <h5 className="font-bold text-white">Cognitive Data</h5>
                      <p className="text-xs text-slate-400">Behavioral assessment sequences</p>
                    </div>
                  </div>

                  {/* Processing Row */}
                  <div className="flex justify-center">
                    <div className="glass p-4 rounded-xl text-center min-w-[300px] border border-emerald-500/30">
                      <div className="flex items-center justify-center space-x-4 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Cpu className="w-5 h-5 text-purple-400" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <Cpu className="w-5 h-5 text-cyan-400" />
                        </div>
                      </div>
                      <h5 className="font-bold text-white">Dual Feature Extraction</h5>
                      <p className="text-xs text-slate-400">CNN + RNN parallel processing</p>
                    </div>
                  </div>

                  {/* Output Row */}
                  <div className="flex justify-center">
                    <div className="glass p-4 rounded-xl text-center min-w-[200px] border border-yellow-500/30">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <h5 className="font-bold text-white">4-Stage Classification</h5>
                      <p className="text-xs text-slate-400">Normal → Mild → Moderate → Severe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Results Section */}
          <CollapsibleSection title="Experimental Results" defaultOpen={true}>
            <div className="space-y-6">
              {/* Performance Comparison Table */}
              <div className="overflow-hidden rounded-xl border border-slate-700/50">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="p-4 text-left text-slate-300 font-semibold">Model</th>
                      <th className="p-4 text-left text-slate-300 font-semibold">Input Modality</th>
                      <th className="p-4 text-left text-slate-300 font-semibold">Accuracy</th>
                      <th className="p-4 text-left text-slate-300 font-semibold">F1-Score</th>
                      <th className="p-4 text-left text-slate-300 font-semibold">AUC</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-800">
                      <td className="p-4 text-slate-300">CNN (Baseline)</td>
                      <td className="p-4 text-slate-300">MRI Only</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-sm">
                          94%
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">0.92</td>
                      <td className="p-4 text-slate-300">0.95</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="p-4 text-slate-300">RNN (Baseline)</td>
                      <td className="p-4 text-slate-300">Cognitive Data Only</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-sm">
                          90%
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">0.89</td>
                      <td className="p-4 text-slate-300">0.91</td>
                    </tr>
                    <tr className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
                      <td className="p-4 font-bold text-white">Hybrid CNN-RNN (Proposed)</td>
                      <td className="p-4 font-bold text-white">MRI + Cognitive</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-sm">
                          99%
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white">0.98</td>
                      <td className="p-4 font-bold text-white">0.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Key Findings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl border border-emerald-500/30">
                  <h4 className="font-bold text-white mb-3">Key Achievements</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">99% validation accuracy on four-stage classification</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">5-9% improvement over single-modality baselines</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Minimal overfitting with aligned training/validation curves</span>
                    </li>
                  </ul>
                </div>

                <div className="glass p-6 rounded-2xl border border-cyan-500/30">
                  <h4 className="font-bold text-white mb-3">Clinical Impact</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Enables early intervention during Mild Cognitive Impairment (MCI) stage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Reduces diagnostic delay by detecting subtle patterns</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">Supports personalized treatment planning through staging</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* References Section */}
          <CollapsibleSection title="References & Citations">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-xs text-purple-400">16</span>
                </div>
                <span className="text-slate-300">Peer-reviewed publications referenced</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl glass border border-slate-700/50">
                  <h4 className="font-bold text-white mb-2">Key References</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">[1]</span>
                      <span>Ahmed et al., IEEE Journal of Biomedical and Health Informatics, 2023</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">[2]</span>
                      <span>S. Qiu et al., Nature Communications, 2022</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">[3]</span>
                      <span>M. Golovanevsky et al., Frontiers in Aging Neuroscience, 2022</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-xl glass border border-slate-700/50">
                  <h4 className="font-bold text-white mb-2">Citation Format</h4>
                  <div className="p-3 rounded-lg bg-slate-900/50">
                    <code className="text-sm text-slate-300">
                      R. Priyadarshini et al., "NEUROVISION-AI: Alzheimer's Disease Detection Using Multimodal Deep Learning," 
                      Siddartha Institute of Science and Technology, 2026.
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* CTA Section */}
          <div className="glass p-8 rounded-2xl border border-cyan-500/20 mt-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Try Our Live Implementation</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Experience the power of our research through our interactive assessment tools. 
              Test the same models described in this paper.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/predict/multimodal')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all hover:scale-105"
              >
                Multimodal Assessment
              </button>
              <button
                onClick={() => router.push('/predict/rnn')}
                className="px-6 py-3 rounded-xl glass text-slate-300 font-semibold hover:bg-slate-800/50 transition-colors"
              >
                RNN Cognitive Assessment
              </button>
            </div>
          </div>
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

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}