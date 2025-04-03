
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import Marketplace from "./pages/Marketplace";
import ProjectChat from "./pages/ProjectChat";
import WorkflowDetail from "./pages/WorkflowDetail";
import DocumentGeneration from "./pages/DocumentGeneration";
import CreatorRegister from "./pages/CreatorRegister";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Verification from "./pages/auth/Verification";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/workflow/:id" element={<WorkflowDetail />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/new-project" element={
              <ProtectedRoute>
                <NewProject />
              </ProtectedRoute>
            } />
            <Route path="/project/:id/chat" element={
              <ProtectedRoute>
                <ProjectChat />
              </ProtectedRoute>
            } />
            <Route path="/project/:id/documents" element={
              <ProtectedRoute>
                <DocumentGeneration />
              </ProtectedRoute>
            } />
            <Route path="/creator/register" element={
              <ProtectedRoute>
                <CreatorRegister />
              </ProtectedRoute>
            } />
            
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
