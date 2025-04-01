
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#F2FCE2] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F5E9] mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline>
              <line x1="13" x2="19" y1="19" y2="13"></line>
              <line x1="16" x2="20" y1="16" y2="20"></line>
              <line x1="19" x2="21" y1="21" y2="19"></line>
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-bold mb-3">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="bg-[#4D724D] hover:bg-[#3A5A3A]">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Need help? <a href="#" className="text-[#4D724D] hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
