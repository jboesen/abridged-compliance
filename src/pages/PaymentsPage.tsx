import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  priceId?: string;
  popular?: boolean;
};

const PaymentsPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated when component mounts
    if (!user) {
      console.log("No user found on PaymentsPage");
    } else {
      console.log("User found on PaymentsPage:", user.id);
    }
  }, [user]);

  const monthlyPlans: PricingPlan[] = [
    {
      id: "basic-monthly",
      name: "Basic",
      description: "Essential features for small projects",
      price: 9.99,
      features: [
        "Up to 3 projects",
        "Basic permit templates",
        "Email support"
      ]
    },
    {
      id: "pro-monthly",
      name: "Professional",
      description: "Perfect for busy contractors",
      price: 19.99,
      popular: true,
      features: [
        "Up to 10 projects",
        "All permit templates",
        "Priority support",
        "Document export"
      ]
    },
    {
      id: "business-monthly",
      name: "Business",
      description: "For construction companies",
      price: 49.99,
      features: [
        "Unlimited projects",
        "Custom permit workflows",
        "24/7 phone support",
        "Team collaboration",
        "Advanced analytics"
      ]
    }
  ];

  const yearlyPlans: PricingPlan[] = monthlyPlans.map(plan => ({
    ...plan,
    id: plan.id.replace("monthly", "yearly"),
    price: Math.round(plan.price * 10),
    description: plan.description + " (Annual billing)"
  }));

  const handlePurchase = async (plan: PricingPlan) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to purchase a plan",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(plan.id);
    
    try {
      console.log("Starting checkout for plan:", plan.id);
      // Call Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { planId: plan.id }
      });
      
      if (error) {
        console.error("Error from create-checkout function:", error);
        throw error;
      }
      
      console.log("Checkout response:", data);
      
      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error starting checkout:", error);
      toast({
        title: "Checkout error",
        description: "Unable to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="p-8">
          <h1 className="text-2xl font-serif font-bold text-[#221F26] mb-2">Payment Plans</h1>
          <p className="text-gray-600 mb-6">Choose the perfect plan for your permitting needs</p>
          
          <Tabs defaultValue="monthly" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly (Save 17%)</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="monthly">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {monthlyPlans.map((plan) => (
                  <Card key={plan.id} className={`relative ${plan.popular ? 'border-[#4D724D] shadow-md' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-0 right-0 flex justify-center">
                        <span className="bg-[#4D724D] text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">${plan.price}</span>
                        <span className="text-gray-500">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D] mr-2">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-[#4D724D] hover:bg-[#3A5A3A]' : ''}`}
                        onClick={() => handlePurchase(plan)}
                        disabled={isLoading === plan.id}
                      >
                        {isLoading === plan.id ? "Processing..." : "Subscribe Now"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="yearly">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {yearlyPlans.map((plan) => (
                  <Card key={plan.id} className={`relative ${plan.popular ? 'border-[#4D724D] shadow-md' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-0 right-0 flex justify-center">
                        <span className="bg-[#4D724D] text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">${plan.price}</span>
                        <span className="text-gray-500">/year</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D] mr-2">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-[#4D724D] hover:bg-[#3A5A3A]' : ''}`}
                        onClick={() => handlePurchase(plan)}
                        disabled={isLoading === plan.id}
                      >
                        {isLoading === plan.id ? "Processing..." : "Subscribe Now"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-serif font-semibold mb-4">Payment History</h2>
            <p className="text-gray-600">
              You don't have any payment records yet. After your first purchase, your payment history will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
