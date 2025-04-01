
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Workflow {
  id: string;
  title: string;
  description: string;
  agency: string;
  permitType: string;
  rating: number;
  reviews: number;
  price: number;
  verified: boolean;
}

interface WorkflowCardProps {
  workflow: Workflow;
  isHighlighted?: boolean;
}

const WorkflowCard = ({ workflow, isHighlighted = false }: WorkflowCardProps) => {
  const navigate = useNavigate();
  
  const handlePurchase = () => {
    // In a real app, this would initiate a payment process
    // For demo purposes, we'll simulate a redirect to checkout
    toast({
      title: "Redirecting to checkout",
      description: "Processing your workflow purchase...",
    });
    
    // Simulate processing time then redirect to success page
    setTimeout(() => {
      navigate("/payment/success");
    }, 1500);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <svg key="half" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-yellow-500">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half)" stroke="currentColor" strokeWidth="1"></polygon>
        </svg>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      );
    }
    
    return stars;
  };

  return (
    <Card className={`transition-all duration-300 shadow-sm hover:shadow-md ${isHighlighted ? 'ring-2 ring-[#4D724D] ring-offset-2' : ''}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-serif text-lg font-bold">{workflow.title}</h3>
            <p className="text-sm text-gray-500">{workflow.agency}</p>
          </div>
          {workflow.verified && (
            <div className="flex items-center bg-[#E8F5E9] text-[#4D724D] px-2 py-1 rounded-full text-xs font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Verified
            </div>
          )}
        </div>
        
        <p className="text-gray-700 mb-4">{workflow.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {workflow.permitType.charAt(0).toUpperCase() + workflow.permitType.slice(1)}
          </Badge>
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            LA County
          </Badge>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center">
              {renderStars(workflow.rating)}
              <span className="text-sm text-gray-500 ml-2">
                ({workflow.reviews} {workflow.reviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <div className="font-bold text-lg mt-1">
              {formatPrice(workflow.price)}
            </div>
          </div>
          <Button 
            onClick={handlePurchase}
            className="bg-[#4D724D] hover:bg-[#3A5A3A]"
          >
            Purchase
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowCard;
