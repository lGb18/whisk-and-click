import { createContext, useContext, useState } from "react";

const AppFlowContext = createContext();

export function AppFlowProvider({ children }) {
  const [cakeConfig, setCakeConfig] = useState({
    occasion: "",
    flavor: "",
    style: "",
    budget: "",
    size_category: "",
    // tiers: "",
    // frosting: "",
    
    // colorTheme: "",
    // shape: "Round"
  });

  const [chatHistory, setChatHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCake, setSelectedCake] = useState(null);
  const [fallbackPrompt, setFallbackPrompt] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [customizationDraft, setCustomizationDraft] = useState("");
  const [checkoutDraft, setCheckoutDraft] = useState(null);
  const [placeOrder, setPlaceOrder] = useState(null);

  function resetFlow() {
    setCakeConfig({
      occasion: "",
      flavor: "",
      style: "",
      budget: "",
      size_category: "",
      // tiers: "",
      // frosting: "",
      // colorTheme: "",
      // shape: "Round"
      
    });
    setChatHistory([]);
    setRecommendations([]);
    setSelectedCake(null);
    setFallbackPrompt("");
    setCreatedOrder(null);
    setCustomizationDraft(null);
    setCheckoutDraft(null);
    setPlaceOrder(null);
  }

  return (
    <AppFlowContext.Provider
      value={{
        cakeConfig,
        setCakeConfig,
        chatHistory,
        setChatHistory,
        recommendations,
        setRecommendations,
        selectedCake,
        setSelectedCake,
        fallbackPrompt,
        setFallbackPrompt,
        createdOrder,
        setCreatedOrder,
        setCustomizationDraft,
        customizationDraft,
        checkoutDraft,
        placeOrder,
        resetFlow
      }}
    >
      {children}
    </AppFlowContext.Provider>
  );
}

export function useAppFlow() {
  return useContext(AppFlowContext);
}