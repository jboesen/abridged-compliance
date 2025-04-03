
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import Account from "./pages/Account";
import PaymentsPage from "./pages/PaymentsPage";

const queryClient = new QueryClient();

// Home redirector component that checks auth status
const HomeRedirector = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D724D]"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Home route with conditional redirect */}
            <Route path="/" element={<HomeRedirector />} />
            
            {/* Public routes */}
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
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute>
                <PaymentsPage />
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
