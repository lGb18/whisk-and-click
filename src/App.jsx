import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WizardPage from "./pages/WizardPage";
import SummaryPage from "./pages/SummaryPage";
import RecommendationsPage from "./pages/RecommendationPage";
import GeneratorPage from "./pages/GeneratorPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import { AppFlowProvider } from "./state/AppFlow";

export default function App() {
  return (
    <AppFlowProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/fallback" element={<GeneratorPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        </Routes>
      </BrowserRouter>
    </AppFlowProvider>
  );
}