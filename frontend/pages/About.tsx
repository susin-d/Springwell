
import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { Droplets, Target, Heart, Globe, TrendingUp, MessageSquare, Map, BarChart3, Shield, Zap, Eye, ArrowRight, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function About() {
  const teamMembers = [
    {
      name: "Dr. Priya Sharma",
      role: "Chief Data Scientist",
      bio: "Hydrologist with 15+ years in groundwater modeling and AI research.",
      avatar: "PS"
    },
    {
      name: "Rajesh Kumar",
      role: "Lead Engineer",
      bio: "Full-stack developer specializing in real-time data systems and geospatial analytics.",
      avatar: "RK"
    },
    {
      name: "Ananya Patel",
      role: "Regional Analyst",
      bio: "Tamil Nadu water policy expert and community engagement specialist.",
      avatar: "AP"
    },
    {
      name: "Dr. Suresh Reddy",
      role: "Agricultural Advisor",
      bio: "Agricultural scientist focusing on water-efficient farming practices.",
      avatar: "SR"
    }
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "AI-Powered Conversations",
      description: "Chat with Springwell in English and Tamil to get instant insights about groundwater data, trends, and predictions.",
      color: "text-emerald-400"
    },
    {
      icon: Map,
      title: "Interactive Maps",
      description: "Visualize groundwater levels, rainfall patterns, and water stress across India with real-time data layers.",
      color: "text-blue-400"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep dive into correlations, trends, and predictive models with comprehensive data visualizations.",
      color: "text-purple-400"
    },
    {
      icon: Eye,
      title: "Real-Time Monitoring",
      description: "Track 12,500+ active monitoring wells with live updates and automated alert systems.",
      color: "text-cyan-400"
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Enterprise-grade security with encrypted data transmission and secure API integrations.",
      color: "text-orange-400"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-second response times for queries and real-time streaming of critical water data updates.",
      color: "text-yellow-400"
    }
  ];

  const stats = [
    {
      label: "States Covered",
      value: "28",
      icon: Globe
    },
    {
      label: "Districts Monitored",
      value: "507",
      icon: Target
    },
    {
      label: "Active Wells",
      value: "12.5K",
      icon: Droplets
    },
    {
      label: "Daily Data Points",
      value: "2.3M",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white relative overflow-y-auto">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="sticky top-0 z-20 p-4 border-b border-white/10 bg-slate-950/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Springwell</h1>
                <p className="text-xs text-blue-300">About Our Mission</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600" asChild>
                <Link to="/dashboard">Launch Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto p-6 space-y-24">
        <section className="text-center space-y-8 pt-16">
          <div className="space-y-4">
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Our Mission
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Clarity from the
              <span className="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Source
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
              Springwell transforms India's complex groundwater data into clear, actionable intelligence. We believe every farmer, official, and citizen deserves access to the insights that protect our nation's most vital resource.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400/20 to-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Key Features
            </Badge>
            <h2 className="text-4xl font-bold text-white my-4">Powered by Innovation</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Cutting-edge technology meets groundwater intelligence to deliver insights that matter.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:border-white/20 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mb-4 group-hover:scale-110 transition-transform">
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Our Team
            </Badge>
            <h2 className="text-4xl font-bold text-white my-4">The People Behind Springwell</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              A diverse team of scientists, engineers, and domain experts united by our mission to protect India's water future.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-6 text-center hover:border-white/20 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-emerald-400 text-sm mb-3">{member.role}</p>
                <p className="text-white/70 text-xs leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center py-16">
          <Card className="p-12 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white">Join the Mission</h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Every drop counts. Every insight matters. Together, we can build a water-secure future for India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8" asChild>
                  <Link to="/dashboard" className="flex items-center">
                    Explore Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" className="px-8">
                  Contact Us
                  <Mail className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="text-white font-semibold">Springwell</div>
                <div className="text-white/60 text-sm">| Clarity from the Source</div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8"><Github className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Twitter className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Linkedin className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Springwell. Empowering water management decisions across India with AI-driven insights.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
