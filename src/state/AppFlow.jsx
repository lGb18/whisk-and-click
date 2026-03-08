import { createContext, useContext, useState } from "react";

const AppFlowContext = createContext();

export function AppFlowProvider({ children }) {
  const [cakeConfig, setCakeConfig] = useState({
    occasion: "",
    budget: "",
    size: "",
    tiers: "",
    frosting: "",
    style: "",
    colorTheme: "",
    shape: "Round"
  });

  const [chatHistory, setChatHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCake, setSelectedCake] = useState(null);
  const [fallbackPrompt, setFallbackPrompt] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  function resetFlow() {
    setCakeConfig({
      occasion: "",
      budget: "",
      size: "",
      tiers: "",
      frosting: "",
      style: "",
      colorTheme: "",
      shape: "Round"
    });
    setChatHistory([]);
    setRecommendations([]);
    setSelectedCake(null);
    setFallbackPrompt("");
    setCreatedOrder(null);
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