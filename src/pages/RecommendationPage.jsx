import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppFlow } from "../state/AppFlow";
import { cakeCatalog } from "../data/cakeCatalog";
import { filterCandidates } from "../utils/filterCandidates";
import { scoreSimilarity } from "../utils/scoreSimilarity";
import { createOrder } from "../utils/createOrder";
import PageHeader from "../components/PageHeader";
import RecommendationCard from "../components/RecommendationCard";
import SecondaryButton from "../components/SecondaryButton";

export default function RecommendationPage() {
  const navigate = useNavigate();
  const {
    cakeConfig,
    recommendations,
    setRecommendations,
    setSelectedCake,
    setCreatedOrder
  } = useAppFlow();

  useEffect(() => {
    const filtered = filterCandidates(cakeConfig, cakeCatalog);
    const ranked = scoreSimilarity(cakeConfig, filtered);
    setRecommendations(ranked);
  }, [cakeConfig, setRecommendations]);

  const topMatches = recommendations.slice(0, 3);
  const bestMatch = topMatches[0];

  function handleSelect(cake) {
    setSelectedCake(cake);

    const order = createOrder({
      cakeConfig,
      selectedCake: cake,
      source: "recommendation"
    });

    setCreatedOrder(order);
    navigate("/order-confirmation");
  }

  if (!bestMatch || bestMatch.normalizedScore < 0.6) {
    navigate("/fallback");
    return null;
  }

  return (
    <div className="page-shell">
      <div className="container-wide" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <PageHeader
          title="Recommended Cake Designs"
          subtitle="These are the closest bakery references based on your selected preferences."
        />

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {topMatches.map((cake) => (
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