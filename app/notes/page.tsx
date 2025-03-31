import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Notes from '@/components/Notes';

export default async function NotesPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/sign-in');
  }

  const { data: userData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 p-4 border border-emerald-500/20 rounded-lg bg-black/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-emerald-500 mb-2">Welcome, {userData?.username || session.user.email}</h2>
            <p className="text-emerald-500/80">Your personal notes space</p>
          </div>
          
          <h1 className="text-3xl font-bold mb-8 text-emerald-500">My Notes</h1>
          <Notes />
        </div>
      </div>
    </div>
  );
}