import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import { useAppFlow } from "../state/AppFlow";
import { createOrder } from "../utils/createOrder"
import { supabase } from "../lib/supabaseClient";
import { createPaymentForOrder, uploadPaymentProof } from "../utils/paymentQueries";

function buildAddressSummary({ addressLine1, addressLine2, city, region, postalCode }) {
  const parts = [addressLine1, addressLine2, city, region, postalCode]
    .filter(Boolean)
    .join(", ");
  return parts || "Delivery address pending";
}

function formatPaymentMethodLabel(method) {
  switch (method) {
    case "cod": return "Cash on Delivery/Pickup";
    case "gcash": return "GCash";
    case "bank_transfer": return "Bank Transfer";
    case "manual_other": return "Other Manual";
    default: return "Credit / Debit Card";
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const {
    cakeConfig,
    selectedCake,
    customizationDraft,
    checkoutDraft,
    setCheckoutDraft,
    setCreatedOrder,
    createdOrder,
    selectedFallback,
    resetFlow,
  } = useAppFlow();

  const [paymentDraft, setPaymentDraft] = useState({
    paymentMethod: "cod", 
    referenceNumber: "",
    proofFile: null,
    notes: "",
  });
  
  // 1. DATA & AUTH GUARD
  useEffect(() => {
    const verifyAccess = async () => {
      if ((!selectedCake && !selectedFallback) || !cakeConfig) {
        navigate("/");
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate(`/auth?redirectTo=${encodeURIComponent(location.pathname)}`);
      } else {
        setIsAuthChecking(false);
      }
    };
    verifyAccess();
  }, [selectedCake, cakeConfig, selectedFallback, navigate, location.pathname]);

  const [formState, setFormState] = useState(() => ({
    fullName: checkoutDraft?.fullName || "",
    contactNumber: checkoutDraft?.contactNumber || "",
    fulfillmentType: checkoutDraft?.fulfillmentType || "pickup",
    addressLine1: checkoutDraft?.addressLine1 || "",
    addressLine2: checkoutDraft?.addressLine2 || "",
    city: checkoutDraft?.city || "",
    region: checkoutDraft?.region || "",
    postalCode: checkoutDraft?.postalCode || "",
    paymentMethod: checkoutDraft?.paymentMethod || "cod", 
    paymentReference: checkoutDraft?.paymentReference || "",
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Sync state with Context
  useEffect(() => {
    if (!checkoutDraft) return;
    setFormState((prev) => ({ ...prev, ...checkoutDraft }));
  }, [checkoutDraft]);

  useEffect(() => {
    if (!checkoutDraft) return;
    const isDifferent = JSON.stringify(checkoutDraft) !== JSON.stringify(formState);
    if (isDifferent && typeof setCheckoutDraft === "function") {
      setCheckoutDraft(formState);
    }
  }, [formState, checkoutDraft, setCheckoutDraft]);

  function handleChange(field) {
    return (event) => {
      const value = event.target.value;
      setFormState((prev) => ({ ...prev, [field]: value }));
    };
  }

  const requiresAddress = formState.fulfillmentType === "delivery";

  const isSubmitDisabled = useMemo(() => {
    setSubmitError("Please complete all required fields.");
    if (!formState.fullName.trim() || !formState.contactNumber.trim()) return true;
    if (requiresAddress) {
      return (
        !formState.addressLine1.trim() ||
        !formState.city.trim() ||
        !formState.region.trim() ||
        !formState.postalCode.trim()
      );
    }
    return false;
  }, [formState, requiresAddress]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitDisabled || !cakeConfig || (!selectedCake && !selectedFallback)) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("Your session expired. Please sign in again.");

      const orderPayload = createOrder({
        userId: user.id,
        cakeConfig,
        selectedCake,
        selectedFallback,
        customizationDraft,
        checkoutDraft: formState,
      });

      const { data, error } = await supabase.from("orders").insert(orderPayload).select().single();
      if (error) throw new Error(error.message);

      const createdOrder = data;
      setCreatedOrder(createdOrder);

      let proofPath = "";
      if (paymentDraft.proofFile && user?.id && createdOrder?.id) {
        proofPath = await uploadPaymentProof({
          userId: user.id,
          orderId: createdOrder.id,
          file: paymentDraft.proofFile,
        });
      }

      await createPaymentForOrder({
        orderId: createdOrder.id,
        userId: user.id,
        paymentMethod: paymentDraft.paymentMethod,
        amount: null, 
        referenceNumber: paymentDraft.referenceNumber,
        proofPath,
        notes: paymentDraft.notes,
      });
      
      resetFlow();
      navigate("/my-orders");
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "We couldn't finish the checkout just now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAuthChecking) return <div className="page-shell"><p style={{textAlign:"center"}}>Securing checkout...</p></div>;

  // --- FIXED: Derive Display Data for Sidebar ---
  const isCatalog = !!selectedCake;
  
  // 1. Use image_url instead of image
  const displayImage = isCatalog ? selectedCake.image_url : selectedFallback?.imageUrl;
  
  // 2. Use name instead of title
  const displayTitle = isCatalog ? (selectedCake.name || selectedCake.title || "Custom Cake") : "Custom AI Concept";

  // 3. Translate the math vector for flavor into English
  let displayFlavor = "Signature Base";
  if (isCatalog && selectedCake?.metadata?.inferred_flavor) {
     displayFlavor = selectedCake.metadata.inferred_flavor;
  } else if (cakeConfig?.flavor) {
     displayFlavor = cakeConfig.flavor >= 8 ? "Premium Base" : (cakeConfig.flavor <= 3 ? "Classic Base" : "Specialty Base");
  }

  return (
    <div className="page-shell checkout-shell">
      <div className="container-wide">
        <div className="checkout-layout">

          {/* LEFT: THE FORM */}
          <form className="card checkout-form" onSubmit={handleSubmit}>
            <PageHeader
              title="Checkout"
              subtitle="Share how we can reach you by completing the form"
            />

            <fieldset className="form-section">
              <legend className="form-heading">Customer Information</legend>
              <label className="form-field">
                <span>Full name</span>
                <input
                  type="text"
                  value={formState.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="Juan Dela Cruz"
                  required
                />
              </label>
              <label className="form-field">
                <span>Contact number</span>
                <input
                  type="tel"
                  value={formState.contactNumber}
                  onChange={handleChange("contactNumber")}
                  placeholder="0917 123 4567"
                  required
                />
              </label>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-heading">Delivery</legend>
              <div className="button-toggle-group">
                <button
                  type="button"
                  className={`option-button ${formState.fulfillmentType === "pickup" ? "selected" : ""}`}
                  onClick={() => setFormState((prev) => ({ ...prev, fulfillmentType: "pickup" }))}
                >
                  Pickup
                </button>
                <button
                  type="button"
                  className={`option-button ${formState.fulfillmentType === "delivery" ? "selected" : ""}`}
                  onClick={() => setFormState((prev) => ({ ...prev, fulfillmentType: "delivery" }))}
                >
                  Delivery
                </button>
              </div>

              {requiresAddress && (
                <div className="address-grid" style={{ marginTop: "var(--space-md)" }}>
                  <label className="form-field address-full">
                    <span>Street address</span>
                    <input
                      type="text"
                      value={formState.addressLine1}
                      onChange={handleChange("addressLine1")}
                      required={requiresAddress}
                    />
                  </label>
                  <label className="form-field address-full">
                    <span>Apartment, suite, etc. (optional)</span>
                    <input
                      type="text"
                      value={formState.addressLine2}
                      onChange={handleChange("addressLine2")}
                    />
                  </label>
                  <label className="form-field">
                    <span>City</span>
                    <input
                      type="text"
                      value={formState.city}
                      onChange={handleChange("city")}
                      required={requiresAddress}
                    />
                  </label>
                  <label className="form-field">
                    <span>State / Province</span>
                    <input
                      type="text"
                      value={formState.region}
                      onChange={handleChange("region")}
                      required={requiresAddress}
                    />
                  </label>
                  <label className="form-field">
                    <span>Postal code</span>
                    <input
                      type="text"
                      value={formState.postalCode}
                      onChange={handleChange("postalCode")}
                      required={requiresAddress}
                    />
                  </label>
                </div>
              )}
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-heading">Payment</legend>

              <div className="button-toggle-group" style={{ flexWrap: "wrap" }}>
                {[
                  { value: "cod", label: "Cash on Delivery/Pickup" },
                  { value: "gcash", label: "GCash" },
                  { value: "bank_transfer", label: "Bank Transfer" },
                  { value: "manual_other", label: "Other Manual" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`option-button ${paymentDraft.paymentMethod === option.value ? "selected" : ""}`}
                    onClick={() =>
                      setPaymentDraft((prev) => ({
                        ...prev,
                        paymentMethod: option.value,
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {paymentDraft.paymentMethod !== "cod" && (
                <div style={{ marginTop: "var(--space-md)", padding: "var(--space-md)", backgroundColor: "var(--surface-muted)", borderRadius: "var(--radius-input)" }}>
                  <label className="form-field">
                    <span>Reference Number</span>
                    <input
                      type="text"
                      value={paymentDraft.referenceNumber}
                      onChange={(e) => setPaymentDraft((prev) => ({ ...prev, referenceNumber: e.target.value }))}
                      placeholder="Enter payment reference number"
                      style={{ backgroundColor: "var(--surface)" }}
                    />
                  </label>

                  <label className="form-field" style={{ marginTop: "var(--space-md)" }}>
                    <span>Payment Proof (Screenshot)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPaymentDraft((prev) => ({ ...prev, proofFile: e.target.files?.[0] ?? null }))}
                      style={{ border: "none", padding: "8px 0" }}
                    />
                  </label>
                </div>
              )}

              <label className="form-field" style={{ marginTop: "var(--space-md)" }}>
                <span>Payment Notes</span>
                <input
                  type="text"
                  value={paymentDraft.notes}
                  onChange={(e) => setPaymentDraft((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional payment note"
                />
              </label>
            </fieldset>

            {submitError && <div className="alert alert-error" style={{ marginBottom: "var(--space-md)" }}>{submitError}</div>}

            <div className="checkout-actions">
              <PrimaryButton type="submit" disabled={isSubmitDisabled || isSubmitting} style={{ flex: 1 }}>
                {isSubmitting ? "Processing Order..." : "Place Order"}
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => navigate("/order-confirmation")} style={{ flex: 1 }}>
                Edit Customization
              </SecondaryButton>
            </div>
          </form>

          {/* RIGHT: THE RECEIPT (HCI anchored summary) */}
          <aside className="checkout-summary" style={{ position: "sticky", top: "24px" }}>
            <div className="summary-card card">
              
              <div 
                className="summary-preview" 
                style={{ 
                  backgroundImage: `url(${displayImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "12px",
                  height: "180px",
                  marginBottom: "var(--space-md)"
                }} 
              />
              
              <div className="summary-details">
                <h3 className="summary-title" style={{ fontSize: "var(--font-h3-size)" }}>Order Summary</h3>
                <p className="summary-item" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "8px", marginBottom: "8px" }}>
                  <strong>{displayTitle}</strong>
                </p>
                
                {/* FIXED: Uses the translated displayFlavor instead of raw vector number */}
                <p className="summary-item"><span>Flavor</span> <span style={{ textTransform: "capitalize" }}>{displayFlavor}</span></p>
                
                {customizationDraft?.sizeAdjustment && (
                  <p className="summary-item"><span>Size</span> <span style={{ textTransform: "capitalize" }}>{customizationDraft.sizeAdjustment}</span></p>
                )}
                {customizationDraft?.colorTheme && (
                  <p className="summary-item"><span>Theme</span> <span style={{ textTransform: "capitalize" }}>{customizationDraft.colorTheme}</span></p>
                )}
              </div>
            </div>

            <div className="summary-card card">
              <h3 className="summary-title" style={{ fontSize: "16px" }}>Personalization</h3>
              
              {customizationDraft?.cakeMessage && (
                <div style={{ marginBottom: "var(--space-sm)" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600" }}>Cake Message:</span>
                  <p className="summary-copy" style={{ marginTop: "2px", fontStyle: "italic" }}>"{customizationDraft.cakeMessage}"</p>
                </div>
              )}
              
              <div>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600" }}>Special Instructions:</span>
                <p className="summary-copy" style={{ marginTop: "2px" }}>
                  {customizationDraft?.specialInstructions || "None provided."}
                </p>
              </div>
            </div>

            <div className="summary-card card">
              <h3 className="summary-title" style={{ fontSize: "16px" }}>Checkout Details</h3>
              <p className="summary-item">
                <span>Method</span>
                <span style={{ fontWeight: "600" }}>{formState.fulfillmentType === "delivery" ? "Delivery" : "Store Pickup"}</span>
              </p>
              <p className="summary-item">
                <span>Payment</span>
                <span>{formatPaymentMethodLabel(paymentDraft.paymentMethod)}</span>
              </p>
              
              <hr className="summary-divider" style={{ margin: "12px 0" }} />
              
              <p className="summary-item">
                <span>Contact</span>
                <span>{formState.contactNumber || "—"}</span>
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "var(--text-secondary)", paddingTop: "4px" }}>
                <span>Address</span>
                <span style={{ textAlign: "right", maxWidth: "60%" }}>
                  {formState.fulfillmentType === "delivery" ? buildAddressSummary(formState) : "Pick up in store"}
                </span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}