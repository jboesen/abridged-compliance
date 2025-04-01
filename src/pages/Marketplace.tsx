
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Sidebar from "@/components/layout/Sidebar";
import WorkflowCard from "@/components/marketplace/WorkflowCard";

// Sample workflow data
const workflows = [
  {
    id: "la-utility-trenching",
    title: "LA County Utility Trenching Permit",
    description: "Complete workflow for utility trenching permits in Los Angeles County.",
    agency: "LA County Public Works",
    permitType: "utility",
    rating: 4.8,
    reviews: 24,
    price: 299,
    verified: true,
  },
  {
    id: "la-traffic-control",
    title: "LA Traffic Control Plan Package",
    description: "Traffic control plan templates and automated permit generation for LA County.",
    agency: "LA Department of Transportation",
    permitType: "traffic",
    rating: 4.6,
    reviews: 18,
    price: 249,
    verified: true,
  },
  {
    id: "la-sidewalk",
    title: "LA County Sidewalk Construction Workflow",
    description: "Step-by-step workflow for sidewalk construction permits in LA County.",
    agency: "LA County Public Works",
    permitType: "sidewalk",
    rating: 4.5,
    reviews: 12,
    price: 199,
    verified: true,
  },
  {
    id: "la-road-repair",
    title: "LA County Road Repair & ROW Permits",
    description: "Comprehensive workflow for road repair and right-of-way permits in LA County.",
    agency: "LA County Public Works",
    permitType: "road",
    rating: 4.7,
    reviews: 15,
    price: 279,
    verified: false,
  },
  {
    id: "la-storm-drain",
    title: "LA Storm Drain Installation Package",
    description: "Complete permit workflow for storm drain installations in LA County.",
    agency: "LA County Flood Control District",
    permitType: "utility",
    rating: 4.4,
    reviews: 9,
    price: 229,
    verified: false,
  },
];

// Filter options
const permitTypes = [
  { id: "utility", label: "Utility" },
  { id: "traffic", label: "Traffic" },
  { id: "sidewalk", label: "Sidewalk" },
  { id: "road", label: "Road Repair" },
];

const Marketplace = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    permitTypes: [] as string[],
    verifiedOnly: false,
  });
  
  // Get highlighted workflow from URL params
  const highlightedWorkflowId = searchParams.get("workflow");
  
  // Filter workflows based on search and filters
  const filteredWorkflows = workflows.filter((workflow) => {
    // Search filter
    const matchesSearch = search === "" || 
      workflow.title.toLowerCase().includes(search.toLowerCase()) ||
      workflow.description.toLowerCase().includes(search.toLowerCase()) ||
      workflow.agency.toLowerCase().includes(search.toLowerCase());
    
    // Permit type filter
    const matchesPermitType = filters.permitTypes.length === 0 ||
      filters.permitTypes.includes(workflow.permitType);
    
    // Verified filter
    const matchesVerified = !filters.verifiedOnly || workflow.verified;
    
    return matchesSearch && matchesPermitType && matchesVerified;
  });
  
  const togglePermitType = (permitType: string) => {
    setFilters(prev => {
      const newPermitTypes = prev.permitTypes.includes(permitType)
        ? prev.permitTypes.filter(type => type !== permitType)
        : [...prev.permitTypes, permitType];
      
      return {
        ...prev,
        permitTypes: newPermitTypes
      };
    });
  };
  
  const toggleVerifiedOnly = () => {
    setFilters(prev => ({
      ...prev,
      verifiedOnly: !prev.verifiedOnly
    }));
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is applied as they type, so no additional handling needed
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#221F26]">Permit Workflow Marketplace</h1>
              <p className="text-gray-600">Browse and purchase specialized workflows for LA County permits</p>
            </div>
            <form onSubmit={handleSearch} className="mt-4 md:mt-0">
              <Input
                type="search"
                placeholder="Search workflows..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80"
              />
            </form>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter Sidebar */}
            <div className="w-full md:w-64 space-y-6">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-serif font-semibold mb-3">Filter by Permit Type</h3>
                  <div className="space-y-2">
                    {permitTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`filter-${type.id}`}
                          checked={filters.permitTypes.includes(type.id)}
                          onCheckedChange={() => togglePermitType(type.id)}
                        />
                        <label 
                          htmlFor={`filter-${type.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-serif font-semibold mb-3">Filter by Status</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filter-verified"
                      checked={filters.verifiedOnly}
                      onCheckedChange={toggleVerifiedOnly}
                    />
                    <label 
                      htmlFor="filter-verified"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Verified workflows only
                    </label>
                  </div>
                </CardContent>
              </Card>
              
              <div className="p-4 bg-[#E8F5E9] rounded-md">
                <h3 className="font-serif font-semibold mb-2">About Verified Workflows</h3>
                <p className="text-sm text-gray-700">
                  Verified workflows are created and maintained by Abridged Compliance's team of experts. They are regularly updated to ensure compliance with current regulations.
                </p>
              </div>
            </div>
            
            {/* Workflow Grid */}
            <div className="flex-1">
              {filteredWorkflows.length === 0 ? (
                <div className="bg-white p-8 rounded-md text-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-400">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                  <h2 className="text-xl font-medium mb-2">No workflows found</h2>
                  <p className="text-gray-600">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredWorkflows.map((workflow) => (
                    <WorkflowCard 
                      key={workflow.id}
                      workflow={workflow}
                      isHighlighted={workflow.id === highlightedWorkflowId}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
