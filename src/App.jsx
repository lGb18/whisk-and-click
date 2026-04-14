import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthProvider";
import { AppFlowProvider } from "./state/AppFlow";
import AnimatedLayout from "./components/AnimatedLayout";
import OrderGuard from "./components/OrderGuard";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import PageLoader from "./components/PageLoader";
import HomePage from "./pages/HomePage";
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const BestSellersPage = lazy(() => import("./pages/BestSellersPage"));
const WizardPage = lazy(() => import("./pages/WizardPage"));
const SummaryPage = lazy(() => import("./pages/SummaryPage"));
const RecommendationsPage = lazy(() => import("./pages/RecommendationPage")); // Fixed to RecommendationPage per your previous files
const AuthPage = lazy(() => import("./pages/AuthPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const GeneratorPage = lazy(() => import("./pages/GeneratorPage"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const PromoPage = lazy(() => import("./pages/PromoPage"));
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* 3. SUSPENSE BOUNDARY: Wraps the Routes to catch lazy-loaded chunks */}
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          
          <Route element={<AnimatedLayout />}>
            {/* Eagerly Loaded */}
            <Route path="/" element={<HomePage />} />
            
            {/* Lazy Loaded */}
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/best-sellers" element={<BestSellersPage />} />
            <Route path="/wizard" element={<WizardPage />} />
            <Route path="/summary" element={<OrderGuard require={{ cakeConfig: true }} redirectTo="/wizard"><SummaryPage /></OrderGuard>} />
            <Route path="/recommendations" element={<OrderGuard require={{ cakeConfig: true}} redirectTo="/wizard"><RecommendationsPage /></OrderGuard>} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/promo" element={<PromoPage />} />
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
      </Suspense>
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