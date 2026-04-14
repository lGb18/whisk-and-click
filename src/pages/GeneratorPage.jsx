import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppFlow } from "../state/AppFlow";
import { configPrompt } from "../utils/configPrompt";
import PageHeader from "../components/PageHeader";
import WarningAlert from "../components/WarningAlert";
import SecondaryButton from "../components/SecondaryButton";
import PrimaryButton from "../components/PrimaryButton";
import { aiGenerator } from "../utils/aiGenerator";


export default function GeneratorPage() {
  const navigate = useNavigate();
  const { 
    cakeConfig, 
    fallbackPrompt,
    fallbackStatus,
    fallbackResult, 
    setFallbackPrompt, 
    setFallbackError,
    setFallbackStatus,
    setFallbackResult,
    selectedFallback,
    setSelectedFallback, 
  } = useAppFlow();

  console.log('configPrompt: ', configPrompt(cakeConfig))
  console.log(cakeConfig);

  const handleFallbackDesign  = (fallback) => {
    setSelectedFallback(fallback);
    console.log(selectedFallback);
    navigate('/order-confirmation');
  }

  const generateFallbackImage = async() => {
    const prompt = configPrompt(cakeConfig);

    setFallbackPrompt(prompt);
    setFallbackStatus("loading");
    setFallbackError("");

    aiGenerator(prompt, "pollinations", {
      model: "zimage",
      width: 640,
      height: 360,
    })
      .then((result) => {
        setFallbackResult(result);
        setFallbackStatus("success");
        console.log(result);
        console.log("url:", result.imageUrl);
        console.log("status:", result.status);
      })
      .catch((error) => {
        console.error(error);
        setFallbackError(error.message || "Generation failed.");
        setFallbackStatus("error");
      });
  }

  useEffect(() => {
    generateFallbackImage();
  }, []); // Logic untouched

  return (
    <div className="page-shell">
      <div
        className="container-narrow"
        style={{ 
          maxWidth: "720px", // Slightly tighter for a more focused "app" feel
          display: "flex", 
          flexDirection: "column", 
          gap: "var(--space-xl)" 
        }}
      >
        <header style={{ textAlign: "center" }}>
          <PageHeader
            title="Custom AI Studio"
            subtitle="Your request is wonderfully unique. We couldn't find an exact match in our bakery, so our AI is sketching a custom concept just for you."
          />
        </header>

        {/* Keeping the alert, but you might want to switch this to an InfoAlert later */}
        {fallbackStatus === "error" && (
           <WarningAlert message="We hit a snag while drawing your cake. Please try regenerating." />
        )}

        <div
          className={`card ${fallbackStatus === "loading" ? "skeleton-pulse" : ""}`}
          style={{
            width: "100%",
            aspectRatio: "16/9", // Ensures responsive scaling instead of hardcoded 640x360
            backgroundColor: "var(--surface-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
            boxShadow: "var(--shadow-card)",
            padding: fallbackStatus !== "success" ? "var(--space-lg)" : "0"
          }}
        >
          {fallbackStatus === "loading" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", color: "var(--text-secondary)" }}>
              {/* Simple CSS Spinner inline */}
              <div style={{ width: "40px", height: "40px", border: "4px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <span style={{ fontWeight: "500" }}>Baking your custom concept...</span>
            </div>
          )}

          {fallbackStatus === "error" && (
            <div style={{ color: "var(--error)", textAlign: "center" }}>
              <span style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}>⚠️</span>
              Generation failed.
            </div>
          )}

          {fallbackStatus === "success" && fallbackResult?.imageUrl && (
            <img
              src={fallbackResult.imageUrl}
              alt="AI Generated Custom Cake"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // changed to cover so it fills the premium card beautifully
                borderRadius: "var(--radius-card)",
                animation: "fadeIn 0.5s ease-in" // Smooth reveal
              }} 
            />
          )}
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>

        {/* Action Bar: Reordered for HCI priority */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "var(--space-md)", 
          marginTop: "var(--space-sm)" 
        }}>
          
          <div style={{ display: "flex", gap: "var(--space-md)", width: "100%" }}>
            <SecondaryButton 
              onClick={generateFallbackImage}
              style={{ flex: 1 }}
              disabled={fallbackStatus === "loading"}
            >
              {fallbackStatus === "loading" ? "Generating..." : "Regenerate Design"}
            </SecondaryButton>

            <PrimaryButton 
              onClick={() => handleFallbackDesign(fallbackResult)}
              style={{ flex: 2 }} // Gives more visual weight to the primary action
              disabled={fallbackStatus !== "success"}
            >
              Select & Customize
            </PrimaryButton>
          </div>

          <button 
            onClick={() => navigate("/recommendations")}
            style={{ 
              background: "none", 
              border: "none", 
              color: "var(--text-secondary)", 
              textDecoration: "underline", 
              cursor: "pointer",
              padding: "var(--space-sm)",
              fontSize: "var(--font-caption-size)"
            }}
          >
            &larr; Go back to recommendations
          </button>
        </div>

      </div>
    </div>
  );
}