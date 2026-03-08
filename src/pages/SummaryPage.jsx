import { useNavigate } from "react-router-dom";
import { useAppFlow } from "../state/AppFlow";
import { validateConfig } from "../utils/validateConfig";
import PageHeader from "../components/PageHeader";
import SecondaryButton from "../components/SecondaryButton";
import PrimaryButton from "../components/PrimaryButton";
import ErrorAlert from "../components/ErrorAlert";
import WarningAlert from "../components/WarningAlert";

export default function SummaryPage() {
  const navigate = useNavigate();
  const { cakeConfig } = useAppFlow();

  const result = validateConfig(cakeConfig);

  return (
    <div className="page-shell">
      <div className="container-summary">
        <div
          className="card"
          style={{
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}
        >
          <PageHeader
            title="Review Your Cake Design"
            subtitle="Check the selected cake properties before continuing."
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Object.entries(cakeConfig).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>

          {result.errors.map((error) => (
            <ErrorAlert key={error.id} message={`${error.message} ${error.suggestion || ""}`} />
          ))}

          {result.warnings.map((warning) => (
            <WarningAlert key={warning.id} message={`${warning.message} ${warning.suggestion || ""}`} />
          ))}

          <div style={{ display: "flex", gap: "16px" }}>
            <SecondaryButton onClick={() => navigate("/wizard")}>Back</SecondaryButton>
            {result.valid && (
              <PrimaryButton onClick={() => navigate("/recommendations")}>
                Show Recommendations
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}