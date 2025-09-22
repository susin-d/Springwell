// FIX: Add type definitions for the experimental Web Speech API to resolve TypeScript errors.
// These are not included in default DOM typings and need to be declared for the compiler.
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    lang: string;
    interimResults: boolean;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
}

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { MessageSquare, Map, BarChart3, Droplets, Mic, Send, Loader2 } from 'lucide-react';

export default function Index() {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-IN';
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const handleListen = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const suggestions = [
    "What's the groundwater status in Tamil Nadu?",
    "Show me rainfall patterns for this region",
    "Explain water table changes in simple terms",
    "Generate a groundwater stress map"
  ];

  const stats = [
    {
      label: "States Monitored",
      value: "28",
      icon: Map
    },
    {
      label: "Data Sources",
      value: "150+",
      icon: BarChart3
    },
    {
      label: "Active Wells",
      value: "12.5K",
      icon: Droplets
    },
    {
      label: "Daily Updates",
      value: "Real-time",
      icon: MessageSquare
    }
  ];

  const handleSend = () => {
    if (inputValue.trim()) {
      navigate('/dashboard', { state: { initialPrompt: inputValue } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden text-white">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Springwell</h1>
                  <p className="text-sm text-blue-300">Clarity from the Source</p>
                </div>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/dashboard" className="text-white/70 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors">About</Link>
                <Button asChild variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  <Link to="/auth">Sign In</Link>
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Mission Control for
                <span className="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  India's Water
                </span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Transform complex groundwater data into clear, actionable insights with AI-powered analysis available in English and Tamil.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-6 text-lg">
                <Link to="/dashboard" className="flex items-center">
                  Launch Dashboard
                  <MessageSquare className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" className="bg-white/20 text-white hover:bg-white/30 px-8 py-6 text-lg">
                View Demo
              </Button>
            </div>

            <Card className="p-6 max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">Ask Springwell anything about groundwater</span>
                </div>
                <div className="relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="What would you like to know about groundwater in your region?"
                    className="pr-20 h-12"
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-8 w-8 p-0 ${isListening ? 'animate-pulse' : ''}`}
                      onClick={handleListen}
                      disabled={!recognitionRef.current}
                      aria-label="Use voice input"
                    >
                      {isListening ? <Loader2 className="w-4 h-4 animate-spin"/> : <Mic className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 h-8 w-8 p-0"
                      onClick={handleSend}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      size="sm"
                      className="bg-white/10 text-white/70 hover:bg-white/20 hover:text-white text-xs"
                      onClick={() => setInputValue(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="p-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-400/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/60">{stat.label}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>

        <footer className="p-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-white/50 text-sm">
              Empowering water management decisions across India with AI-driven insights
            </p>
          </div>
        </footer>
      </div>

      <div className="fixed bottom-6 right-6">
        <Button asChild className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-lg shadow-emerald-500/25">
          <Link to="/dashboard">
            <MessageSquare className="w-6 h-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
}