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

  const [customizationDraft, setCustomizationDraft] = useState({
    colorTheme: "",
    cakeMessage: "",
    sizeAdjustment: "",
    topperPreference: "",
    specialInstructions: "",
  });

  const [checkoutDraft, setCheckoutDraft] = useState({
    fullName: "",
    contactNumber: "",
    fulfillmentType: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postalCode: "",
    paymentMethod: "",
    paymentReference: "",
  });

  const [chatHistory, setChatHistory] = useState([]);
  
  const [recommendations, setRecommendations] = useState({});
  const [selectedCake, setSelectedCake] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);
  
  const [fallbackPrompt, setFallbackPrompt] = useState("");
  const [fallbackStatus, setFallbackStatus] = useState("");
  const [fallbackResult, setFallbackResult] = useState({});
  const [fallbackError, setFallbackError] = useState("");
  const [selectedFallback, setSelectedFallback] = useState({});
  // const [placeOrder, setPlaceOrder] = useState(null);

  
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

    setRecommendations({});
    setSelectedCake(null);
    setCreatedOrder(null);
    setCustomizationDraft({
      fullName: "",
      contactNumber: "",
      fulfillmentType: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      region: "",
      postalCode: "",
      paymentMethod: "",
      paymentReference: "",
    });
    setCheckoutDraft({
      fullName: "",
      contactNumber: "",
      fulfillmentType: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      region: "",
      postalCode: "",
      paymentMethod: "",
      paymentReference: "",
    });
    // setPlaceOrder(null);
    setFallbackPrompt("");
    setFallbackStatus("");
    setFallbackResult({});
    setFallbackError("");
    setSelectedFallback({});
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
        setFallbackStatus,
        fallbackStatus,
        setFallbackResult,
        fallbackResult,
        setFallbackError,
        fallbackError,
        fallbackPrompt,
        setFallbackPrompt,
        createdOrder,
        setCreatedOrder,
        setCustomizationDraft,
        customizationDraft,
        setSelectedFallback,
        selectedFallback,
        checkoutDraft,
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