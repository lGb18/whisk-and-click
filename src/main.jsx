import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { SpeedInsights } from "@vercel/speed-insights/react"

focusManager.setEventListener((handleFocus) => {
  if (typeof window !== 'undefined' && window.addEventListener) {
    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        setTimeout(handleFocus, 500); 
      }
    };
    
    // Listen to visibility instead of focus for better mobile support
    window.addEventListener('visibilitychange', visibilityHandler);
    
    return () => {
      window.removeEventListener('visibilitychange', visibilityHandler);
    };
  }
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      retry: 1,
      networkMode: 'always',
    },
    mutations: {
      networkMode: 'always',
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <App />
    <SpeedInsights/>
    </QueryClientProvider>
  // </React.StrictMode>
  
);