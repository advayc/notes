'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/notes');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-400">Notes App</h1>
          <p className="text-emerald-500/70 mt-2">Welcome back! Sign in to access your notes.</p>
        </div>
        
        <Card className="border-emerald-500/20 bg-black/60 backdrop-blur-md shadow-lg shadow-emerald-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center text-emerald-400">Sign In</CardTitle>
            <CardDescription className="text-center text-emerald-500/70">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute left-3 top-[14px] text-emerald-500/70">
                    <Mail size={18} />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-black/40 border-emerald-500/30 focus:border-emerald-400 text-emerald-400 placeholder:text-emerald-500/50 h-12 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute left-3 top-[14px] text-emerald-500/70">
                    <Lock size={18} />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-black/40 border-emerald-500/30 focus:border-emerald-400 text-emerald-400 placeholder:text-emerald-500/50 h-12 rounded-md"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-[14px] text-emerald-500/70 hover:text-emerald-500 transition-colors"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition-all duration-200 rounded-md flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <ArrowRight size={18} />}
              </Button>
              
              <div className="pt-2">
                <p className="text-center text-sm text-emerald-500/70">
                  Don't have an account?{' '}
                  <Link 
                    href="/sign-up" 
                    className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                  >
                    Sign up
                  </Link>
                </p>
                
                <p className="text-center text-xs text-emerald-500/50 mt-3">
                  <Link 
                    href="/forgot-password" 
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-emerald-500/50 mt-8">
          &copy; {new Date().getFullYear()} Notes App. All rights reserved.
        </p>
      </div>
    </div>
  );
}