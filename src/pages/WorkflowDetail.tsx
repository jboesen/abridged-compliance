
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { workflowTypes } from "@/lib/marketplaceData";
import { toast } from "@/hooks/use-toast";

const WorkflowDetail = () => {
  const { id } = useParams<{ id: string }>();
  const workflow = workflowTypes.find(w => w.id === id);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!workflow) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Workflow Not Found</h1>
          <Button asChild>
            <Link to="/marketplace">Return to Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call your Stripe checkout endpoint
      // For demonstration, we'll simulate a payment process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful payment
      toast({
        title: "Purchase initiated",
        description: "You'll be redirected to complete payment",
      });
      
      // In production, this would redirect to Stripe Checkout
      setTimeout(() => {
        toast({
          title: "Purchase complete!",
          description: `You've purchased the ${workflow.title} workflow`,
        });
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button variant="outline" className="mb-6" asChild>
          <Link to="/marketplace">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            Back to Marketplace
          </Link>
        </Button>
        
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold">{workflow.title}</h1>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                ${workflow.price}
              </div>
            </div>
            <p className="text-indigo-100">{workflow.description}</p>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Key Benefits</h2>
              <ul className="space-y-2">
                {workflow.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 mr-2 mt-1">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Common Use Cases</h2>
              <ul className="space-y-2">
                {workflow.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 mr-2 mt-1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                    <span className="text-slate-700">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-slate-200 pt-6">
              <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 mr-3 mt-1">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <div>
                    <h3 className="font-semibold text-indigo-800">Secure One-Time Purchase</h3>
                    <p className="text-sm text-indigo-700">This workflow includes all updates and improvements for the jurisdiction for one year.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold text-indigo-600">${workflow.price}</span>
                  <span className="text-slate-600 ml-2">One-time purchase</span>
                </div>
                <Button 
                  size="lg" 
                  onClick={handlePurchase} 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Purchase This Workflow'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetail;
