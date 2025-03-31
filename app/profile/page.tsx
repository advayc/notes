import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  UserIcon,
  ShieldCheckIcon,
  CalendarIcon,
  AtSignIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;

  // Fetch user profile data
  let profile = null;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = data;
  } catch (error) {
    console.error("Error fetching profile:", error);
  }

  // Default profile data
  const userProfile = profile || {
    id: user.id,
    username: user.email?.split("@")[0] || "User",
    total_notes: 0,
    current_streak: 0,
    longest_streak: 0,
  };

  // Calculate account age
  const createdAt = new Date(user.created_at || Date.now());
  const now = new Date();
  const daysSinceCreation = Math.floor(
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-emerald-950/30 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-emerald-500 text-center md:text-left">
            Your Profile
          </h1>

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
                    {userProfile.username}
                  </h2>
                  <p className="text-emerald-500/70 text-center mb-4">
                    {user.email}
                  </p>

                  {/* Account Details */}
                  <div className="bg-emerald-950/30 rounded-lg py-3 px-4 mb-4">
                    <p className="text-emerald-500/70 text-xs">Member Since</p>
                    <p className="text-emerald-400 font-semibold">
                      {createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-emerald-500/70 text-xs mt-1">
                      {daysSinceCreation} days
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-emerald-500/70">
                      Notes Count
                    </CardDescription>
                    <CardTitle className="text-2xl text-emerald-500">
                      {userProfile.total_notes || 0}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-emerald-500/70">
                      Current Streak
                    </CardDescription>
                    <CardTitle className="text-2xl text-emerald-500">
                      {userProfile.current_streak || 0} days
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-emerald-500/70">
                      Longest Streak
                    </CardDescription>
                    <CardTitle className="text-2xl text-emerald-500">
                      {userProfile.longest_streak || 0} days
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

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
                        <p className="text-emerald-500 font-mono text-sm break-all">
                          {user.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AtSignIcon size={20} className="text-emerald-500" />
                      <div>
                        <p className="text-emerald-500/70 text-sm">Email</p>
                        <p className="text-emerald-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Link href="/notes" passHref>
                  <Button className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30">
                    View My Notes
                  </Button>
                </Link>
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
