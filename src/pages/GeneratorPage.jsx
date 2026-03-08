import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppFlow } from "../state/AppFlow";
import { configPrompt } from "../utils/configPrompt";
import PageHeader from "../components/PageHeader";
import WarningAlert from "../components/WarningAlert";
import SecondaryButton from "../components/SecondaryButton";

export default function GeneratorPage() {
  const navigate = useNavigate();
  const { cakeConfig, fallbackPrompt, setFallbackPrompt } = useAppFlow();

  useEffect(() => {
    setFallbackPrompt(configPrompt(cakeConfig));
  }, [cakeConfig, setFallbackPrompt]);

  return (
    <div className="page-shell">
      <div
        className="container-narrow"
        style={{ maxWidth: "860px", display: "flex", flexDirection: "column", gap: "24px" }}
      >
        <PageHeader
          title="AI Generated Cake Design"
          subtitle="No strong match was found from bakery references."
        />

        <WarningAlert message="No similar cake was found. AI generation was used instead." />

        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <strong>Generated Prompt</strong>
          <div>{fallbackPrompt}</div>
        </div>

        <div
          className="card"
          style={{
            width: "640px",
            height: "360px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto"
          }}
        >
          Generated Image Placeholder
        </div>

        <SecondaryButton onClick={() => navigate("/recommendations")}>
          Back to Recommendations
        </SecondaryButton>
      </div>
    </div>
  );
}