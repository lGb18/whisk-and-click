import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WizardPage from "./pages/WizardPage";
import SummaryPage from "./pages/SummaryPage";
import RecommendationsPage from "./pages/RecommendationPage";
import GeneratorPage from "./pages/GeneratorPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderGuard from "./components/OrderGuard";
import AuthPage from "./pages/AuthPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { AppFlowProvider } from "./state/AppFlow";
import OrderDetailsPage from './pages/OrderDetailsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import { SpeedInsights } from "@vercel/speed-insights/react"
import AdminUsersPage from "./pages/AdminUsersPage";
import RoleGuard from "./components/RoleGuard";
import DashboardPage from "./pages/DashboardPage";
import AccountPage from "./pages/AccountPage";
import { AnimatePresence } from "framer-motion";
import AnimatedLayout from "./components/AnimatedLayout";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    // AnimatePresence is required for the "exit" animations to work
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Wrap ALL your existing routes inside this single Layout Route */}
        <Route element={<AnimatedLayout />}>
          
          <Route path="/" element={<HomePage />} />
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/summary" element={<OrderGuard require={{ cakeConfig: true }} redirectTo="/wizard"><SummaryPage /></OrderGuard>} />
          <Route path="/recommendations" element={<OrderGuard require={{ cakeConfig: true}} redirectTo="/wizard"><RecommendationsPage /></OrderGuard>} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>}/>
          <Route path="/fallback" element={<GeneratorPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage/>}/>
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}/>
          <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>}/>  
          <Route path="/admin/orders" element={<ProtectedRoute><RoleGuard allow={["staff", "admin"]}><AdminOrdersPage/></RoleGuard></ProtectedRoute>}/>
          <Route path="/admin/users" element={ <ProtectedRoute><RoleGuard allow={["admin"]}><AdminUsersPage /></RoleGuard></ProtectedRoute>}/>
          <Route path="/admin/login" element={<Navigate to="/auth" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}/>
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>}/>
        
        </Route>

      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppFlowProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AppFlowProvider>
    </AuthProvider>
  );
}