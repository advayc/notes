'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="border-b border-emerald-500/20 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
          NoteApp
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/notes">
                <Button 
                  variant={pathname === '/notes' ? 'default' : 'ghost'}
                  className={pathname === '/notes' ? 'bg-emerald-500 hover:bg-emerald-600 text-black' : 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10'}
                >
                  My Notes
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/auth-pages/sign-in">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 