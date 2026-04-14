import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppFlow } from "../state/AppFlow";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

// --- HELPER FUNCTIONS ---
const generateTitle = (cake) => {
  if (cake?.title && cake.title.trim() !== "") return cake.title;
  const flavor = cake?.flavor && cake.flavor !== "unknown" ? cake.flavor : "Signature";
  const style = cake?.style && cake.style !== "unknown" ? cake.style : "Classic";
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  return `${capitalize(style)} ${capitalize(flavor)} Cake`;
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
  console.log(selectedFallback);
  console.log(selectedCake);
  // Protect the route if they navigate here directly without a cake
  useEffect(() => {
    if (!hasSelection) {
      navigate("/wizard");
    }
  }, [hasSelection, navigate]);

  if (!hasSelection) return null;

  // --- DERIVE DISPLAY DATA ---
  const isCatalog = !!selectedCake;
  const displayTitle = isCatalog ? generateTitle(selectedCake) : "Custom AI Concept";
  const displayImage = isCatalog ? selectedCake.image : selectedFallback?.imageUrl;
  
  // Use config fallbacks if the catalog item is missing specific metadata
  const displayFlavor = isCatalog && selectedCake.flavor !== "unknown" 
    ? selectedCake.flavor 
    : (cakeConfig?.flavor || "Baker's Choice");
    
  const displayOccasion = isCatalog && selectedCake.occasion !== "unknown" 
    ? selectedCake.occasion 
    : (cakeConfig?.occasion || "Special Event");

  return (
    <div className="page-shell checkout-shell">
      <div className="container-wide">
        
        <PageHeader
          title="Refine Your Design"
          subtitle="Review your base selection and add your personal touches before checkout."
        />

        {/* Configurator Layout: Uses your existing CSS grid for checkout 
          Left: Visual Anchor | Right: Interactive Form
        */}
        <div className="checkout-layout" style={{ marginTop: "var(--space-xl)" }}>
          
          {/* ==========================================
              LEFT COLUMN: VISUAL ANCHOR
              ========================================== */}
          <aside style={{ position: "sticky", top: "24px" }}>
            <div className="card summary-card" style={{ padding: "var(--space-md)" }}>
              
              <div style={{ 
                height: "360px", 
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
                  placeholder="e.g., Happy Birthday!"
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
                  placeholder="Any dietary restrictions or specific design tweaks? (e.g., Less sweet, no nuts)"
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