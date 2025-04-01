import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import MessageList from "@/components/chat/MessageList";
import ChatHeader from "@/components/chat/ChatHeader";
import { sampleQueries } from "@/lib/chatData";
import { Link } from "react-router-dom";
import { workflowTypes } from "@/lib/marketplaceData";
import PDFViewer, { type PDFDocument } from "@/components/PDFViewer";
import PDFFloatingButton from "@/components/PDFFloatingButton";

export type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  attachments?: {
    type: "pdf";
    name: string;
    size: string;
  }[];
  recommendations?: {
    type: "workflow";
    id: string;
    title: string;
  }[];
};

// Sample PDF documents for demonstration
const samplePDFDocuments: PDFDocument[] = [
  {
    id: "trench-permit",
    name: "Trenching Permit Application",
    type: "Municipal Permit",
    formFields: [
      { id: "field1", label: "Project Description", type: "text", position: { x: 30, y: 20 }, value: "", suggestion: "5G Fiber installation - 500ft trench" },
      { id: "field2", label: "Street Address", type: "text", position: { x: 70, y: 20 }, value: "", suggestion: "123 Main St, San Jose, CA" },
      { id: "field3", label: "Start Date", type: "text", position: { x: 30, y: 40 }, value: "", suggestion: "06/15/2023" },
      { id: "field4", label: "Duration (days)", type: "text", position: { x: 70, y: 40 }, value: "", suggestion: "14" },
      { id: "field5", label: "Trench Length (ft)", type: "text", position: { x: 30, y: 60 }, value: "", suggestion: "500" },
      { id: "field6", label: "Trench Width (inches)", type: "text", position: { x: 70, y: 60 }, value: "", suggestion: "24" },
      { id: "field7", label: "Contractor License #", type: "text", position: { x: 50, y: 80 }, value: "", suggestion: "LIC-123456" },
    ],
  },
  {
    id: "traffic-control",
    name: "Traffic Control Plan",
    type: "Traffic Management",
    formFields: [
      { id: "field1", label: "Street Classification", type: "text", position: { x: 30, y: 20 }, value: "", suggestion: "Collector Street" },
      { id: "field2", label: "Lane Closure", type: "text", position: { x: 70, y: 20 }, value: "", suggestion: "Partial - One Lane" },
      { id: "field3", label: "Working Hours", type: "text", position: { x: 30, y: 40 }, value: "", suggestion: "9:00 AM - 4:00 PM" },
      { id: "field4", label: "Detour Required", type: "text", position: { x: 70, y: 40 }, value: "", suggestion: "No" },
      { id: "field5", label: "Pedestrian Protection", type: "text", position: { x: 50, y: 60 }, value: "", suggestion: "Temporary Walkway" },
    ],
  },
  {
    id: "utilities-notification",
    name: "Utility Notification Form",
    type: "811 Notification",
    formFields: [
      { id: "field1", label: "Ticket Number", type: "text", position: { x: 30, y: 20 }, value: "", suggestion: "USA-2023-05-123456" },
      { id: "field2", label: "Excavation Method", type: "text", position: { x: 70, y: 20 }, value: "", suggestion: "Mechanical Trencher" },
      { id: "field3", label: "Utility Type", type: "text", position: { x: 30, y: 40 }, value: "", suggestion: "Telecommunications" },
      { id: "field4", label: "Marking Instructions", type: "text", position: { x: 70, y: 40 }, value: "", suggestion: "Mark entire route along Main St" },
      { id: "field5", label: "Notification Date", type: "text", position: { x: 50, y: 60 }, value: "", suggestion: "05/25/2023" },
    ],
  }
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Welcome to Permio! I'm Mio, your AI assistant for construction permits. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New state for PDF functionality
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [pdfDocuments, setPDFDocuments] = useState<PDFDocument[]>([]);
  const [hasProjectDescription, setHasProjectDescription] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if a project description has been entered
  useEffect(() => {
    const projectDescriptionRegex = /project|construction|build|install|trench|repair|utility|engineering/i;
    
    // Check if any user message contains project description keywords
    const hasDescription = messages.some(
      message => message.sender === "user" && projectDescriptionRegex.test(message.content)
    );
    
    setHasProjectDescription(hasDescription);
  }, [messages]);

  const simulateRagSearch = (fileName: string) => {
    // Simulate searching for relevant workflows based on the PDF content
    // In a real implementation, this would analyze the PDF content
    const randomWorkflows = [...workflowTypes]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(workflow => ({
        type: "workflow" as const,
        id: workflow.id,
        title: workflow.title
      }));
    
    return randomWorkflows;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    handleFiles(files);
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    
    // Check if file is PDF
    if (file.type !== "application/pdf") {
      toast({
        description: "Only PDF files are supported at this time."
      });
      return;
    }
    
    // Format file size
    const fileSize = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    
    // Create user message with attachment
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `I've uploaded a document: ${file.name}`,
      sender: "user",
      timestamp: new Date(),
      attachments: [
        {
          type: "pdf",
          name: file.name,
          size: fileSize
        }
      ]
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate processing and RAG search
    setTimeout(() => {
      const recommendations = simulateRagSearch(file.name);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've analyzed your document "${file.name}" and found some relevant permit workflows that might help with your project. These workflows are designed to streamline the permitting process for projects similar to what I'm seeing in your document.`,
        sender: "bot",
        timestamp: new Date(),
        recommendations
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
      toast({
        description: "New message from Mio"
      });

      // Set PDF documents for viewer based on uploaded file
      setPDFDocuments(samplePDFDocuments);
    }, 2000);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate Python backend processing (would call an API endpoint in production)
    setTimeout(() => {
      const exampleResponses = [
        "Based on your project description, you'll need a utility trenching permit from San Jose Public Works. I can help you prepare the application and review the requirements.",
        "For your trenching project, you'll need to comply with San Jose Municipal Code section 13.36. This requires a traffic control plan and potential restoration bond.",
        "Looking at similar utility projects in San Jose, the average permit approval time is approximately 3-4 weeks. I can help you prepare documentation to avoid common delays.",
        "I found the relevant application form for your project. You'll need to submit the Excavation Permit Application along with your traffic control plan and insurance certificates.",
        "To expedite your permit application, I recommend having these documents ready: site plan showing trenching location, traffic control plan, utility marking confirmation, and contractor license information.",
        "Based on your timeline, I'd recommend submitting your application by next month to meet your construction start date. Let me help you prepare the paperwork.",
      ];

      // Randomly choose a message based on content
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: exampleResponses[Math.floor(Math.random() * exampleResponses.length)],
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
      toast({
        description: "New message from Mio",
      });

      // If this is a project description, set the flag
      if (/project|construction|build|install|trench|repair|utility|engineering/i.test(inputValue)) {
        setHasProjectDescription(true);
        
        // Set PDF documents for viewer if it's a project description
        setPDFDocuments(samplePDFDocuments);
      }
    }, 1500);
  };

  const handleSuggestedQuery = (query: string) => {
    setInputValue(query);
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleOpenPDFViewer = () => {
    setShowPDFViewer(true);
  };

  const handleClosePDFViewer = () => {
    setShowPDFViewer(false);
  };

  return (
    <>
      <Card 
        className={`w-full max-w-4xl h-[85vh] flex flex-col shadow-xl border-slate-200 ${dragActive ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4">
          <MessageList messages={messages} isLoading={isLoading} />
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t p-4">
          {messages.length === 1 && (
            <div className="mb-4">
              <p className="text-sm text-slate-500 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.slice(0, 3).map((query, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => handleSuggestedQuery(query)}
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about permits, regulations, or project requirements..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="button" variant="outline" onClick={handleAttachFile} disabled={isLoading}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
                <span className="hidden md:inline">Attach</span>
              </Button>
              <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="m22 2-7 20-4-9-9-4Z"></path>
                      <path d="M22 2 11 13"></path>
                    </svg>
                    Send
                  </span>
                )}
              </Button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileChange}
            />
            <p className="text-xs text-slate-500 text-center">
              You can also drag and drop PDF files to analyze your project documents
            </p>
          </form>
        </div>
      </Card>

      {hasProjectDescription && pdfDocuments.length > 0 && (
        <PDFFloatingButton 
          onClick={handleOpenPDFViewer}
        />
      )}

      {showPDFViewer && (
        <PDFViewer 
          documents={pdfDocuments} 
          onClose={handleClosePDFViewer} 
        />
      )}
    </>
  );
};

export default ChatInterface;
