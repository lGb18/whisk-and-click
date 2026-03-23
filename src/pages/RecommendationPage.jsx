import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppFlow } from "../state/AppFlow";
import { cakeCatalog } from "../data/cakeCatalog";
import { useRecommendations } from "../hooks/useRecommendation";
import PageHeader from "../components/PageHeader";
import RecommendationCard from "../components/RecommendationCard";
import SecondaryButton from "../components/SecondaryButton";

export default function RecommendationPage() {
  const navigate = useNavigate();
  const {
    cakeConfig,
    recommendations,
    setSelectedCake,
  } = useAppFlow();
  
  useRecommendations(cakeConfig, cakeCatalog);
  const topList = recommendations?.topMatches ?? [];
  
  function handleSelect(cake) {
    setSelectedCake(cake);
    console.log(cake)
    navigate("/order-confirmation");
  }
  // console.log(cakeConfig)
  
  
  return (
    <div className="page-shell">
      <div className="container-wide" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <PageHeader
          title="Recommended Cake Designs"
          subtitle="These are the closest bakery references based on your selected preferences."
        />

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {topList.map((cake) => (
            <RecommendationCard key={cake.id} cake={cake} onSelect={handleSelect} />
          ))}
        </div>

        <SecondaryButton onClick={() => navigate("/fallback")}>
          Generate New Design
        </SecondaryButton>
      </div>
    </div>
  );
}