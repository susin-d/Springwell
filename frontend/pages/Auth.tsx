import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Droplets, Mail, Lock, User, Github } from 'lucide-react';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here.
    console.log(`${isSignUp ? 'Signing up' : 'Signing in'}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden text-white flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Droplets className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Springwell</h1>
                <p className="text-sm text-blue-300">Clarity from the Source</p>
              </div>
            </Link>
        </div>

        <Card className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
            <p className="text-white/60 text-sm">{isSignUp ? 'Join the mission to secure India\'s water future.' : 'Sign in to access your dashboard.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input type="text" placeholder="Full Name" className="pl-10" required />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input type="email" placeholder="Email Address" className="pl-10" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input type="password" placeholder="Password" className="pl-10" required />
            </div>

            {!isSignUp && (
                 <div className="text-right">
                    <a href="#" className="text-xs text-blue-400 hover:underline">Forgot Password?</a>
                </div>
            )}

            <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/5 px-2 text-white/50 backdrop-blur-sm">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary">
                  <svg className="w-4 h-4 mr-2" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.87 1.62-4.63 0-8.38-3.77-8.38-8.4s3.75-8.4 8.38-8.4c2.6 0 4.22 1.02 5.2 2.02l2.58-2.58C18.25 1.36 15.75 0 12.48 0 5.6 0 0 5.6 0 12.5S5.6 25 12.48 25c3.24 0 5.8-1.1 7.7-3.02 2-2 2.6-4.9 2.6-7.32 0-.6-.05-1.18-.15-1.76h-10z"/></svg>
                  Google
              </Button>
               <Button variant="secondary">
                   <Github className="w-4 h-4 mr-2" />
                  GitHub
              </Button>
          </div>

          <div className="text-center text-sm text-white/60">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-semibold text-blue-400 hover:underline ml-1">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}