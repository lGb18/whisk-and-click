import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppFlow } from "../state/AppFlow";
import { configPrompt } from "../utils/configPrompt";
import PageHeader from "../components/PageHeader";
import WarningAlert from "../components/WarningAlert";
import SecondaryButton from "../components/SecondaryButton";
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
  } = useAppFlow();
  console.log('configPrompt: ', configPrompt(cakeConfig))
  console.log(cakeConfig)
  useEffect(() => {
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
  }, [
    cakeConfig,
    setFallbackPrompt,
    setFallbackResult,
    setFallbackStatus,
    setFallbackError,
  ]);
  
  // useEffect(() => {
  //   setFallbackPrompt(configPrompt(cakeConfig));
  // }, [cakeConfig, setFallbackPrompt]);

  return (
    <div className="page-shell">
      <div
        className="container-narrow"
        style={{ maxWidth: "860px", display: "flex", flexDirection: "column", gap: "24px" }}
      >
        <PageHeader
          title="Whisk and Click"
          subtitle="No strong match was found from bakery references."
        />

        <WarningAlert message="No similar cake was found. Reference generation was used instead." />

        {/* <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <strong>Generated Prompt</strong>
          <div>{fallbackPrompt}</div>
        </div> */}

        <div
          className="card"
          style={{
            width: "640px",
            height: "360px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            padding: "16px",
          }}
          >
            {fallbackStatus === "loading" && <div>Generating image...</div>}
            {fallbackStatus === "error" && (
              <div>Generation failed.</div>
            )}
            {fallbackStatus === "success" && fallbackResult?.imageUrl && (
            <img
            src={fallbackResult.imageUrl}
            style={{
              maxWidth: "100%",
              maxHeight: "360px",
              objectFit: "contain",
              borderRadius: "12px" 
              }} 
            />
            )}
        </div>

        <SecondaryButton onClick={() => navigate("/recommendations")}>
          Back to Recommendations
        </SecondaryButton>
      </div>
    </div>
  );
}