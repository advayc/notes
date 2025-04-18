'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { UserIcon, NotebookPen } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="border-b border-emerald-500/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-2">
          <NotebookPen className="h-6 w-6" />
          <span>NoteApp</span>
        </Link>
        
        <div className="flex items-center gap-4">
          
          {!isLoading && user ? (
            <>
              <Link href="/notes">
                <Button 
                  variant={pathname === '/notes' ? 'default' : 'ghost'}
                  className={pathname === '/notes' ? 'bg-emerald-500 hover:bg-emerald-600 text-black' : 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10'}
                >
                  My Notes
                </Button>
              </Link>
              <Link href="/profile">
                <Button 
                  variant={pathname === '/profile' ? 'default' : 'ghost'}
                  className={pathname === '/profile' ? 'bg-emerald-500 hover:bg-emerald-600 text-black' : 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10'}
                >
                  <UserIcon className="mr-1 h-4 w-4" />
                  Profile
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
            <Link href="/sign-in">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
} 