
import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { workflowTypes } from "@/lib/marketplaceData";

const WorkflowDetail = () => {
  const { id } = useParams<{ id: string }>();
  const workflow = workflowTypes.find(w => w.id === id);
  
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
            <h1 className="text-2xl font-bold mb-2">{workflow.title}</h1>
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
            
            <div>
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
          </div>
          
          <div className="bg-slate-50 p-6 border-t border-slate-200">
            <Button size="lg" className="w-full">Try This Workflow</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetail;
