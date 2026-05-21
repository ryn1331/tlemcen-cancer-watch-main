import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

// Lazy-load all pages so the initial bundle stays small and each route only
// downloads what it needs. This dramatically improves first-paint perf.
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NewCase = lazy(() => import("./pages/NewCase"));
const CaseList = lazy(() => import("./pages/CaseList"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Discussion = lazy(() => import("./pages/Discussion"));
const Admin = lazy(() => import("./pages/Admin"));
const PatientTimeline = lazy(() => import("./pages/PatientTimeline"));
const Cartography = lazy(() => import("./pages/Cartography"));
const Anapath = lazy(() => import("./pages/Anapath"));
const AssistanteDashboard = lazy(() => import("./pages/AssistanteDashboard"));
const EpidemiologisteDashboard = lazy(() => import("./pages/EpidemiologisteDashboard"));
const AuditTrail = lazy(() => import("./pages/AuditTrail"));
const DataAccessRequests = lazy(() => import("./pages/DataAccessRequests"));
const Atlas = lazy(() => import("./pages/Atlas"));
const Simulator = lazy(() => import("./pages/Simulator"));
const HotspotForecast = lazy(() => import("./pages/HotspotForecast"));
const RegistryChat = lazy(() => import("./pages/RegistryChat"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — avoid refetching on every mount
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="animate-spin text-primary" size={32} />
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <PageFallback />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) return <PageFallback />;
  if (user) return <Navigate to="/" replace />;
  return <Auth />;
}

/** Redirect "/" to the right dashboard based on role */
function RoleBasedHome() {
  const { role, loading } = useAuth();
  if (loading) return <PageFallback />;
  if (role === 'epidemiologiste') return <EpidemiologisteDashboard />;
  if (role === 'anapath') return <Anapath />;
  if (role === 'assistante') return <AssistanteDashboard />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  return <Dashboard />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/auth" element={<AuthRoute />} />
              <Route path="/atlas" element={<Atlas />} />
              <Route path="/" element={<ProtectedRoute><RoleBasedHome /></ProtectedRoute>} />
              <Route path="/nouveau-cas" element={<ProtectedRoute><NewCase /></ProtectedRoute>} />
              <Route path="/cas" element={<ProtectedRoute><CaseList /></ProtectedRoute>} />
              <Route path="/statistiques" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
              <Route path="/discussion" element={<ProtectedRoute><Discussion /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/patient" element={<ProtectedRoute><PatientTimeline /></ProtectedRoute>} />
              <Route path="/cartographie" element={<ProtectedRoute><Cartography /></ProtectedRoute>} />
              <Route path="/anapath" element={<ProtectedRoute><Anapath /></ProtectedRoute>} />
              <Route path="/assistante" element={<ProtectedRoute><AssistanteDashboard /></ProtectedRoute>} />
              <Route path="/epidemiologiste" element={<ProtectedRoute><EpidemiologisteDashboard /></ProtectedRoute>} />
              <Route path="/audit" element={<ProtectedRoute><AuditTrail /></ProtectedRoute>} />
              <Route path="/demandes-acces" element={<ProtectedRoute><DataAccessRequests /></ProtectedRoute>} />
              <Route path="/simulateur" element={<ProtectedRoute><Simulator /></ProtectedRoute>} />
              <Route path="/forecast" element={<ProtectedRoute><HotspotForecast /></ProtectedRoute>} />
              <Route path="/assistant" element={<ProtectedRoute><RegistryChat /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
