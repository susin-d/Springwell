
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
import { Link, useLocation } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { MessageSquare, Map, BarChart3, Droplets, Mic, Send, MapPin, TrendingDown, TrendingUp, AlertTriangle, Zap, Loader2 } from 'lucide-react';
// FIX: Import both ChatInterface and DashboardActionContext from the component file to break the circular dependency.
import { ChatInterface, DashboardActionContext } from './Dashboard/_components/ChatInterface';
import { DataCharts, ChartConfig } from './Dashboard/_components/DataCharts';
import { InteractiveMap, MapState } from './Dashboard/_components/InteractiveMap';
import type { AiActionResponse } from '../services/geminiService';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("chat");
  const [inputValue, setInputValue] = useState("");
  const location = useLocation();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [mapState, setMapState] = useState<MapState>({ activeLayer: 'none', highlightedLocation: null, markers: [] });
  const [chatKey, setChatKey] = useState(Date.now()); // Used to forward input value to chat

  const handleAiAction = (action: AiActionResponse) => {
    switch(action.action) {
      case 'navigate':
        if (action.tab) setActiveTab(action.tab);
        break;
      case 'show_on_map':
        setMapState({
          activeLayer: action.layer || 'stress',
          highlightedLocation: action.location || null,
          markers: mapState.markers,
        });
        setActiveTab('map');
        break;
      case 'create_chart':
        if (action.title && action.chartType && action.location) {
          const newChart: ChartConfig = {
            id: Date.now().toString(),
            type: action.chartType,
            location: action.location,
            title: action.title,
          };
          setCharts(prevCharts => [...prevCharts, newChart]);
        }
        setActiveTab('analytics');
        break;
      case 'add_marker':
        if (action.lat && action.lng && action.popup) {
          setMapState(prev => ({
            ...prev,
            markers: [...prev.markers, { lat: action.lat!, lng: action.lng!, popup: action.popup! }]
          }));
        }
        setActiveTab('map');
        break;
      case 'text_only':
      default:
        // No UI action needed, the chat interface handles the text display
        break;
    }
  };
  
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

  useEffect(() => {
    const initialPromptFromState = location.state?.initialPrompt;
    if (initialPromptFromState) {
      setInputValue(initialPromptFromState);
      setChatKey(Date.now()); // Trigger re-render of chat with new prompt
      setActiveTab('chat');
      // Clear the location state to prevent re-triggering on navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const quickStats = [
    {
      label: "Critical Districts",
      value: "142",
      icon: AlertTriangle,
      color: "text-red-400"
    },
    {
      label: "Water Table (Avg)",
      value: "-2.3m",
      icon: TrendingDown,
      color: "text-orange-400"
    },
    {
      label: "Monsoon Progress",
      value: "78%",
      icon: TrendingUp,
      color: "text-emerald-400"
    },
    {
      label: "Active Monitoring",
      value: "12.5K",
      icon: Zap,
      color: "text-cyan-400"
    }
  ];

  const suggestions = [
    "Show me groundwater trends for Tamil Nadu this year",
    "Which districts in Maharashtra need immediate attention?",
    "தமிழ்நாட்டில் நிலத்தடி நீர் நிலை என்ன?",
  ];

  const recentAlerts = [
    {
      location: "Dharmapuri, Tamil Nadu",
      severity: "Critical",
      message: "Water table dropped 15% below normal levels",
      time: "2 hours ago"
    },
    {
      location: "Marathwada, Maharashtra",
      severity: "Warning",
      message: "Declining trend observed in 8 monitoring wells",
      time: "4 hours ago"
    },
    {
      location: "Bundelkhand, Uttar Pradesh",
      severity: "Info",
      message: "Monsoon recharge improving gradually",
      time: "1 day ago"
    }
  ];
  
  const handleGlobalSend = () => {
    // This passes the inputValue to the chat component by switching tabs
    setChatKey(Date.now());
    setActiveTab("chat");
  };

  return (
    <DashboardActionContext.Provider value={{ handleAiAction }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <header className="relative z-10 p-4 border-b border-white/10">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Springwell</h1>
                  <p className="text-xs text-blue-300">Mission Control for India's Water</p>
                </div>
              </Link>
              <div className="hidden lg:flex items-center space-x-6">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="text-lg font-bold text-white">{stat.value}</span>
                      </div>
                      <p className="text-xs text-white/60">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="secondary" size="sm">
                  Export Data
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 flex h-[calc(100vh-65px)]">
          <div className="w-72 border-r border-white/10 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <Button
                  onClick={() => setActiveTab("chat")}
                  variant={activeTab === "chat" ? "secondary" : "ghost"}
                  className={`w-full justify-start ${activeTab === "chat" ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white" : ""}`}
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  AI Assistant
                </Button>
                <Button
                  onClick={() => setActiveTab("map")}
                  variant={activeTab === "map" ? "secondary" : "ghost"}
                  className={`w-full justify-start ${activeTab === "map" ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white" : ""}`}
                >
                  <Map className="w-5 h-5 mr-3" />
                  Interactive Map
                </Button>
                <Button
                  onClick={() => setActiveTab("analytics")}
                  variant={activeTab === "analytics" ? "secondary" : "ghost"}
                  className={`w-full justify-start ${activeTab === "analytics" ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white" : ""}`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Data Analytics
                </Button>
              </div>

              <Card className="p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2 text-orange-400" />
                  Recent Alerts
                </h3>
                <div className="space-y-3">
                  {recentAlerts.map((alert, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`text-xs border-0 ${
                            alert.severity === "Critical"
                              ? "bg-red-500/30 text-red-300"
                              : alert.severity === "Warning"
                              ? "bg-orange-500/30 text-orange-300"
                              : "bg-blue-500/30 text-blue-300"
                          }`}
                        >
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-white/60">{alert.time}</span>
                      </div>
                      <div className="text-sm text-white/80 font-medium flex items-center">
                        <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0" />
                        {alert.location}
                      </div>
                      <p className="text-xs text-white/70">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-white font-semibold mb-3 text-sm">Quick Actions</h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left text-xs text-white/70 hover:text-white hover:bg-white/10 h-auto py-2 px-3"
                      onClick={() => setInputValue(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <main className="flex-1 relative h-full">
            {activeTab === "chat" && <ChatInterface key={chatKey} initialPrompt={inputValue} />}
            {activeTab === "map" && <InteractiveMap mapState={mapState} />}
            {activeTab === "analytics" && <DataCharts charts={charts} />}

            {activeTab !== "chat" && (
              <div className="absolute bottom-4 left-4 right-4">
                <Card className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 relative">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask Springwell anything to update the view..."
                        className="pr-20 h-10"
                        onKeyPress={(e) => e.key === 'Enter' && handleGlobalSend()}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-8 w-8 p-0 ${isListening ? 'animate-pulse' : ''}`}
                          onClick={handleListen}
                          disabled={!recognitionRef.current}
                          aria-label="Use voice input"
                        >
                          {isListening ? <Loader2 className="w-4 h-4 animate-spin"/> : <Mic className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="icon"
                          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 h-8 w-8 p-0"
                          onClick={handleGlobalSend}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </DashboardActionContext.Provider>
  );
}
