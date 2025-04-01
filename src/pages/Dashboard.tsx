
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/layout/Sidebar";
import { toast } from "@/hooks/use-toast";

// Sample project data
const projects = [
  {
    id: "1",
    name: "Downtown LA Fiber Installation",
    location: "Los Angeles, CA",
    status: "in_progress",
    lastActivity: "2023-09-15T10:30:00Z",
    type: "Utility Trenching",
  },
  {
    id: "2",
    name: "Westwood Road Repair",
    location: "Los Angeles, CA",
    status: "pending",
    lastActivity: "2023-09-14T14:20:00Z",
    type: "Road Reconstruction",
  },
  {
    id: "3",
    name: "Silver Lake Sidewalk Improvement",
    location: "Los Angeles, CA",
    status: "approved",
    lastActivity: "2023-09-10T09:45:00Z",
    type: "Sidewalk Construction",
  },
];

// Sample recent workflows
const recentWorkflows = [
  {
    id: "w1",
    name: "LA Utility Trenching Permit",
    agency: "LA Public Works",
    lastUsed: "2023-09-15T10:30:00Z",
  },
  {
    id: "w2",
    name: "LA Traffic Control Plan",
    agency: "LA DOT",
    lastUsed: "2023-09-14T14:20:00Z",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const handleNewProject = () => {
    navigate("/new-project");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-serif font-bold text-[#221F26]">Dashboard</h1>
            <Button 
              onClick={handleNewProject}
              className="bg-[#4D724D] hover:bg-[#3A5A3A]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-sm">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-4xl font-bold text-[#4D724D]">{projects.length}</div>
                <div className="text-gray-600">Total Projects</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-4xl font-bold text-[#4D724D]">1</div>
                <div className="text-gray-600">Pending Approval</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-4xl font-bold text-[#4D724D]">1</div>
                <div className="text-gray-600">Approved</div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-serif font-semibold mb-4 text-[#221F26]">Active Projects</h2>
          
          <div className="space-y-4 mb-8">
            {projects.map((project) => (
              <Card key={project.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {project.location}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {project.type}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        {getStatusBadge(project.status)}
                        <span className="text-xs text-gray-500">
                          Last updated: {formatDate(project.lastActivity)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/project/${project.id}/chat`}>
                        <Button variant="outline" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          AI Chat
                        </Button>
                      </Link>
                      <Link to={`/project/${project.id}/documents`}>
                        <Button variant="outline" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          Forms
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-xl font-serif font-semibold mb-4 text-[#221F26]">Most Recently Used Workflows</h2>
          
          <div className="space-y-4">
            {recentWorkflows.map((workflow) => (
              <Card key={workflow.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{workflow.name}</h3>
                      <div className="text-sm text-gray-500">{workflow.agency}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Last used: {formatDate(workflow.lastUsed)}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      toast({
                        description: "Opening workflow...",
                      });
                    }}>
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
