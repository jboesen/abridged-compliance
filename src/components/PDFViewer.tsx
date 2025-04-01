
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type PDFDocument = {
  id: string;
  name: string;
  type: string;
  formFields: PDFFormField[];
};

export type PDFFormField = {
  id: string;
  label: string;
  type: "text" | "checkbox" | "radio" | "select";
  position: { x: number; y: number };
  value: string;
  suggestion?: string;
};

interface PDFViewerProps {
  documents: PDFDocument[];
  onClose: () => void;
}

const PDFViewer = ({ documents, onClose }: PDFViewerProps) => {
  const [activeTab, setActiveTab] = useState(documents[0]?.id || "");
  const [formValues, setFormValues] = useState<Record<string, Record<string, string>>>({});

  const handleInputChange = (docId: string, fieldId: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [docId]: {
        ...(prev[docId] || {}),
        [fieldId]: value,
      },
    }));
  };

  const applySuggestion = (docId: string, field: PDFFormField) => {
    if (field.suggestion) {
      handleInputChange(docId, field.id, field.suggestion);
    }
  };

  const currentDocument = documents.find(doc => doc.id === activeTab);

  return (
    <Card className="fixed inset-0 z-50 bg-white shadow-xl flex flex-col max-w-4xl mx-auto my-24 rounded-lg overflow-hidden">
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Interactive PDF Forms</h2>
        <Button variant="ghost" className="text-white hover:bg-indigo-500" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="bg-transparent h-auto py-2">
            {documents.map((doc) => (
              <TabsTrigger 
                key={doc.id} 
                value={doc.id} 
                className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-6"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  {doc.name}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {documents.map((doc) => (
          <TabsContent key={doc.id} value={doc.id} className="flex-1 overflow-hidden m-0">
            <div className="grid grid-cols-3 h-full">
              <div className="col-span-2 bg-gray-100 p-6 flex items-center justify-center">
                <div className="bg-white shadow-lg w-full h-full max-h-[600px] p-6 relative">
                  {/* This would be replaced with an actual PDF renderer in production */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>

                  {/* Form field overlays */}
                  {doc.formFields.map((field) => (
                    <div 
                      key={field.id} 
                      className="absolute bg-white border border-indigo-300 rounded p-2 shadow-sm"
                      style={{ 
                        top: `${field.position.y}%`, 
                        left: `${field.position.x}%`,
                        transform: 'translate(-50%, -50%)' 
                      }}
                    >
                      <input
                        type="text"
                        className="border-none focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-transparent"
                        value={formValues[doc.id]?.[field.id] || ""}
                        onChange={(e) => handleInputChange(doc.id, field.id, e.target.value)}
                        placeholder={field.label}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-1 bg-white border-l overflow-hidden flex flex-col">
                <div className="p-4 bg-indigo-50 border-b">
                  <h3 className="font-medium text-indigo-800">Form Details</h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      This is the {doc.type} form required for your project. 
                      AI has analyzed your project details and provided suggestions.
                    </p>
                    
                    <div className="space-y-4">
                      {doc.formFields.map((field) => (
                        <div key={field.id} className="border rounded-md p-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formValues[doc.id]?.[field.id] || ""}
                            onChange={(e) => handleInputChange(doc.id, field.id, e.target.value)}
                          />
                          {field.suggestion && (
                            <div className="mt-2 bg-green-50 p-2 rounded border border-green-200">
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-green-700">AI suggestion: <span className="font-semibold">{field.suggestion}</span></p>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 text-green-700 hover:text-green-800 hover:bg-green-100 p-1"
                                  onClick={() => applySuggestion(doc.id, field)}
                                >
                                  Apply
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
                <div className="border-t p-4">
                  <Button className="w-full">Save Form Data</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default PDFViewer;
