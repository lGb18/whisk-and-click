// recommendationEngine react invocation
import { recommendationEngine } from "../utils/recommendationEngine";
import { useAppFlow } from "../state/AppFlow";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRecommendations(config, catalog){  
    const navigate = useNavigate(); 
    const { setRecommendations } = useAppFlow();
    
    useEffect(() => {
    const result = recommendationEngine(config, catalog);

    setRecommendations(result);
    if (result.isWeakMatch){
        navigate("/fallback");
    }
  }, [config, catalog, setRecommendations, navigate]);

  }

  
//   console.log("hook reco:", config, catalog);