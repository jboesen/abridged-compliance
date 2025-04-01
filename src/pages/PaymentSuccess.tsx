
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-[#F2FCE2] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-[#E8F5E9] p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-center text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 text-center mb-6">
          Thank you for your purchase. You now have access to the workflow.
        </p>
        
        <div className="flex flex-col gap-4">
          <Button 
            asChild
            className="bg-[#4D724D] hover:bg-[#3A5A3A]"
          >
            <Link to="/dashboard">
              Return to Dashboard
            </Link>
          </Button>
          <Button 
            asChild
            variant="outline"
            className="border-[#4D724D] text-[#4D724D]"
          >
            <Link to="/marketplace">
              Explore More Workflows
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
