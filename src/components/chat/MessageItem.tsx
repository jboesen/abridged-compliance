
import React from "react";
import { type Message } from "@/components/ChatInterface";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  const formattedTime = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (message.sender === "bot") {
    return (
      <div className="flex items-start gap-3">
        <div className="bg-indigo-100 rounded-full p-2 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
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
                  <div key={index} className="bg-indigo-50 p-3 rounded-md flex justify-between items-center">
                    <div className="text-sm text-indigo-800 font-medium">{rec.title}</div>
                    <Button variant="outline" size="sm" className="text-xs bg-white" asChild>
                      <Link to={`/marketplace`}>
                        View
                      </Link>
                    </Button>
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
      <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-sm max-w-[85%]">
        <div>{message.content}</div>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 bg-indigo-700/50 rounded-md p-2 flex items-center gap-2">
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
              <div className="text-xs text-indigo-200">{message.attachments[0].size}</div>
            </div>
          </div>
        )}
        
        <div className="text-xs text-indigo-200 mt-1 text-right">{formattedTime}</div>
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

export default MessageItem;
