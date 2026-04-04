import { createContext, useContext, useState, useEffect  } from "react";

const AppFlowContext = createContext();

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (state === undefined || state === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}
export function AppFlowProvider({ children }) {
  const [cakeConfig, setCakeConfig] = useLocalStorage("app_cakeConfig", {
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

  const [customizationDraft, setCustomizationDraft] = useLocalStorage("app_customizationDraft", {
    colorTheme: "",
    cakeMessage: "",
    sizeAdjustment: "",
    topperPreference: "",
    specialInstructions: "",
  });

  const [checkoutDraft, setCheckoutDraft] = useLocalStorage("app_checkoutDraft", {
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

  const [chatHistory, setChatHistory] = useLocalStorage("app_chatHistory", []);
  
  const [recommendations, setRecommendations] = useLocalStorage("app_recommendations", {});
  const [selectedCake, setSelectedCake] = useLocalStorage("app_selectedCake", null);
  const [createdOrder, setCreatedOrder] = useState(null);
  
  const [fallbackPrompt, setFallbackPrompt] = useLocalStorage("app_fallbackPrompt", "");
  const [fallbackStatus, setFallbackStatus] = useLocalStorage("app_fallbackStatus", "");
  const [fallbackResult, setFallbackResult] = useLocalStorage("app_fallbackResult", {});
  const [fallbackError, setFallbackError] = useLocalStorage("app_fallbackError", "");
  const [selectedFallback, setSelectedFallback] = useLocalStorage("app_selectedFallback", {});
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
      colorTheme: "",
      cakeMessage: "",
      sizeAdjustment: "",
      topperPreference: "",
      specialInstructions: "",
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

    setFallbackPrompt("");
    setFallbackStatus("");
    setFallbackResult({});
    setFallbackError("");
    setSelectedFallback({});

    // Wipe local storage so the user starts totally fresh next time
    localStorage.removeItem("app_cakeConfig");
    localStorage.removeItem("app_customizationDraft");
    localStorage.removeItem("app_checkoutDraft");
    localStorage.removeItem("app_chatHistory");
    localStorage.removeItem("app_recommendations");
    localStorage.removeItem("app_selectedCake");
    localStorage.removeItem("app_fallbackPrompt");
    localStorage.removeItem("app_fallbackStatus");
    localStorage.removeItem("app_fallbackResult");
    localStorage.removeItem("app_fallbackError");
    localStorage.removeItem("app_selectedFallback");
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
  const context = useContext(AppFlowContext);
    if (!context) {
      throw new Error("useAppFlow must be used within AppFlowProvider");
    }
    return context;
}