import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppFlow } from "../state/AppFlow";
import PageHeader from "../components/PageHeader";
import SecondaryButton from "../components/SecondaryButton";
import PrimaryButton from "../components/PrimaryButton";

// --- FIXED GENERATE TITLE ---
// Uses the new database 'name' column or safely falls back to the JSON metadata
const generateTitle = (cake) => {
  if (cake?.name && cake.name.trim() !== "") return cake.name;
  if (cake?.title && cake.title.trim() !== "") return cake.title;
  
  const flavorStr = cake?.metadata?.inferred_flavor || "Signature";
  const styleStr = cake?.metadata?.theme || cake?.metadata?.frosting_style || "Classic";
  
  const capitalize = (str) => {
    if (!str) return "";
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
  };
  return `${capitalize(styleStr)} ${capitalize(flavorStr)} Cake`;
};

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const {
    cakeConfig,
    selectedCake,
    selectedFallback,
    customizationDraft,
    setCustomizationDraft,
  } = useAppFlow();

  const COLOR_THEMES = ['Dark', 'Rainbow', 'Black and White', 'Butterbeer', 'Pastel'];
  const TOPPER_OPTIONS = ['None', 'Birthday Candle', 'Figurine', 'Paper Flowers', 'Custom Plaque'];
  const SIZE_OPTIONS   = ['Smaller', 'Standard', 'Larger'];

  const isFallbackEmpty = !selectedFallback || Object.keys(selectedFallback).length === 0;
  const hasSelection = selectedCake || !isFallbackEmpty;
  
  // Protect the route if they navigate here directly without a cake
  useEffect(() => {
    if (!hasSelection) {
      navigate("/wizard");
    }
  }, [hasSelection, navigate]);

  if (!hasSelection) return null;

  // --- DERIVE DISPLAY DATA (UPDATED FOR SPRINT 1 VECTORS) ---
  const isCatalog = !!selectedCake;
  const displayTitle = isCatalog ? generateTitle(selectedCake) : "Custom AI Concept";
  
  // FIXED: Using image_url from Supabase schema
  const displayImage = isCatalog ? selectedCake.image_url : selectedFallback?.imageUrl; 
  
  // FIXED: Translate math vectors to English strings for the UI
  let displayFlavor = "Signature Base";
  if (isCatalog && selectedCake?.metadata?.inferred_flavor) {
     displayFlavor = selectedCake.metadata.inferred_flavor;
  } else if (!isCatalog && cakeConfig?.flavor) {
     displayFlavor = cakeConfig.flavor >= 5 ? "Premium Specialty" : "Classic Standard";
  }

  let displayOccasion = "Special Event";
  if (isCatalog && selectedCake?.metadata?.theme) {
     displayOccasion = selectedCake.metadata.theme;
  } else if (!isCatalog && cakeConfig?.aesthetic) {
     if (cakeConfig.aesthetic <= 3) displayOccasion = "Formal / Elegant";
     else if (cakeConfig.aesthetic >= 8) displayOccasion = "Playful / Novelty";
     else displayOccasion = "Classic Celebration";
  }

  return (
    <div className="page-shell checkout-shell">
      <div className="container-wide">
        
        <PageHeader
          title="Refine Your Design"
          subtitle="Review your base selection and add your personal touches before checkout."
        />

        <div className="checkout-layout" style={{ marginTop: "var(--space-xl)" }}>
          
          {/* ==========================================
              LEFT COLUMN: VISUAL ANCHOR
              ========================================== */}
          <aside style={{ position: "sticky", top: "24px" }}>
            <div className="card summary-card" style={{ padding: "var(--space-md)" }}>
              
              <div style={{ 
                aspectRatio: "4/3",
                width: "100%", 
                backgroundColor: "var(--surface-muted)", 
                borderRadius: "var(--radius-card)", 
                overflow: "hidden",
                marginBottom: "var(--space-md)"
              }}>
                <img 
                  src={displayImage} 
                  alt={displayTitle} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.src = "/assets/placeholder.png"; e.target.style.objectFit = "contain"; }}
                />
              </div>
              
              <h2 style={{ fontSize: "var(--font-h2-size)", margin: "0 0 var(--space-xs) 0" }}>
                {displayTitle}
              </h2>
              
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "var(--space-sm)" }}>
                <span style={{ 
                  padding: "4px 12px", 
                  backgroundColor: "var(--primary)", 
                  color: "var(--surface)", 
                  borderRadius: "16px", 
                  fontSize: "13px", 
                  fontWeight: "600",
                  textTransform: "capitalize"
                }}>
                  {displayOccasion}
                </span>
                <span style={{ 
                  padding: "4px 12px", 
                  backgroundColor: "var(--surface-muted)", 
                  color: "var(--text-primary)", 
                  borderRadius: "16px", 
                  fontSize: "13px", 
                  fontWeight: "600",
                  textTransform: "capitalize"
                }}>
                  {displayFlavor}
                </span>
              </div>
              
              {!isCatalog && (
                <p className="caption" style={{ marginTop: "var(--space-md)", color: "var(--warning)" }}>
                  ★ Generated via Custom AI Design Request
                </p>
              )}
            </div>
          </aside>

          {/* ==========================================
              RIGHT COLUMN: CUSTOMIZATION FORM
              ========================================== */}
          <section className="checkout-form card" style={{ padding: "var(--space-xl)" }}>
            <h3 className="form-heading" style={{ marginBottom: "var(--space-lg)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-sm)" }}>
              Customization Options
            </h3>
            
            <fieldset className="form-section">
              <label className="form-field">
                <span>Color Theme</span>
                <select
                  value={customizationDraft.colorTheme}
                  onChange={(e) => setCustomizationDraft(d => ({ ...d, colorTheme: e.target.value }))}
                  style={{ backgroundColor: "var(--surface-muted)", border: "none" }}
                >
                  <option value="" disabled>Select a theme…</option>
                  {COLOR_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>

              <label className="form-field">
                <span>Topper Preference</span>
                <select
                  value={customizationDraft.topperPreference}
                  onChange={(e) => setCustomizationDraft(d => ({ ...d, topperPreference: e.target.value }))}
                  style={{ backgroundColor: "var(--surface-muted)", border: "none" }}
                >
                  <option value="" disabled>Choose topper…</option>
                  {TOPPER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>

              <label className="form-field">
                <span>Size Adjustment</span>
                <select
                  value={customizationDraft.sizeAdjustment}
                  onChange={(e) => setCustomizationDraft(d => ({ ...d, sizeAdjustment: e.target.value }))}
                  style={{ backgroundColor: "var(--surface-muted)", border: "none" }}
                >
                  <option value="" disabled>Select size…</option>
                  {SIZE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </fieldset>

            <fieldset className="form-section" style={{ marginTop: "var(--space-xl)" }}>
              <h3 className="form-heading" style={{ marginBottom: "var(--space-md)", fontSize: "var(--font-h3-size)" }}>
                Personalization
              </h3>
              
              <label className="form-field">
                <span>Cake Message (Optional)</span>
                <input
                  type="text"
                  placeholder="Happy Birthday!"
                  value={customizationDraft.cakeMessage}
                  onChange={(e) => setCustomizationDraft(prev => ({ ...prev, cakeMessage: e.target.value }))}
                  style={{ backgroundColor: "var(--surface-muted)", border: "none" }}
                  maxLength={50}
                />
                <span className="caption" style={{ alignSelf: "flex-end", fontWeight: "normal" }}>
                  {customizationDraft.cakeMessage.length}/50
                </span>
              </label>

              <label className="form-field">
                <span>Special Instructions</span>
                <textarea
                  placeholder="Any dietary restrictions or specific design tweaks? (Less sweet)"
                  rows={4}
                  value={customizationDraft.specialInstructions}
                  onChange={(e) => setCustomizationDraft(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  style={{ backgroundColor: "var(--surface-muted)", border: "none", resize: "vertical" }}
                />
              </label>
            </fieldset>

            <div className="checkout-actions" style={{ marginTop: "var(--space-2xl)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-lg)" }}>
              <SecondaryButton onClick={() => navigate(-1)}>
                Back
              </SecondaryButton>
              <PrimaryButton onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </PrimaryButton>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}