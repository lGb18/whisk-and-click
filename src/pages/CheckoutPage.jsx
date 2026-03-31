import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import { useAppFlow } from "../state/AppFlow";
import { createOrder } from "../utils/createOrder"
import { supabase } from "../lib/supabaseClient";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cakeConfig,
    selectedCake,
    customizationDraft,
    checkoutDraft,
    setCheckoutDraft,
    setCreatedOrder,
    createdOrder,
    selectedFallback,
    // resetFlow,
  } = useAppFlow();

  // useEffect(() => {
  //   return () => {
  //     resetFlow();
  //   };
  // }, []);

  useEffect(() => {
    if ((!selectedCake && !selectedFallback) || !cakeConfig) {
      navigate("/");
    }
  }, [selectedCake, cakeConfig, selectedFallback, navigate]);

  const [formState, setFormState] = useState(() => ({
    fullName: checkoutDraft?.fullName || "",
    contactNumber: checkoutDraft?.contactNumber || "",
    fulfillmentType: checkoutDraft?.fulfillmentType || "pickup",
    addressLine1: checkoutDraft?.addressLine1 || "",
    addressLine2: checkoutDraft?.addressLine2 || "",
    city: checkoutDraft?.city || "",
    region: checkoutDraft?.region || "",
    postalCode: checkoutDraft?.postalCode || "",
    paymentMethod: checkoutDraft?.paymentMethod || "cash_on_delivery",
    paymentReference: checkoutDraft?.paymentReference || "",
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!checkoutDraft) return;
    setFormState((prev) => ({
      fullName: checkoutDraft.fullName ?? prev.fullName,
      contactNumber: checkoutDraft.contactNumber ?? prev.contactNumber,
      fulfillmentType: checkoutDraft.fulfillmentType ?? prev.fulfillmentType,
      addressLine1: checkoutDraft.addressLine1 ?? prev.addressLine1,
      addressLine2: checkoutDraft.addressLine2 ?? prev.addressLine2,
      city: checkoutDraft.city ?? prev.city,
      region: checkoutDraft.region ?? prev.region,
      postalCode: checkoutDraft.postalCode ?? prev.postalCode,
      paymentMethod: checkoutDraft.paymentMethod ?? prev.paymentMethod,
      paymentReference: checkoutDraft.paymentReference ?? prev.paymentReference,
    }));
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
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must sign in before placing an order.");
      }

      const orderPayload = createOrder({
        userId: user.id,
        cakeConfig,
        selectedCake,
        selectedFallback,
        customizationDraft,
        checkoutDraft: formState,
      });

      const { data, error } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setCreatedOrder(data);
      navigate("/my-orders");
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "We couldn’t finish the checkout just now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-shell checkout-shell">
      <div className="container-wide">
        <div className="checkout-layout">

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
                  placeholder="6969696969"
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
                <div className="address-grid">
                  <label className="form-field address-full">
                    <span>Street address</span>
                    <input
                      type="text"
                      value={formState.addressLine1}
                      onChange={handleChange("addressLine1")}
                      placeholder=""
                      required={requiresAddress}
                    />
                  </label>
                  <label className="form-field address-full">
                    <span>Apartment, suite, etc. (optional)</span>
                    <input
                      type="text"
                      value={formState.addressLine2}
                      onChange={handleChange("addressLine2")}
                      placeholder=""
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
              <label className="form-field">
                <span>Payment method</span>
                <select
                  value={formState.paymentMethod}
                  onChange={handleChange("paymentMethod")}
                >
                  <option value="credit_card">Credit / Debit Card</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="digital_wallet">Digital Wallet</option>
                </select>
              </label>
              <label className="form-field">
                <span>Payment confirmation (optional)</span>
                <input
                  type="text"
                  value={formState.paymentReference}
                  onChange={handleChange("paymentReference")}
                  placeholder=""
                />
              </label>
            </fieldset>

            {submitError && <div className="alert alert-error">{submitError}</div>}

            <div className="checkout-actions">
              <PrimaryButton type="submit" disabled={isSubmitDisabled || isSubmitting}>
                {isSubmitting ? "Creating order..." : "Place Order"}
              </PrimaryButton>
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/recommendations")}
              >
                Back to Designer
              </button>
            </div>
          </form>

          <aside className="checkout-summary">
            <div className="summary-card">
              <div className="summary-preview" aria-hidden="true" />
              <div className="summary-details">
                <h3 className="summary-title">Your Cake</h3>
                <p className="summary-item">
                  {/* <strong>{selectedCake?.title ?? "Custom Cake"}</strong> */}
                  <strong>{"Custom Cake"}</strong>
                </p>
                {cakeConfig &&
                  Object.entries(cakeConfig).map(([key, value]) => (
                    <p className="summary-item" key={key}>
                      <span>{key}</span>
                      <span>{value}</span>
                    </p>
                  ))}
              </div>
            </div>

            <div className="summary-card">
              <h3 className="summary-title">Customization Notes</h3>
              <p className="summary-copy">
                {customizationDraft?.specialInstructions
                  ? customizationDraft.specialInstructions
                  : "No additional notes at the moment."}
              </p>
              <hr className="summary-divider" />
              <div className="summary-meta">
                <p className="summary-item">
                  <span>Flavor</span>
                  <span>{customizationDraft?.cakeMessage || "TBD"}</span>
                </p>
                {/* <p className="summary-item">
                  <span>Serving size</span>
                  <span>{customizationDraft?.specialInstructions || cakeConfig?.specialInstructions || "TBD"}</span>
                </p> */}
              </div>
            </div>

            <div className="summary-card">
              <h3 className="summary-title">Checkout Snapshot</h3>
              <p className="summary-item">
                <span>Fulfillment</span>
                <span>{formState.fulfillmentType === "delivery" ? "Delivery" : "Pickup"}</span>
              </p>
              <p className="summary-item">
                <span>Payment</span>
                <span>{formatPaymentMethodLabel(formState.paymentMethod)}</span>
              </p>
              <p className="summary-item">
                <span>Contact</span>
                <span>{formState.contactNumber || "—"}</span>
              </p>
              <p className="summary-item">
                <span>Address</span>
                <span>
                  {formState.fulfillmentType === "delivery"
                    ? buildAddressSummary(formState)
                    : "Pick up in store"}
                </span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


function buildAddressSummary({ addressLine1, addressLine2, city, region, postalCode }) {
  const parts = [addressLine1, addressLine2, city, region, postalCode]
    .filter(Boolean)
    .join(", ");
  return parts || "Delivery address pending";
}

function formatPaymentMethodLabel(method) {
  switch (method) {
    case "cash_on_delivery": return "Cash on Delivery";
    case "bank_transfer": return "Bank Transfer";
    case "digital_wallet": return "Digital Wallet";
    default: return "Credit / Debit Card";
  }
}