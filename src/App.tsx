import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { LocationProvider } from "@/hooks/useLocation";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Search from "./pages/Search";
import BookTest from "./pages/BookTest";
import Checkout from "./pages/Checkout";
import MyBookings from "./pages/MyBookings";
import HealthPackages from "./pages/HealthPackages";
import PackageDetail from "./pages/PackageDetail";
import AdminDashboard from "./pages/AdminDashboard";
import LabRegistration from "./pages/LabRegistration";
import LabDashboard from "./pages/LabDashboard";
import Partnerships from "./pages/Partnerships";
import DoctorConsultation from "./pages/DoctorConsultation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/search" element={<Search />} />
                <Route path="/book/:labTestId" element={<BookTest />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/packages" element={<HealthPackages />} />
                <Route path="/package/:slug" element={<PackageDetail />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/lab-registration" element={<LabRegistration />} />
                <Route path="/lab-dashboard" element={<LabDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
