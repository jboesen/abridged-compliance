
import React from "react";
import { Button } from "@/components/ui/button";

interface PDFFloatingButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const PDFFloatingButton = ({ onClick, disabled = false }: PDFFloatingButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={onClick}
        disabled={disabled}
        className="h-14 w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
          <path d="M8 11v6"></path>
        </svg>
      </Button>
    </div>
  );
};

export default PDFFloatingButton;
