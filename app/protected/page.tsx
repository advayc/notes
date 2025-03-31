import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserIcon, ShieldCheckIcon, CalendarIcon, AtSignIcon, LogOutIcon } from "lucide-react";

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
    <div className="flex-1 w-full flex flex-col gap-8 bg-black text-white min-h-screen">
      {/* Header Bar */}
      <div className="w-full bg-gradient-to-r from-black to-black border-b border-green-500">
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-green-400">Your Profile</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="md:col-span-1">
          <div className="bg-neutral-900 rounded-lg shadow-lg p-6 border border-green-500">
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center border-2 border-green-400">
                <UserIcon size={64} className="text-green-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center text-green-400 mb-2">
              {user.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-gray-400 text-center mb-4">{user.email}</p>
            <div className="mt-6 flex justify-center">
              <form action={signOut}>
                <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md border border-green-500 transition-colors">
                  <LogOutIcon size={16} className="text-green-400" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Account Details Card */}
          <div className="bg-neutral-900 rounded-lg shadow-lg mb-6 border border-green-500">
            <div className="border-b border-gray-800 px-6 py-4">
              <h3 className="text-lg font-semibold text-green-400">Account Details</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon size={20} className="text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">User ID</p>
                    <p className="text-white font-mono">{user.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AtSignIcon size={20} className="text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarIcon size={20} className="text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Member Since</p>
                    <p className="text-white">{createdAt.toLocaleDateString()} ({daysSinceCreation} days)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}