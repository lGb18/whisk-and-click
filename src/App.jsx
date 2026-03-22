import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WizardPage from "./pages/WizardPage";
import SummaryPage from "./pages/SummaryPage";
import RecommendationsPage from "./pages/RecommendationPage";
import GeneratorPage from "./pages/GeneratorPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderGuard from "./components/OrderGuard";
import { AppFlowProvider } from "./state/AppFlow";
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function App() {
  return (
    <AppFlowProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/summary" element={<OrderGuard require={{ cakeConfig: true }} redirectTo = "/wizard"><SummaryPage /></OrderGuard>} />
          <Route path="/recommendations" element={<OrderGuard require={{ cakeConfig: true}} redirectTo = "/wizard"><RecommendationsPage /></OrderGuard>} />
          <Route path="/fallback" element={<OrderGuard require={{ cakeConfig: true, selectedCake: true }} redirectTo = "/wizard"><GeneratorPage /></OrderGuard>} />
          <Route path="/order-confirmation" element={<OrderGuard require={{ cakeConfig: true, selectedCake: true }} redirectTo = "/wizard"><OrderConfirmationPage /></OrderGuard>} />
          <Route path="/checkout" element={<OrderGuard require={{ cakeConfig: true, selectedCake: true }} redirectTo = "/wizard"><CheckoutPage /></OrderGuard>} />
        </Routes>
      </BrowserRouter>
      
    </AppFlowProvider>
  );
}