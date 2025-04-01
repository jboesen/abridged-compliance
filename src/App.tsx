
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import Marketplace from "./pages/Marketplace";
import ProjectChat from "./pages/ProjectChat";
import DocumentGeneration from "./pages/DocumentGeneration";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Verification from "./pages/auth/Verification";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-project" element={<NewProject />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/project/:id/chat" element={<ProjectChat />} />
          <Route path="/project/:id/documents" element={<DocumentGeneration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
