import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles, Shield, Pencil, Globe } from 'lucide-react';
import { ReactNode } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Animated Gradient */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-full h-1/2 max-w-lg bg-emerald-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 border border-emerald-500/20 rounded-full backdrop-blur-md bg-emerald-500/5">
              <Sparkles className="h-4 w-4 mr-2 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-500">Your thoughts, organized beautifully</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-emerald-400 to-emerald-600">
              Your Personal Note-Taking App
            </h1>
            
            <p className="text-xl text-emerald-500/80 max-w-2xl mx-auto">
              Create, organize, and access your notes from anywhere. Simple, secure, and beautiful.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/sign-in">
                <Button size="lg" className="text-lg bg-emerald-500 hover:bg-emerald-600 text-black font-medium transition-all group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="text-lg border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Features Section */}
      <section id="features" className="py-20 bg-black/70 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-emerald-500 mb-4">Features</h2>
            <p className="text-emerald-500/70 max-w-3xl mx-auto">
              Everything you need to organize your thoughts, ideas, and projects in one place.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-emerald-500" />}
              title="Secure & Private"
              description="Your notes are encrypted and only accessible to you. Sign in with your account to access your personal space."
            />

            <FeatureCard 
              icon={<Pencil className="h-10 w-10 text-emerald-500" />}
              title="Easy to Use"
              description="Create, edit, and delete notes with a simple and intuitive interface. No learning curve required."
            />

            <FeatureCard 
              icon={<Globe className="h-10 w-10 text-emerald-500" />}
              title="Access Anywhere"
              description="Access your notes from any device with a web browser. Your notes are always in sync."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent -z-10" />
        
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-emerald-500">Ready to start organizing your thoughts?</h2>
            <p className="text-emerald-500/80 max-w-2xl mx-auto">
              Join thousands of users who trust NoteApp for their personal and professional note-taking needs.
            </p>
            <div className="pt-4">
              <Link href="/sign-in">
                <Button size="lg" className="text-lg bg-emerald-500 hover:bg-emerald-600 text-black font-medium transition-all">
                  Create Your First Note
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      
      <CardHeader>
        <div className="p-3 rounded-lg bg-emerald-950/50 inline-block mb-2">
          {icon}
        </div>
        <CardTitle className="text-emerald-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-emerald-500/80">{description}</p>
      </CardContent>
    </Card>
  );
}
