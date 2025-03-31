import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-3xl relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-emerald-500">
            Your Personal Note-Taking App
          </h1>
          <p className="text-xl text-emerald-500/80 mb-8">
            Create, organize, and access your notes from anywhere. Simple, secure, and beautiful.
          </p>
          <Link href="/sign-in">
            <Button size="lg" className="text-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition-colors">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-emerald-500">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <CardTitle className="text-emerald-500">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-500/80">
                  Your notes are encrypted and only accessible to you. Sign in with your account to access your personal space.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <CardTitle className="text-emerald-500">Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-500/80">
                  Create, edit, and delete notes with a simple and intuitive interface. No learning curve required.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <CardTitle className="text-emerald-500">Access Anywhere</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-500/80">
                  Access your notes from any device with a web browser. Your notes are always in sync.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
