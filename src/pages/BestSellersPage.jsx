import { useNavigate } from 'react-router-dom';
import { useAppFlow } from '../state/AppFlow';
import { cakeCatalog } from '../data/cakeCatalog';
import { CAKE_IMAGES } from '../data/assets'; // Import CAKE_IMAGES

// --- HELPER FUNCTIONS (Same as Catalog for consistency) ---
const getPriceEstimation = (budget) => {
  const prices = { low: "$45.00", medium: "$85.00", high: "$150.00" };
  return prices[budget?.toLowerCase()] || "$65.00";
};

const generateTitle = (cake) => {
  if (cake?.title && cake.title.trim() !== "") return cake.title;
  const flavor = cake?.flavor && cake.flavor !== "unknown" ? cake.flavor : "Signature";
  const style = cake?.style && cake.style !== "unknown" ? cake.style : "Classic";
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  return `${capitalize(style)} ${capitalize(flavor)} Cake`;
};

// Map your best seller IDs to actual cakeCatalog items
const BEST_SELLER_IDS = ["cake_00002", "cake_00001", "cake_00004"];

// Create best sellers data that matches cakeCatalog structure
const getBestSellersData = () => {
  return BEST_SELLER_IDS.map(id => {
    const cake = cakeCatalog.find(c => c.cake_id === id);
    if (cake) {
      return {
        ...cake,
        // Ensure image path is correct
        image: cake.image || CAKE_IMAGES[cake.image_key] || "/assets/placeholder.png"
      };
    }
    return null;
  }).filter(Boolean);
};

export default function BestSellersPage() {
  const navigate = useNavigate();
  const { setSelectedCake, setCakeConfig } = useAppFlow();
  
  const bestSellersData = getBestSellersData();

  const handleSelectCake = (cake) => {
    // Set the selected cake
    setSelectedCake(cake);
    
    // Pre-fill the cakeConfig
    setCakeConfig({
      occasion: cake.occasion !== "unknown" ? cake.occasion : "",
      flavor: cake.flavor !== "unknown" ? cake.flavor : "",
      style: cake.style !== "unknown" ? cake.style : "",
      budget: cake.budget !== "unknown" ? cake.budget : "",
      size_category: cake.size_category !== "unknown" ? cake.size_category : "",
    });

    // Navigate to order confirmation
    navigate("/order-confirmation");
  };

  return (
    <main className="page-shell">
      <div className="container-reco layout-stack">
        
        {/* HEADER */}
        <header style={{ display: "flex", alignItems: "baseline", gap: "var(--space-md)" }}>
          <button 
            className="secondary-button" 
            onClick={() => navigate(-1)} 
            style={{ padding: "8px 16px", minHeight: "auto" }}
          >
            &larr; Back
          </button>
          <div>
            <h1 className="page-title">Best Sellers</h1>
            <p className="page-subtitle">Our most loved creations, validated by hundreds of happy customers.</p>
          </div>
        </header>

        {/* PRODUCT GRID */}
        <div className="category-grid">
          {bestSellersData.map((item, index) => {
            const displayTitle = generateTitle(item);
            const price = getPriceEstimation(item.budget);

            return (
              <article 
                key={item.cake_id} 
                className="card" 
                style={{ 
                  position: "relative", 
                  overflow: "hidden", 
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
                onClick={() => handleSelectCake(item)}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSelectCake(item)}
              >
                
                {/* RANK BADGE */}
                <div style={{
                  position: "absolute",
                  top: "var(--space-md)",
                  left: "var(--space-md)",
                  backgroundColor: "var(--secondary)",
                  color: "var(--text-primary)",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "20px",
                  zIndex: 2,
                  boxShadow: "var(--shadow-card)"
                }}>
                  #{index + 1}
                </div>

                {/* IMAGE */}
                <div style={{ height: "300px", backgroundColor: "var(--surface-muted)" }}>
                  <img 
                    src={item.image} 
                    alt={`Photo of ${displayTitle}`} 
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { 
                      e.target.src = "/assets/placeholder.png"; 
                      e.target.style.objectFit = "contain"; 
                    }}
                  />
                </div>

                {/* CONTENT */}
                <div style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h2 style={{ fontSize: "var(--font-h3-size)", marginBottom: "var(--space-xs)", lineHeight: 1.2 }}>
                    {displayTitle}
                  </h2>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
                    <span style={{ color: "var(--primary)", fontWeight: "600", fontSize: "18px" }}>
                      {price}
                    </span>
                    <span className="caption" style={{ color: "var(--warning)", fontWeight: "600" }}>
                      ★ Best Seller
                    </span>
                  </div>
                  
                  <div style={{ marginTop: "auto" }}>
                    <button 
                      className="primary-button" 
                      style={{ width: "100%" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCake(item);
                      }}
                    >
                      Customize & Order
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </main>
  );
}