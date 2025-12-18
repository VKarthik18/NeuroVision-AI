// pages/about.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { 
  Brain, 
  Target, 
  Eye, 
  Users,
  GraduationCap,
  MapPin,
  Heart,
  Shield,
  Globe,
  Award,
  TrendingUp,
  Lightbulb,
  Zap,
  ArrowRight,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Cpu,
  Network
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

// Value Card Component
const ValueCard = ({ 
  icon: Icon, 
  title, 
  description,
  color 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  color: string;
}) => {
  return (
    <div className="glass p-6 rounded-2xl border border-slate-700/50 hover:scale-[1.02] transition-all duration-300 group hover:border-purple-500/30">
      <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
};

// Timeline Item Component
const TimelineItem = ({ 
  year, 
  title, 
  description 
}: { 
  year: string; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="flex items-start space-x-6 mb-6">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center space-x-8">
          <span className="text-white font-bold space-x-8 mb-1">{year}</span>
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
        <p className="text-slate-300">{description}</p>
      </div>
    </div>
  );
};

export default function AboutPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>NEUROVISION-AI | About Our Mission</title>
        <meta name="description" content="Learn about our mission to revolutionize Alzheimer's detection using AI and our journey from Siddartha Institute of Science and Technology" />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* Neural Background */}
      <NeuralParticles />

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
                <span className="text-xs text-slate-400">About Our Mission</span>
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
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 rounded-full px-4 py-2 mb-6 border border-purple-500/30">
              <Heart className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Transforming Alzheimer's Detection</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pioneering the Future of <span className="text-gradient">Neurological Healthcare</span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              We're a passionate team from the Computer Science and Engineering Department at 
              Siddartha Institute of Science and Technology, revolutionizing Alzheimer's detection 
              through cutting-edge AI technology.
            </p>
          </div>

          

          {/* Mission & Vision Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Mission Card */}
            <div className="glass p-8 rounded-2xl border border-cyan-500/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-slate-300 text-lg mb-6">
                  To democratize early Alzheimer's detection by developing accessible, 
                  accurate, and affordable AI-powered diagnostic tools that empower 
                  healthcare providers worldwide.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckIcon />
                    </div>
                    <span className="text-slate-300">
                      Make early detection accessible to everyone, everywhere
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckIcon />
                    </div>
                    <span className="text-slate-300">
                      Reduce diagnosis time from months to minutes
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckIcon />
                    </div>
                    <span className="text-slate-300">
                      Achieve over 99% accuracy in four-stage classification
                    </span>
                  </div>
                </div>
              </div>
            </div>

                  <FloatingBrain />


            {/* Vision Card */}
            <div className="glass p-8 rounded-2xl border border-purple-500/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Our Vision</h2>
                </div>
                <p className="text-slate-300 text-lg mb-6">
                  To create a world where Alzheimer's disease is detected so early that 
                  interventions can preserve cognitive function and quality of life for 
                  millions worldwide.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckIcon />
                    </div>
                    <span className="text-slate-300">
                      Eliminate diagnostic delays that limit treatment effectiveness
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckIcon />
                    </div>
                    <span className="text-slate-300">
                      Enable personalized treatment plans through precise staging
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckIcon />
                    </div>
                    <span className="text-slate-300">
                      Build the global standard for AI-powered neurological diagnostics
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Institution Pride Section */}
          <div className="glass p-8 rounded-2xl border border-slate-700/50 mb-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <GraduationCap className="w-6 h-6 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
                      Academic Excellence
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Born in the Heart of Innovation at SIST
                  </h2>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300">Puttur, Andhra Pradesh</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-2">Department of CSE</h3>
                  <p className="text-slate-300">
                    Computer Science & Engineering department where cutting-edge research meets 
                    practical application in healthcare technology.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-2">Siddartha Institute</h3>
                  <p className="text-slate-300">
                    Premier institute fostering innovation, research excellence, and 
                    technological advancement in Southern India.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-2">Research Excellence</h3>
                  <p className="text-slate-300">
                    Dedicated research center focused on applying AI and machine learning 
                    to solve real-world healthcare challenges.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">From Classroom to Global Impact</h4>
                    <p className="text-slate-300">
                      What began as an academic research project in our CSE department has evolved into 
                      a comprehensive AI solution with the potential to transform Alzheimer's diagnostics 
                      worldwide. Our journey exemplifies how academic research can lead to tangible 
                      solutions for global healthcare challenges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">Our Core Values</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                The principles that guide every decision we make and every line of code we write
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ValueCard
                icon={Shield}
                title="Clinical Accuracy"
                description="Every model is rigorously validated to ensure medical-grade accuracy and reliability."
                color="bg-gradient-to-r from-emerald-500 to-green-500"
              />
              <ValueCard
                icon={Users}
                title="Patient-Centered"
                description="We prioritize patient outcomes and accessibility in all our developments."
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
              />
              <ValueCard
                icon={Lightbulb}
                title="Innovation"
                description="Pushing boundaries with novel AI architectures and multimodal approaches."
                color="bg-gradient-to-r from-amber-500 to-yellow-500"
              />
              <ValueCard
                icon={Globe}
                title="Global Impact"
                description="Building solutions that work across diverse populations and healthcare systems."
                color="bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          </div>

          {/* Our Journey Timeline */}
          <div className="glass p-8 rounded-2xl border border-slate-700/50 mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">Our Journey</h2>
              <p className="text-slate-400">From concept to cutting-edge solution</p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              
              <div className="space-y-12">
                <TimelineItem
                  year="Aug 2024"
                  title="Research Beginnings"
                  description="Initial research on AI applications in neurological disorders at SIST CSE Department"
                />
                <TimelineItem
                  year="Sep 2025"
                  title="Prototype Development"
                  description="First working prototype of CNN-RNN hybrid model for Alzheimer's detection"
                />
                <TimelineItem
                  year="Nov 2025"
                  title="Validation & Testing"
                  description="Achieved 99% accuracy in four-stage classification on validation datasets"
                />
                <TimelineItem
                  year="Dec 2025"
                  title="Platform Launch"
                  description="Public release of NeuroVision AI with multimodal and RNN assessment tools"
                />
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="glass p-8 rounded-2xl border border-cyan-500/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Whether you're a healthcare professional, researcher, or someone passionate about 
              advancing neurological care, there are many ways to get involved with NeuroVision AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/research')}
                className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all hover:scale-105"
              >
                <BookOpen className="w-5 h-5" />
                <span>Read Our Research</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/predict')}
                className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl glass text-slate-300 font-semibold hover:bg-slate-800/50 transition-colors"
              >
                <Cpu className="w-5 h-5" />
                <span>Try Our Assessment Tools</span>
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl border border-slate-700/50 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Research Inquiries</h3>
              <p className="text-slate-400 text-sm">research@neurovision-ai.org</p>
            </div>
            <div className="glass p-6 rounded-2xl border border-slate-700/50 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Academic Affiliation</h3>
              <p className="text-slate-400 text-sm">Dept. of CSE, SIST Puttur</p>
            </div>
            <div className="glass p-6 rounded-2xl border border-slate-700/50 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <Network className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Collaborations</h3>
              <p className="text-slate-400 text-sm">Open to research partnerships</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-slate-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image 
                src="/logo.png" 
                alt="NeuroVision Logo" 
                width={40} 
                height={40}
                className="rounded-full"
              />
              <div>
                <span className="text-xl font-bold text-gradient">NEUROVISION-AI</span>
                <p className="text-xs text-slate-400">SIST CSE Department Initiative</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                © 2024 NeuroVision AI Project | Department of Computer Science and Engineering<br />
                Siddartha Institute of Science and Technology, Puttur, Andhra Pradesh
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Additional CSS */}
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

        .text-gradient {
          background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </>
  );
}

// Helper component for check icons
const CheckIcon = () => (
  <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);