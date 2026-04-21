import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppFlow } from "../state/AppFlow";
import { useRecommendations } from "../hooks/useRecommendations";
import PageHeader from "../components/PageHeader";
import RecommendationCard from "../components/RecommendationCard";
import SecondaryButton from "../components/SecondaryButton";

export default function RecommendationPage() {
  const navigate = useNavigate();
  const {
    cakeConfig,
    recommendations,
    setSelectedCake,
    setSelectedFallback,
  } = useAppFlow();
  
  // Assuming this hook populates the `recommendations` object in your AppFlow state
  const { topMatches, isWeakMatch, isLoading } = useRecommendations(cakeConfig);
  
  // The Threshold Check: If it's a weak match, force an empty list to trigger your Fallback UI
  const topList = isWeakMatch ? [] : (topMatches || []);

  // Prevent the UI from flashing the "No Matches" screen while Supabase is fetching
  if (isLoading) {
    return (
      <div className="page-shell" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div style={{ width: "40px", height: "40px", border: "4px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  
  function handleSelect(cake) {
    setSelectedCake(cake);
    setSelectedFallback(null);
    navigate("/order-confirmation");
  }

  return (
    <div className="page-shell">
      <div className="container-wide layout-stack">
        <PageHeader
          title="Recommended Cake Designs"
          subtitle="We found these close bakeshop matches based on your preferences."
        />

        {topList.length > 0 ? (
          <div className="category-grid">
            {topList.map((cake) => (
              <RecommendationCard 
                key={cake.cake_id || cake.id}
                cake={cake} 
                onSelect={handleSelect} 
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: "var(--space-xl)", textAlign: "center" }}>
            <h3 style={{ fontSize: "var(--font-h2-size)" }}>No exact bakeshop matches found.</h3>
            <p>Your taste is wonderfully unique! Let's build a custom concept.</p>
          </div>
        )}

        <div 
          className="card" 
          style={{ 
            marginTop: "var(--space-xl)", 
            padding: "var(--space-xl)", 
            backgroundColor: "var(--surface-muted)",
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            textAlign: "center",
            gap: "var(--space-md)"
          }}
        >
          <h3 style={{ fontSize: "var(--font-h3-size)", margin: 0 }}>Didn't quite find what you were looking for?</h3>
          <p style={{ color: "var(--text-secondary)", margin: 0, maxWidth: "500px" }}>
            
          </p>
          <SecondaryButton 
            onClick={() => navigate("/fallback")}
            style={{ 
              marginTop: "var(--space-sm)", 
              backgroundColor: "var(--surface)", 
              borderColor: "var(--primary)",
              color: "var(--primary)"
            }}
          >
            Launch Custom Generator
          </SecondaryButton>
        </div>

      </div>
    </div>
  );
}