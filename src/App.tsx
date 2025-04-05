
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

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
import AuthCallback from "./pages/auth/AuthCallback";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import Account from "./pages/Account";
import PaymentsPage from "./pages/PaymentsPage";

// Home redirector component that checks auth status
const HomeRedirector = () => {
  console.log('DEBUG: HomeRedirector component rendered');
  const { user, loading } = useAuth();
  console.log('DEBUG: HomeRedirector - auth state:', { user: user ? `User ID: ${user.id}` : 'No user', loading });
  
  if (loading) {
    console.log('DEBUG: HomeRedirector - still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D724D]"></div>
      </div>
    );
  }
  
  console.log('DEBUG: HomeRedirector - loading complete, user:', user ? 'Redirecting to dashboard' : 'Showing landing page');
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};

// Configure query client with retry logic for connection issues
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        // Retry up to 3 times for connection errors
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('connection') && failureCount < 3) {
          return true;
        }
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ErrorBoundary>
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
            <Route path="/auth/callback" element={<AuthCallback />} />
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
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
