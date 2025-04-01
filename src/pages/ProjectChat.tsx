
import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import PDFFloatingButton from "@/components/PDFFloatingButton";
import PDFViewer from "@/components/PDFViewer";

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

const sampleQueries = [
  "What permits do I need for my utility trenching project?",
  "What are the traffic control requirements for my project?",
  "How long does the permit approval process typically take?",
];

const ProjectChat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Welcome to your project assistant! I'm here to help with your LA County permit applications. What would you like to know about your project requirements?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [projectInfo, setProjectInfo] = useState({
    name: "Downtown LA Fiber Installation",
    type: "Utility Trenching",
    location: "Los Angeles, CA",
  });

  // PDF Viewer state
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [pdfDocuments, setPdfDocuments] = useState<any[]>([]);
  const [hasProjectDescription, setHasProjectDescription] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if a project description has been entered
  useEffect(() => {
    const projectDescriptionRegex = /project|construction|build|install|trench|repair|utility|engineering/i;
    
    // Check if any user message contains project description keywords
    const hasDescription = messages.some(
      message => message.sender === "user" && projectDescriptionRegex.test(message.content)
    );
    
    setHasProjectDescription(hasDescription);

    // Simulate API call to load project info based on project ID
    // In a real app, this would fetch from an API
  }, [messages, id]);

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

    // Check if this is a project description
    if (/project|construction|build|install|trench|repair|utility|engineering/i.test(inputValue)) {
      setHasProjectDescription(true);
      
      // Simulate PDF documents being ready for a project description
      // In a real app, this would come from a backend call
      simulatePDFGeneration();
    }

    // Send to Python backend (simulated)
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: inputValue,
        projectId: id,
      }),
    })
    .then(response => {
      // Simulate API response
      setTimeout(() => {
        const botResponses = [
          "Based on your project in Los Angeles County, you'll need a Utility Trenching Permit from LA Public Works. I can help you prepare the application and review the requirements.",
          "For trenching projects in LA County, you'll need to comply with Municipal Code section 13.36. This requires a traffic control plan and potential restoration bond.",
          "Looking at similar utility projects in LA County, the average permit approval time is approximately 3-4 weeks. I can help you prepare documentation to avoid common delays.",
          "I've found the relevant forms for your project. You'll need to submit the Excavation Permit Application along with your traffic control plan and insurance certificates.",
          "To expedite your permit application, I recommend having these documents ready: site plan showing trenching location, traffic control plan, utility marking confirmation, and contractor license information.",
        ];

        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponses[Math.floor(Math.random() * botResponses.length)],
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsLoading(false);
      }, 1500);
    })
    .catch(error => {
      console.error('Error:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    });
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
        title: "Invalid file type",
        description: "Only PDF files are supported at this time.",
        variant: "destructive",
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
      const recommendations = simulateRAGSearch(file.name);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've analyzed your document "${file.name}" and found some relevant permit workflows that might help with your project in LA County. These workflows are designed to streamline the permitting process for projects similar to what I'm seeing in your document.`,
        sender: "bot",
        timestamp: new Date(),
        recommendations
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
      toast({
        description: "Document analysis complete",
      });

      simulatePDFGeneration();
    }, 2000);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const simulateRAGSearch = (fileName: string) => {
    // Simulate searching for relevant workflows based on the PDF content
    // In a real implementation, this would analyze the PDF content
    const workflowTypes = [
      {
        id: "la-utility-trenching",
        title: "LA County Utility Trenching Permit Workflow",
      },
      {
        id: "la-traffic-control",
        title: "LA County Traffic Control Plan Package",
      },
      {
        id: "la-sidewalk",
        title: "LA County Sidewalk Construction Workflow",
      },
      {
        id: "la-road-repair",
        title: "LA County Road Repair & ROW Permits",
      },
    ];
    
    // Return 1-2 random workflows as recommendations
    return workflowTypes
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(workflow => ({
        type: "workflow" as const,
        id: workflow.id,
        title: workflow.title
      }));
  };

  const simulatePDFGeneration = () => {
    // This simulates the backend generating PDF documents with form fields
    // In a real app, this would call a backend API that returns PDF documents with form fields
    
    // Sample PDF documents for demonstration
    const samplePDFDocuments = [
      {
        id: "la-trenching-permit",
        name: "LA County Trenching Permit",
        type: "Municipal Permit",
        formFields: [
          { id: "field1", label: "Project Description", type: "text", position: { x: 30, y: 20 }, value: "", suggestion: "Fiber optic installation - 500ft trench on Main St" },
          { id: "field2", label: "Location", type: "text", position: { x: 70, y: 20 }, value: "", suggestion: "123 Main St, Los Angeles, CA" },
          { id: "field3", label: "Start Date", type: "text", position: { x: 30, y: 40 }, value: "", suggestion: "06/15/2023" },
          { id: "field4", label: "Duration (days)", type: "text", position: { x: 70, y: 40 }, value: "", suggestion: "14" },
          { id: "field5", label: "Trench Length (ft)", type: "text", position: { x: 30, y: 60 }, value: "", suggestion: "500" },
          { id: "field6", label: "Trench Width (inches)", type: "text", position: { x: 70, y: 60 }, value: "", suggestion: "24" },
          { id: "field7", label: "Contractor License #", type: "text", position: { x: 50, y: 80 }, value: "", suggestion: "LIC-123456" },
        ],
      },
      {
        id: "la-traffic-control",
        name: "LA County Traffic Control Plan",
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
        id: "la-utilities-notification",
        name: "LA County Utility Notification Form",
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

    setPdfDocuments(samplePDFDocuments);
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col h-screen relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Chat Header */}
          <div className="border-b bg-[#4D724D] text-white p-4 flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11v-4a3 3 0 0 1 6 0v4"></path>
                <path d="M12 11h5a3 3 0 0 1 0 6h-.3"></path>
                <path d="M9 11h.3a3 3 0 0 1 2.113 5.124"></path>
                <path d="M9.35 16.5 8 21"></path>
                <path d="M6 16a1 1 0 0 0 1 1h6.333a1 1 0 0 0 .95-.684l.383-1.158A2.001 2.001 0 0 0 12.721 13H7.998A2 2 0 0 0 6 15v1Z"></path>
              </svg>
            </div>
            <div>
              <h2 className="font-semibold">Abridged AI Assistant</h2>
              <p className="text-xs text-white/70">LA County Permit Expert</p>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="bg-[#E8F5E9] rounded-full p-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
                      <path d="M9 11v-4a3 3 0 0 1 6 0v4"></path>
                      <path d="M12 11h5a3 3 0 0 1 0 6h-.3"></path>
                      <path d="M9 11h.3a3 3 0 0 1 2.113 5.124"></path>
                      <path d="M9.35 16.5 8 21"></path>
                      <path d="M6 16a1 1 0 0 0 1 1h6.333a1 1 0 0 0 .95-.684l.383-1.158A2.001 2.001 0 0 0 12.721 13H7.998A2 2 0 0 0 6 15v1Z"></path>
                    </svg>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm max-w-[85%] animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="border-t p-4">
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="text-sm text-slate-500 mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleQueries.map((query, index) => (
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
              <div className={`flex gap-2 ${dragActive ? 'ring-2 ring-[#4D724D] ring-offset-2 rounded-md' : ''}`}>
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
                <Button type="submit" disabled={isLoading || !inputValue.trim()} className="bg-[#4D724D] hover:bg-[#3A5A3A]">
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
          
          {/* Floating PDF Button */}
          {hasProjectDescription && pdfDocuments.length > 0 && (
            <PDFFloatingButton onClick={handleOpenPDFViewer} />
          )}
        </div>
        
        {/* Project Info Sidebar */}
        <div className="hidden lg:block w-80 border-l bg-white p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="font-serif text-lg font-bold mb-2">Project Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{projectInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{projectInfo.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{projectInfo.location}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-serif text-lg font-bold mb-2">Required Permits</h3>
            <div className="space-y-2">
              <div className="bg-[#E8F5E9] p-3 rounded-md">
                <p className="font-medium">Excavation Permit</p>
                <p className="text-sm text-gray-600">LA Public Works</p>
              </div>
              <div className="bg-[#E8F5E9] p-3 rounded-md">
                <p className="font-medium">Traffic Control Plan</p>
                <p className="text-sm text-gray-600">LA Department of Transportation</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-bold mb-2">Next Steps</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
                    <rect width="8" height="8" x="3" y="3" rx="1"></rect>
                    <rect width="8" height="8" x="3" y="13" rx="1"></rect>
                    <rect width="8" height="8" x="13" y="3" rx="1"></rect>
                    <rect width="8" height="8" x="13" y="13" rx="1"></rect>
                  </svg>
                </div>
                <p className="text-sm">Complete Excavation Permit application</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
                    <rect width="8" height="8" x="3" y="3" rx="1"></rect>
                    <rect width="8" height="8" x="3" y="13" rx="1"></rect>
                    <rect width="8" height="8" x="13" y="3" rx="1"></rect>
                    <rect width="8" height="8" x="13" y="13" rx="1"></rect>
                  </svg>
                </div>
                <p className="text-sm">Prepare Traffic Control Plan</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
                    <rect width="8" height="8" x="3" y="3" rx="1"></rect>
                    <rect width="8" height="8" x="3" y="13" rx="1"></rect>
                    <rect width="8" height="8" x="13" y="3" rx="1"></rect>
                    <rect width="8" height="8" x="13" y="13" rx="1"></rect>
                  </svg>
                </div>
                <p className="text-sm">Submit Utility Notification (811)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPDFViewer && (
        <PDFViewer 
          documents={pdfDocuments} 
          onClose={handleClosePDFViewer} 
        />
      )}
    </div>
  );
};

// Message component for chat interface
const MessageItem = ({ message }: { message: Message }) => {
  const formattedTime = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (message.sender === "bot") {
    return (
      <div className="flex items-start gap-3">
        <div className="bg-[#E8F5E9] rounded-full p-2 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
            <path d="M9 11v-4a3 3 0 0 1 6 0v4"></path>
            <path d="M12 11h5a3 3 0 0 1 0 6h-.3"></path>
            <path d="M9 11h.3a3 3 0 0 1 2.113 5.124"></path>
            <path d="M9.35 16.5 8 21"></path>
            <path d="M6 16a1 1 0 0 0 1 1h6.333a1 1 0 0 0 .95-.684l.383-1.158A2.001 2.001 0 0 0 12.721 13H7.998A2 2 0 0 0 6 15v1Z"></path>
          </svg>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm max-w-[85%]">
          <div className="text-slate-800">{message.content}</div>
          
          {message.recommendations && message.recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Recommended Workflows:</h4>
              <div className="space-y-2">
                {message.recommendations.map((rec, index) => (
                  <div key={index} className="bg-[#E8F5E9] p-3 rounded-md flex justify-between items-center">
                    <div className="text-sm text-[#4D724D] font-medium">{rec.title}</div>
                    <Link to={`/marketplace?workflow=${rec.id}`}>
                      <Button variant="outline" size="sm" className="text-xs border-[#4D724D] text-[#4D724D] hover:bg-[#E8F5E9] bg-white">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs text-slate-500 mt-1 text-right">{formattedTime}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="bg-[#4D724D] text-white p-4 rounded-lg shadow-sm max-w-[85%]">
        <div>{message.content}</div>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 bg-[#3A5A3A] rounded-md p-2 flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M9 15v-2"></path>
                <path d="M12 15v-6"></path>
                <path d="M15 15v-4"></path>
              </svg>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate">{message.attachments[0].name}</div>
              <div className="text-xs text-[#A7C5A7]">{message.attachments[0].size}</div>
            </div>
          </div>
        )}
        
        <div className="text-xs text-[#A7C5A7] mt-1 text-right">{formattedTime}</div>
      </div>
      <div className="bg-slate-200 rounded-full p-2 mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    </div>
  );
};

export default ProjectChat;
