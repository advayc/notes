'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
  };

  return (
    <Button
      type="button"
      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
} 