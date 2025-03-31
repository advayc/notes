import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserIcon, ShieldCheckIcon, CalendarIcon, AtSignIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Calculate account age
  const createdAt = new Date(user.created_at);
  const now = new Date();
  const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-emerald-500">Your Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Summary Card */}
            <div className="md:col-span-1">
              <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors overflow-hidden">
                <div className="p-6">
                  <div className="mb-6 flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-black/60 flex items-center justify-center border-2 border-emerald-500">
                      <UserIcon size={64} className="text-emerald-500" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-center text-emerald-500 mb-2">
                    {user.email?.split('@')[0] || 'User'}
                  </h2>
                  <p className="text-emerald-500/70 text-center mb-4">{user.email}</p>
                  <div className="mt-6 flex justify-center">
                    <form action={signOut}>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
                      >
                        <LogOutIcon size={16} className="text-emerald-400" />
                        Sign Out
                      </Button>
                    </form>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2">
              {/* Account Details Card */}
              <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors overflow-hidden mb-6">
                <CardHeader className="border-b border-emerald-500/20">
                  <CardTitle className="text-emerald-500">Account Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheckIcon size={20} className="text-emerald-500" />
                      <div>
                        <p className="text-emerald-500/70 text-sm">User ID</p>
                        <p className="text-emerald-500 font-mono text-sm break-all">{user.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AtSignIcon size={20} className="text-emerald-500" />
                      <div>
                        <p className="text-emerald-500/70 text-sm">Email</p>
                        <p className="text-emerald-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarIcon size={20} className="text-emerald-500" />
                      <div>
                        <p className="text-emerald-500/70 text-sm">Member Since</p>
                        <p className="text-emerald-500">{createdAt.toLocaleDateString()} ({daysSinceCreation} days)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}