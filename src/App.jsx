import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { Navigate } from "react-router-dom";
export default function App() {
  
  return (
    <AppFlowProvider>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/summary" element={<OrderGuard require={{ cakeConfig: true }} redirectTo = "/wizard"><SummaryPage /></OrderGuard>} />
          <Route path="/recommendations" element={<OrderGuard require={{ cakeConfig: true}} redirectTo = "/wizard"><RecommendationsPage /></OrderGuard>} />
          <Route path="/auth" element={<AuthPage mode="customer" />} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>}/>
          <Route path="/fallback" element={<GeneratorPage />} />
          {/* <Route path="/fallback" element={<OrderGuard require={{ cakeConfig: true, selectedCake: true }} redirectTo = "/wizard"><GeneratorPage /></OrderGuard>} /> */}
          {/* <Route path="/order-confirmation" element={<OrderGuard require={{ cakeConfig: true, selectedCake: true }} redirectTo = "/wizard"><OrderConfirmationPage /></OrderGuard>} /> */}
           <Route path="/order-confirmation" element={<OrderConfirmationPage/>}/>
          {/* <Route path="/checkout" element={<OrderGuard require={{ cakeConfig: true, selectedCake: true }} redirectTo = "/wizard"><CheckoutPage /></OrderGuard>} /> */}
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}/>
          <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>}/>  
          <Route path="/admin/orders" element={<ProtectedRoute><RoleGuard allow={["staff", "admin"]}><AdminOrdersPage/></RoleGuard></ProtectedRoute>}/>
          <Route path="/admin/users" element={ <ProtectedRoute><RoleGuard allow={["admin"]}><AdminUsersPage /></RoleGuard></ProtectedRoute>}/>
          <Route path="/admin/login" element={<Navigate to="/auth" />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}/>
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </AppFlowProvider>
  );
}