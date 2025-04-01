
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";

const projectTypes = [
  { value: "utility_trenching", label: "Utility Trenching" },
  { value: "road_repair", label: "Road Repair" },
  { value: "sidewalk", label: "Sidewalk Construction" },
  { value: "intersection", label: "Intersection Improvement" },
  { value: "storm_drain", label: "Storm Drain Installation" },
];

const NewProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    projectType: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileList]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleStartWithAI = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.projectType) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, this would create a project via an API call
    setTimeout(() => {
      toast({
        title: "Project created",
        description: "Starting AI assistance for your project.",
      });
      
      // Navigate to the AI chatbot interface with a newly created project ID
      // For demo purposes, we're using "123" as the project ID
      navigate("/project/123/chat");
      
      setIsLoading(false);
    }, 1000);
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <div className="max-w-4xl mx-auto p-8">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate("/dashboard")} 
              className="mr-4 p-2 rounded-full hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </button>
            <h1 className="text-2xl font-serif font-bold text-[#221F26]">Create New Project</h1>
          </div>

          <form onSubmit={handleStartWithAI} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium">
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="font-medium">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Los Angeles, CA"
                  required
                />
                <p className="text-xs text-gray-500">
                  Note: Currently only supporting projects in Los Angeles County
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType" className="font-medium">
                Project Type <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.projectType} 
                onValueChange={handleSelectChange("projectType")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium">
                Project Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project, including scope, timeline, and specific needs"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Upload Project Documents</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="fileUpload" className="cursor-pointer">
                  <div className="mx-auto w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium">
                    Drag & drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload plans, specifications, or other relevant documents
                  </p>
                </label>
              </div>
            </div>

            {files.length > 0 && (
              <div>
                <Label className="font-medium mb-2 block">Uploaded Files</Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className="bg-gray-50 p-2 rounded-md flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18"></path>
                          <path d="m6 6 12 12"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-center">
              <Button
                type="submit"
                className="bg-[#4D724D] hover:bg-[#3A5A3A] px-6"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <path d="M14 2v6h6"></path>
                  <path d="M9.5 9h5"></path>
                  <path d="M9.5 13h5"></path>
                  <path d="M9.5 17h5"></path>
                </svg>
                {isLoading ? "Creating Project..." : "Start with AI Assistant"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
