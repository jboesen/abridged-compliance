
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import Sidebar from "@/components/layout/Sidebar";

const CreatorRegister = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    website: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchCreatorProfile, registerAsCreator } = useSupabaseData();

  // Check if user is already a creator
  useEffect(() => {
    const checkCreator = async () => {
      const profile = await fetchCreatorProfile();
      if (profile) {
        setIsCreator(true);
        navigate('/dashboard');
      }
    };
    
    if (user) {
      checkCreator();
    }
  }, [user, fetchCreatorProfile, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.description) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await registerAsCreator(
        formData.companyName,
        formData.description,
        formData.website
      );
      
      toast({
        title: "Creator profile created",
        description: "You can now create and submit compliance workflows.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "There was a problem creating your creator profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <div className="max-w-2xl mx-auto p-8">
          <div className="flex items-center mb-6">
            <button onClick={() => navigate("/dashboard")} className="mr-4 p-2 rounded-full hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </button>
            <h1 className="text-2xl font-serif font-bold text-[#221F26]">Become a Creator</h1>
          </div>

          <Card className="border-[#E8F5E9] shadow-md">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Creator Profile</CardTitle>
              <CardDescription>
                Set up your creator profile to start publishing compliance workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name<span className="text-red-500">*</span></Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Your company or organization name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Company Description<span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your company and compliance expertise"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
                  <p>
                    <strong>Note:</strong> Your creator profile will need to be verified before your workflows can be published to the marketplace.
                  </p>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleSubmit}
                className="bg-[#4D724D] hover:bg-[#3A5A3A]"
                disabled={isLoading}
              >
                {isLoading ? "Creating profile..." : "Create Creator Profile"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorRegister;
