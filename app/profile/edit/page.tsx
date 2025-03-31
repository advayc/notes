import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Server action to update profile
async function updateProfile(formData: FormData) {
  "use server";
  
  try {
    const supabase = await createClient();
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return redirect("/sign-in");
    }
    
    // Get form values
    const username = formData.get("username") as string;
    
    // Update profile
    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    
    if (error) {
      console.error("Error updating profile:", error);
      // Instead of returning an object, just log the error
      // This makes the return type compatible with form actions
      return;
    }
    
    return redirect("/profile");
  } catch (error) {
    console.error("Error in updateProfile:", error);
    // Remove the return object to fix the type error
    return;
  }
}

// Server action to update password
async function updatePassword(formData: FormData) {
  "use server";
  
  try {
    const supabase = await createClient();
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return redirect("/sign-in");
    }
    
    // Get form values
    const password = formData.get("password") as string;
    
    // Update password
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) {
      console.error("Error updating password:", error);
      // Fix return type
      return;
    }
    
    return redirect("/profile?update=password-success");
  } catch (error) {
    console.error("Error in updatePassword:", error);
    // Fix return type
    return;
  }
}

export default async function EditProfilePage() {
  try {
    const supabase = await createClient();
    
    // Get user
    const { data, error: userError } = await supabase.auth.getUser();
    const user = data.user;
    
    if (userError || !user) {
      return redirect("/sign-in");
    }
    
    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-emerald-950/30 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center mb-8">
              <Link href="/profile" className="text-emerald-500 hover:text-emerald-400 mr-4">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-3xl font-bold text-emerald-500">Edit Profile</h1>
            </div>
            
            <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-black/60 flex items-center justify-center border-2 border-emerald-500">
                    <UserIcon size={36} className="text-emerald-500" />
                  </div>
                </div>
                <CardTitle className="text-emerald-500 text-center">{user.email}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6 bg-black/30">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                      Profile Information
                    </TabsTrigger>
                    <TabsTrigger value="password" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                      Change Password
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="mt-0">
                    <form action={updateProfile} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-emerald-500">Username</Label>
                        <Input 
                          id="username" 
                          name="username" 
                          defaultValue={profile?.username || user.email?.split('@')[0] || ''} 
                          className="bg-black/30 border-emerald-500/30 text-emerald-500 focus:border-emerald-500"
                        />
                        <p className="text-xs text-emerald-500/70">This is how your name will appear on your profile and notes</p>
                      </div>
                      
                      <div className="pt-4 flex justify-end space-x-4">
                        <Link href="/profile">
                          <Button 
                            type="button"
                            variant="outline"
                            className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                          >
                            Cancel
                          </Button>
                        </Link>
                        <Button 
                          type="submit"
                          className="bg-emerald-500 hover:bg-emerald-600 text-black"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="password" className="mt-0">
                    <form action={updatePassword} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-emerald-500">New Password</Label>
                        <Input 
                          id="password" 
                          name="password" 
                          type="password"
                          className="bg-black/30 border-emerald-500/30 text-emerald-500 focus:border-emerald-500"
                          minLength={6}
                          required
                        />
                        <p className="text-xs text-emerald-500/70">Password must be at least 6 characters</p>
                      </div>
                      
                      <div className="pt-4 flex justify-end space-x-4">
                        <Link href="/profile">
                          <Button 
                            type="button"
                            variant="outline"
                            className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                          >
                            Cancel
                          </Button>
                        </Link>
                        <Button 
                          type="submit"
                          className="bg-emerald-500 hover:bg-emerald-600 text-black"
                        >
                          Update Password
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in edit profile page:", error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
          <p className="text-emerald-500/70 mb-6">There was an error loading your profile for editing.</p>
          <Link href="/profile">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
              Back to Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }
} 