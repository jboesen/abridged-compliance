import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Account = () => {
  const { user } = useAuth();
  const { fetchProfile } = useSupabaseData();
  
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<{
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        console.log("No user found, cannot load profile");
        return;
      }
      
      setIsLoading(true);
      try {
        console.log("Loading profile for user ID:", user.id);
        const profileData = await fetchProfile();
        
        if (profileData) {
          console.log("Profile loaded successfully:", profileData);
          setProfile(profileData);
          setFormData({
            firstName: profileData.first_name || "",
            lastName: profileData.last_name || "",
          });
        } else {
          console.log("No profile data returned");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error loading profile",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [user, fetchProfile]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to update your profile",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Updating profile for user ID:", user.id);
      // Update profile using Supabase
      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
        })
        .eq('id', user.id)
        .select();
      
      if (error) {
        console.error("Error in update query:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log("Profile updated successfully:", data[0]);
        setProfile(data[0]);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated",
        });
      } else {
        console.log("No data returned from update");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const userInitials = (() => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`;
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  })();
  
  if (isLoading && !profile) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D724D]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="p-8">
          <h1 className="text-2xl font-serif font-bold text-[#221F26] mb-6">Account Settings</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="bg-[#E8F5E9] text-[#4D724D] text-lg">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.email}
                      </h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      value={user?.email || ""}
                      disabled
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-[#4D724D] hover:bg-[#3A5A3A]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Password Card */}
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Password reset",
                      description: "Password reset functionality will be implemented soon",
                    });
                  }}
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Danger Zone */}
          <Card className="mt-8 border-red-100">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => {
                  toast({
                    title: "Account deletion",
                    description: "Account deletion functionality will be implemented soon",
                    variant: "destructive",
                  });
                }}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Account;
