import React from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

export default function PromoPage() {
  const navigate = useNavigate();

  return (
    <main 
      className="page-shell" 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        minHeight: "calc(100vh - 100px)"
      }}
    >
      <div 
        className="container-narrow" 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          textAlign: "center",
          padding: "var(--space-3xl) var(--space-lg)",
          maxWidth: "540px"
        }}
      >
        <div 
          style={{ 
            width: "96px", 
            height: "96px", 
            backgroundColor: "var(--surface-muted)", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            fontSize: "48px",
            marginBottom: "var(--space-xl)",
            boxShadow: "var(--shadow-card-soft)"
          }}
          aria-hidden="true"
        >
          🎁
        </div>

        <h1 style={{ 
          fontSize: "var(--font-h1-size)", 
          fontWeight: "var(--font-h1-weight)", 
          fontFamily: "var(--font-heading)",
          color: "var(--text-primary)",
          margin: "0 0 var(--space-sm) 0" 
        }}>
          Sweet deals are in the oven!
        </h1>
        
        <p style={{ 
          fontSize: "var(--font-body-size)", 
          color: "var(--text-secondary)", 
          lineHeight: "var(--font-body-line)",
          margin: "0 0 var(--space-2xl) 0" 
        }}>
          We don't have any active promotions at this exact moment, but our bakers are always working on something special. Please check back later for new offers.
        </p>

        <div style={{ 
          display: "flex", 
          gap: "var(--space-md)", 
          flexWrap: "wrap", 
          justifyContent: "center",
          width: "100%"
        }}>
          <SecondaryButton 
            onClick={() => navigate("/")}
            style={{ minWidth: "160px" }}
          >
            Return Home
          </SecondaryButton>
          
          <PrimaryButton 
            onClick={() => navigate("/catalog")}
            style={{ minWidth: "160px" }}
          >
            Shop the Catalog
          </PrimaryButton>
        </div>

        <div style={{ marginTop: "var(--space-3xl)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-xl)", width: "100%" }}>
          <p className="caption" style={{ color: "var(--text-secondary)" }}>
            Want to be the first to know? Keep an eye on your dashboard notifications.
          </p>
        </div>

      </div>
    </main>
  );
}