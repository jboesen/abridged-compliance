
import React from "react";
import { type Message } from "@/components/ChatInterface";
import MessageItem from "@/components/chat/MessageItem";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {isLoading && (
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
          <div className="bg-white p-4 rounded-lg shadow-sm max-w-[85%] animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
