// pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Brain, Shield, Zap, Users, ChevronRight, BarChart, Cpu, Activity, Menu, X } from "lucide-react";

// Neural Background Component
const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Neuron {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      connections: Neuron[] = [];
      pulsePhase: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.radius = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulsePhase += 0.05;

        if (this.x < 0 || this.x > canvas!.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.speedY *= -1;

        this.x = Math.max(0, Math.min(canvas!.width, this.x));
        this.y = Math.max(0, Math.min(canvas!.height, this.y));
      }

      draw() {
        if (!ctx) return;
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + pulse * 0.2})`;
        ctx.fill();
      }
    }

    const neurons = Array.from({ length: 100 }, () => new Neuron());

    function connectNeurons() {
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x;
          const dy = neurons[i].y - neurons[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            if (!ctx) return;
            const opacity = 1 - distance / 150;
            ctx.beginPath();
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.lineTo(neurons[j].x, neurons[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      neurons.forEach(neuron => {
        neuron.update();
        neuron.draw();
      });

      connectNeurons();
      requestAnimationFrame(animate);
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0f172a 100%)' }}
    />
  );
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>NEUROVISION-AI | Advanced Alzheimer's Detection with Deep Learning</title>
        <meta name="description" content="Revolutionary AI-powered Alzheimer's detection platform using CNN and RNN models for early intervention and better outcomes." />
        <meta name="keywords" content="Alzheimer's detection, AI healthcare, neural networks, deep learning, CNN, RNN, medical AI" />
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* Neural Network Background */}
      <NeuralBackground />

      {/* Animated Floating Elements */}
      <div className="fixed top-20 left-10 w-4 h-4 bg-cyan-500 rounded-full blur-sm animate-pulse" />
      <div className="fixed top-40 right-20 w-6 h-6 bg-indigo-500 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-32 left-1/4 w-3 h-3 bg-purple-500 rounded-full blur-sm animate-pulse" style={{ animationDelay: '2s' }} />

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 glass-heavy">
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
                <span className="text-xs text-slate-400">Powered by Deep Learning</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-300 hover:text-white font-medium transition-colors">
                Home
              </Link>
              <Link href="/predict" className="text-slate-300 hover:text-white font-medium transition-colors">
                Predict
              </Link>
              <Link href="/research" className="text-slate-300 hover:text-white font-medium transition-colors">
                Research
              </Link>
              <Link href="/about" className="text-slate-300 hover:text-white font-medium transition-colors">
                About
              </Link>
            </nav>

            {/* Desktop Start Detection Button - Hidden on Mobile */}
            <div className="hidden md:block">
              <Link 
                href="/predict" 
                className="flex btn btn-primary items-center space-x-2"
              >
                <Brain size={20} />
                <span>Start Detection</span>
              </Link>
            </div>

            {/* Mobile Menu Button - Only on Mobile */}
            <button
              className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div
            className={`absolute top-0 right-0 h-full w-64 bg-slate-950/95 border-l border-slate-800 shadow-2xl transition-transform duration-300 ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Close button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-300 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1 px-4">
                <Link
                  href="/"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium transition-all px-4 py-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/predict"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium transition-all px-4 py-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Predict
                </Link>
                <Link
                  href="/research"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium transition-all px-4 py-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Research
                </Link>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium transition-all px-4 py-3 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </nav>
            </div>
          </div>
        </div>

      {/* MAIN CONTENT */}
      <main className="pt-32">
        {/* HERO SECTION */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-slate-900/50 rounded-full px-4 py-2 border border-slate-700">
                <Cpu size={16} className="text-cyan-400" />
                <span className="text-sm text-slate-300">Powered by CNN + RNN Models</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block text-gradient">Early Detection</span>
                <span className="block text-white">of Alzheimer's</span>
                <span className="block text-gradient-secondary">with Neural AI</span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed">
                NeuroVision AI combines cutting-edge Convolutional and Recurrent Neural Networks 
                to analyze medical imaging and cognitive data, enabling unprecedented accuracy 
                in early Alzheimer's detection.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/predict" 
                  className="btn btn-primary flex items-center justify-center space-x-2 py-4 text-lg"
                >
                  <span>Start Free Analysis</span>
                  <ChevronRight size={20} />
                </Link>
                <Link 
                  href="/research" 
                  className="btn btn-secondary flex items-center justify-center space-x-2 py-4 text-lg"
                >
                  <BarChart size={20} />
                  <span>View Research</span>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">99.2%</div>
                  <div className="text-sm text-slate-400">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">5-7 min</div>
                  <div className="text-sm text-slate-400">Analysis Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-400">10K+</div>
                  <div className="text-sm text-slate-400">Scans Processed</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <div className="relative glass p-8 rounded-3xl border border-slate-700/50">
                <div className="relative h-96 w-full rounded-2xl overflow-hidden">
                  {/* Brain visualization animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full blur-xl" />
                      <Brain size={240} className="relative text-indigo-400 brain-pulse" />
                    </div>
                  </div>
                  
                  {/* Neural connections overlay */}
                  <svg className="absolute inset-0 w-full h-full">
                    {[...Array(8)].map((_, i) => (
                      <path
                        key={i}
                        d={`M ${100 + i * 40} ${100} Q ${200 + i * 20} ${50}, ${300 - i * 20} ${200}`}
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="1"
                        className="neural-path"
                        style={{ animationDelay: `${i * 0.4}s` }}
                      />
                    ))}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                    <div className="text-sm text-slate-400">CNN Model</div>
                    <div className="text-lg font-semibold text-white">Image Analysis</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                    <div className="text-sm text-slate-400">RNN Model</div>
                    <div className="text-lg font-semibold text-white">Sequence Learning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Advanced Neural Network Features
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our dual-model approach combines spatial pattern recognition with temporal sequence analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass p-8 rounded-2xl hover-lift border border-slate-700/50">
              <div className="w-14 h-14 rounded-xl bg-indigo-900/50 flex items-center justify-center mb-6">
                <Shield className="text-indigo-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Privacy First</h3>
              <p className="text-slate-300">
                End-to-end encryption with local processing. Your data never leaves your device.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl hover-lift border border-slate-700/50">
              <div className="w-14 h-14 rounded-xl bg-cyan-900/50 flex items-center justify-center mb-6">
                <Zap className="text-cyan-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Analysis</h3>
              <p className="text-slate-300">
                Fast processing with results in minutes using optimized deep learning models.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl hover-lift border border-slate-700/50">
              <div className="w-14 h-14 rounded-xl bg-purple-900/50 flex items-center justify-center mb-6">
                <Users className="text-purple-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Clinical Integration</h3>
              <p className="text-slate-300">
                Seamless EHR integration and clinician-friendly dashboard for easy adoption.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl hover-lift border border-slate-700/50">
              <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center mb-6">
                <Activity className="text-green-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Continuous Learning</h3>
              <p className="text-slate-300">
                Models improve over time with federated learning while maintaining privacy.
              </p>
            </div>
          </div>
        </section>

        {/* TECHNOLOGY SECTION */}
        <section className="container mx-auto px-6 py-20">
          <div className="glass p-12 rounded-3xl border border-slate-700/50">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Deep Learning Architecture
                </h2>
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900/50 to-slate-900/20">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-2">CNN Module</h4>
                    <p className="text-slate-300">
                      Processes MRI and PET scan images with 3D convolutional layers for spatial feature extraction.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900/50 to-slate-900/20">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">RNN Module</h4>
                    <p className="text-slate-300">
                      Analyzes temporal patterns in cognitive test results and longitudinal patient data.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900/50 to-slate-900/20">
                    <h4 className="text-lg font-semibold text-indigo-300 mb-2">Fusion Layer</h4>
                    <p className="text-slate-300">
                      Combines spatial and temporal features for comprehensive risk assessment.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl" />
                  {/* Neural network visualization */}
                  <div className="relative h-80 w-full">
                    {[...Array(5)].map((_, layer) => (
                      <div key={layer} className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full flex justify-around">
                        {[...Array(8 - layer)].map((_, node) => (
                          <div
                            key={node}
                            className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse"
                            style={{
                              animationDelay: `${(layer + node) * 0.1}s`,
                              opacity: 0.7,
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="container mx-auto px-6 py-20">
          <div className="relative overflow-hidden rounded-3xl glass p-12 text-center border border-slate-700/50">
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full -translate-x-32 -translate-y-32 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full translate-x-32 translate-y-32 blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Detect Early Signs?
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                Upload your medical imaging data or cognitive test results for instant AI-powered analysis.
              </p>
              <Link 
                href="/predict" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:-translate-y-1 shadow-2xl shadow-indigo-500/25"
              >
                <Brain className="mr-3" size={24} />
                Start Free Detection Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950/50 border-t border-slate-800/50">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <Image src="/logo.png" alt="NeuroVision Logo" width={40} height={40} />
                <span className="text-2xl font-bold text-gradient">NEUROVISION-AI</span>
              </Link>
              <p className="text-slate-400 mb-6 max-w-md">
                Advanced AI platform for early Alzheimer's detection using state-of-the-art 
                convolutional and recurrent neural networks.
              </p>
              <div className="flex space-x-4">
                {['Twitter', 'LinkedIn', 'Github', 'ResearchGate'].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-300">{platform.charAt(0)}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/predict" className="text-slate-400 hover:text-white transition-colors">Detection</Link></li>
                <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/api" className="text-slate-400 hover:text-white transition-colors">API</Link></li>
                <li><Link href="/documentation" className="text-slate-400 hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">Research</h4>
              <ul className="space-y-2">
                <li><Link href="/research/papers" className="text-slate-400 hover:text-white transition-colors">Publications</Link></li>
                <li><Link href="/research/models" className="text-slate-400 hover:text-white transition-colors">Models</Link></li>
                <li><Link href="/research/datasets" className="text-slate-400 hover:text-white transition-colors">Datasets</Link></li>
                <li><Link href="/research/team" className="text-slate-400 hover:text-white transition-colors">Team</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>123 AI Research Park</li>
                <li>Neurotech City, NC 10001</li>
                <li>support@neurovision.ai</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} NEUROVISION-AI. All rights reserved.</p>
            <p>Built with ❤️ by <a href="https://www.linkedin.com/in/karthik-vidyala-b406b3294/" className="underline hover:text-white transition-colors">Karthik Vidyala</a></p>
          </div>
        </div>
      </footer>
    </>
  );
}