import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CampProvider, useCamp } from "@/contexts/CampContext";
import LoginPage from "@/pages/LoginPage";
import CampSelectPage from "@/pages/CampSelectPage";
import RegistrarDashboard from "@/pages/registrar/RegistrarDashboard";
import OptometristDashboard from "@/pages/optometrist/OptometristDashboard";
import CounsellorDashboard from "@/pages/counsellor/CounsellorDashboard";
import RecordsPage from "@/pages/RecordsPage";
import SyncPage from "@/pages/SyncPage";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const RoleRedirect = () => {
  const { profile } = useAuth();
  if (!profile) return null;
  switch (profile.role) {
    case 'registrar': return <Navigate to="/registrar" replace />;
    case 'optometrist': return <Navigate to="/optometrist" replace />;
    case 'counsellor': return <Navigate to="/counsellor" replace />;
    default: return <Navigate to="/registrar" replace />;
  }
};

const ProtectedLayout = () => {
  const { user, loading: authLoading } = useAuth();
  const { activeCamp, loading: campLoading, needsSelection } = useCamp();

  if (authLoading || campLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (needsSelection || !activeCamp) return <CampSelectPage />;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/registrar" element={<RegistrarDashboard />} />
          <Route path="/optometrist" element={<OptometristDashboard />} />
          <Route path="/counsellor" element={<CounsellorDashboard />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/sync" element={<SyncPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CampProvider>
            <AppRoutes />
          </CampProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
