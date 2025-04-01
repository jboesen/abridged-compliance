
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/layout/Sidebar";

// Sample document data
const documents = [
  {
    id: "la-trenching-permit",
    name: "LA County Trenching Permit Application",
    previewUrl: "/placeholder.svg", // In a real app, this would be a PDF preview
  },
  {
    id: "la-traffic-control",
    name: "Traffic Control Plan",
    previewUrl: "/placeholder.svg",
  },
  {
    id: "811-notification",
    name: "811 Utility Notification Form",
    previewUrl: "/placeholder.svg",
  }
];

const DocumentGeneration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("preview");
  
  const handleDownloadSingle = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    
    if (document) {
      toast({
        title: "Download started",
        description: `Downloading ${document.name}...`,
      });
      
      // In a real app, this would trigger an actual download
      setTimeout(() => {
        toast({
          description: `${document.name} downloaded successfully.`,
        });
      }, 1500);
    }
  };
  
  const handleDownloadAll = () => {
    toast({
      title: "Package download started",
      description: "Preparing your complete permit package...",
    });
    
    // In a real app, this would trigger an actual download of all documents
    setTimeout(() => {
      toast({
        description: "Complete permit package downloaded successfully.",
      });
    }, 2000);
  };
  
  const handleReturnToChat = () => {
    navigate(`/project/${id}/chat`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={handleReturnToChat}
              className="mr-4 p-2 rounded-full hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#221F26]">Generated Documents</h1>
              <p className="text-gray-600">Review and download your permit documents</p>
            </div>
          </div>
          
          <Tabs defaultValue="preview" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-white border">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="compare">Compare</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReturnToChat}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Return to Chat
                </Button>
                <Button className="bg-[#4D724D] hover:bg-[#3A5A3A]" onClick={handleDownloadAll}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download Complete Package
                </Button>
              </div>
            </div>
            
            <TabsContent value="preview" className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                {documents.map((document) => (
                  <div key={document.id} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-serif text-xl font-semibold">{document.name}</h2>
                      <Button variant="outline" onClick={() => handleDownloadSingle(document.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download
                      </Button>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-md h-96 flex items-center justify-center">
                      <img 
                        src={document.previewUrl} 
                        alt={document.name} 
                        className="max-h-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="edit" className="mt-0">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-center text-gray-500 py-8">
                  Document editing functionality would be implemented here.
                  <br />
                  This would allow users to make final adjustments to form fields.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="compare" className="mt-0">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-center text-gray-500 py-8">
                  Document comparison functionality would be implemented here.
                  <br />
                  This would show side-by-side views of template vs. completed forms.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DocumentGeneration;
