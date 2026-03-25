import { useNavigate } from "react-router-dom";
import { useAppFlow } from "../state/AppFlow";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import CakeCard from "../components/CakeCard"

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const {
      resetFlow,
      cakeConfig,
      selectedCake,
      customizationDraft,
      setCustomizationDraft,
      selectedFallback,
   } = useAppFlow();

  

  const COLOR_THEMES = ['Dark', 'Rainbow', 'Black and White', 'Butterbeer'];
  const TOPPER_OPTIONS = ['None', 'Birthday Candle', 'Figurine', 'Paper Flowers', 'Canary Creams', 'Ton-Tongue Toffee'];
  const SIZE_OPTIONS   = ['Smaller', 'Standard', 'Larger'];

  
  const isFallbackEmpty = Object.keys(selectedFallback).length === 0;
  console.log(selectedFallback);
  function DefaultSection({data}){
      const summary = {
      "Cake ID": data.cake_id,
      "Flavor": data.flavor,
      "Occasion": data.occasion,
    };
    return (
      <div className="order-review-body">
        <dl className="order-review-details">
          <div>
            <dt>Selected Cake</dt>
            <dd>{data.image_filename}</dd>
          </div>
          {Object.entries(summary).map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="order-preview" aria-hidden="true">
          <CakeCard key={data.id} cake={data} />
        </div>
      </div>
    );
  }
  function FallbackSection({data}){
    return(
      <div className="order-review-body">
            <dl className="order-review-details">
              <div>
                <dt>Selected Cake</dt>
                <dd>{data.provider}</dd>
              </div>
              {/* {Object.entries(data).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))} */}
            </dl>

            <div className="order-preview" aria-hidden="true"   >
              <div
                className="card"
                style={{
                  width: "380px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}
              >
                <img
                  src={data.imageUrl}
                  style={{
                    width: "100%",
                    height: "230px",
                    objectFit: "cover",
                    borderRadius: "12px"
                  }}
                />
              </div>
            </div>
            
          </div>
    );
  }

  if (!selectedCake && !selectedFallback) {
    navigate("/wizard");
    return (
      <div className="page-shell">
        <div className="container-summary">
          <PageHeader
            title="No order found"
            subtitle="Please complete the recommendation flow first."
          />
        </div>
      </div>
    );
    
  }
  console.log(selectedCake)
  function handleStartOver() {
    resetFlow();
    navigate("/");
  }

  return (
    <div className="page-shell order-confirmation-shell">
      <div className="order-confirmation-panel">
        <section className="card order-review-card">
          <PageHeader
            title="Customize Your Cake Reference"
            subtitle="A quick snapshot of everything captured for your celebration."
          />
          {isFallbackEmpty
            ? <DefaultSection data={selectedCake} />
            : <FallbackSection data={selectedFallback} />}
        </section>

        <section className="card order-feedback-card">
          <h2 className="order-feedback-title">
          Refine your design, let us know your thoughts
          </h2>
          <p className="order-feedback-subtitle">
          </p>

          <select
            className="order-feedback-input-3"
            value={customizationDraft.colorTheme}
            onChange={(e) =>
              setCustomizationDraft(d => ({ ...d, colorTheme: e.target.value }))
            }
          >
            <option value="" disabled>Select a theme…</option>
            {COLOR_THEMES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            className="order-feedback-input-3"
            value={customizationDraft.topperPreference}
            onChange={(e) =>
              setCustomizationDraft(d => ({ ...d, topperPreference: e.target.value }))
            }
          >
            <option value="" disabled>Choose topper…</option>
            {TOPPER_OPTIONS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          
          <select
            className="order-feedback-input-3"
            value={customizationDraft.sizeAdjustment}
            onChange={(e) =>
              setCustomizationDraft(d => ({ ...d, sizeAdjustment: e.target.value }))
            }
          >
            <option value="" disabled>Select size…</option>
            {SIZE_OPTIONS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            className="order-feedback-input-2"
            placeholder="Cake Message"
            value={customizationDraft.cakeMessage}
            onChange={(e) =>
              setCustomizationDraft((prev) => ({
                ...prev,
                cakeMessage: e.target.value
              }))
            }
          />

          <textarea
            className="order-feedback-input"
            placeholder="Special Instructions"
            rows={4}
            value={customizationDraft.specialInstructions}
            onChange={(e) =>
              setCustomizationDraft((prev) => ({
                ...prev,
                specialInstructions: e.target.value
              }))
            }
          />

          <div className="order-actions">
            <SecondaryButton onClick={() => navigate("/recommendations")}>Back to Recommendations</SecondaryButton>
            <PrimaryButton onClick={() => navigate("/checkout")}>Proceed to Checkout</PrimaryButton>
          </div>
        </section>
      </div>
    </div>
  );
}