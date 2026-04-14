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

  const validEntries = Object.entries(cakeConfig || {}).filter(
    ([, value]) => value && String(value).trim() !== ""
  );

  return (
    <div className="page-shell">
      <div className="container-summary layout-stack">
        <div 
          className="card" 
          style={{ 
            padding: "var(--space-2xl)", 
            display: "flex", 
            flexDirection: "column", 
            gap: "var(--space-xl)"
          }}
        >
          <PageHeader
            title="Review Your Cake Design"
            subtitle="Here is the summary of your selected preferences."
          />

          <div style={{
            padding: "var(--space-lg)",
            backgroundColor: "var(--surface-muted)",
            borderRadius: "var(--radius-card)"
          }}>
            <h3 style={{ 
              fontSize: "var(--font-h3-size)", 
              margin: "0 0 var(--space-md) 0", 
              borderBottom: "1px solid var(--border)", 
              paddingBottom: "8px" 
            }}>
              Design Blueprint
            </h3>

            {validEntries.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", margin: 0 }}>No preferences selected yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {validEntries.map(([key, value]) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)", textTransform: "capitalize" }}>
                      {key.replace(/_/g, " ")}
                    </span>
                    <span style={{ color: "var(--text-secondary)", textAlign: "right", textTransform: "capitalize" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {(result.errors.length > 0 || result.warnings.length > 0) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {result.errors.map((error) => (
                <ErrorAlert key={error.id} message={`${error.message} ${error.suggestion || ""}`} />
              ))}

              {result.warnings.map((warning) => (
                <WarningAlert key={warning.id} message={`${warning.message} ${warning.suggestion || ""}`} />
              ))}
            </div>
          )}

          {/* Action Bar */}
          <div style={{ 
            display: "flex", 
            gap: "var(--space-md)", 
            marginTop: "var(--space-sm)",
            paddingTop: "var(--space-lg)",
            borderTop: "1px solid var(--border)"
          }}>
            <SecondaryButton style={{ flex: 1 }} onClick={() => navigate("/wizard")}>
              Edit Preferences
            </SecondaryButton>
            
            {result.valid ? (
              <PrimaryButton style={{ flex: 2 }} onClick={() => navigate("/recommendations")}>
                Show Recommendations
              </PrimaryButton>
            ) : (
              <PrimaryButton style={{ flex: 2, opacity: 0.5, cursor: "not-allowed" }} disabled>
                Resolve Errors to Continue
              </PrimaryButton>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}