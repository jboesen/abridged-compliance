
import React from "react";
import { type Message } from "@/components/ChatInterface";

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
          <div className="text-xs text-slate-500 mt-1 text-right">{formattedTime}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-sm max-w-[85%]">
        <div>{message.content}</div>
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
