
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F2FCE2] text-[#221F26]">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center">
            <h1 className="text-2xl font-serif font-bold text-[#221F26]">
              Abridged Compliance
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-[#221F26] hover:text-gray-600">
              Login
            </Link>
            <Button asChild className="bg-[#4D724D] hover:bg-[#3A5A3A]">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Save 10-20 hours per permit application
            </h1>
            <p className="mt-6 text-xl text-gray-700">
              Streamline your construction permitting process with AI-powered automation. Reduce errors, save time, and get your projects approved faster.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-[#4D724D] hover:bg-[#3A5A3A] text-white">
                <Link to="/signup">Sign Up Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#4D724D] text-[#4D724D]">
                <Link to="/marketplace">Browse Permit Workflows</Link>
              </Button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img 
              src="/placeholder.svg"
              alt="Permit Automation Platform"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 border-[#E8F5E9] shadow-sm">
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#4D724D] font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Create a Project</h3>
              <p className="text-gray-700">
                Enter your project details and upload relevant documents. Our AI will analyze your needs.
              </p>
            </Card>
            <Card className="p-6 border-[#E8F5E9] shadow-sm">
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#4D724D] font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Complete Forms</h3>
              <p className="text-gray-700">
                Our AI assistant helps you fill out all required forms with guided suggestions.
              </p>
            </Card>
            <Card className="p-6 border-[#E8F5E9] shadow-sm">
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#4D724D] font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Submit & Track</h3>
              <p className="text-gray-700">
                Generate complete permit packages and track their status through the approval process.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-16 bg-[#F2FCE2]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Why Choose Abridged Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-2">Save Hours of Work</h3>
                <p className="text-gray-700">
                  Reduce permit preparation time by 80%, automatically filling forms and generating documents.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-2">Reduce Errors</h3>
                <p className="text-gray-700">
                  Our AI ensures forms are filled correctly and completely, minimizing rejection risk.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-2">Access Expert Knowledge</h3>
                <p className="text-gray-700">
                  Leverage our LA County permit workflows built with expert knowledge of local requirements.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-2">Focus on What Matters</h3>
                <p className="text-gray-700">
                  Spend more time on engineering and construction, less time on paperwork.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#221F26] text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-xl font-semibold mb-4">Abridged Compliance</h3>
              <p className="text-gray-300">
                Revolutionizing construction permitting with AI technology.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">
                info@abridgedcompliance.com<br />
                Los Angeles, CA
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold mb-4">Legal</h3>
              <div className="flex flex-col space-y-2">
                <a href="#" className="text-gray-300 hover:text-white">Terms of Service</a>
                <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Abridged Compliance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
