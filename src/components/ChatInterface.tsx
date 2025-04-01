
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import MessageList from "@/components/chat/MessageList";
import ChatHeader from "@/components/chat/ChatHeader";
import { sampleQueries } from "@/lib/chatData";

export type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Simulate bot response
    setTimeout(() => {
      const exampleResponses = [
        "Based on your project description, you'll need a building permit from the local city planning department. I can help you prepare the application and review the requirements.",
        "For your construction project, you'll need to comply with zoning code section R-1. This restricts building height to 35 feet in residential areas.",
        "Looking at similar projects in your jurisdiction, the average permit approval time is approximately 4-6 weeks. I can help you prepare documentation to avoid common delays.",
        "I found the relevant application form for your project. You'll need to submit form BP-2023 along with your site plans and structural drawings.",
        "To expedite your permit application, I recommend having these documents ready: site plan, structural drawings, electrical diagrams, and a completed Form BP-101.",
        "Based on your timeline, I'd recommend submitting your application by next month to meet your construction start date. Let me help you prepare the paperwork.",
      ];

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
    }, 1500);
  };

  const handleSuggestedQuery = (query: string) => {
    setInputValue(query);
  };

  return (
    <Card className="w-full max-w-4xl h-[85vh] flex flex-col shadow-xl border-slate-200">
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
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Ask about permits, regulations, or project requirements..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
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
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;
