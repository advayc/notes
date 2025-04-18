'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Lock, UserPlus, Check, Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error("Sign up error:", error);
        throw error;
      }
      
      // Wait a moment to allow the database trigger to run
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/notes');
    } catch (error: any) {
      console.error("Error details:", error);
      setError(error.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-400">Notes App</h1>
          <p className="text-emerald-500/70 mt-2">Create an account to start taking notes</p>
        </div>
        
        <Card className="border-emerald-500/20 bg-black/60 backdrop-blur-md shadow-lg shadow-emerald-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center text-emerald-400">Create Account</CardTitle>
            <CardDescription className="text-center text-emerald-500/70">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSignUp} className="space-y-5">
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
                <p className="text-xs text-emerald-500/50 px-1 pt-1">
                  Password must be at least 6 characters
                </p>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 pt-0.5">
                    <Check size={16} className="text-emerald-500" />
                  </div>
                  <p className="text-xs text-emerald-500/70">
                    By creating an account, you agree to our <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">Terms of Service</Link> and <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</Link>
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition-all duration-200 rounded-md flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                  {!isLoading && <UserPlus size={18} />}
                </Button>
              </div>
              
              <p className="text-center text-sm text-emerald-500/70 pt-2">
                Already have an account?{' '}
                <Link 
                  href="/sign-in" 
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  Sign in
                </Link>
              </p>
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