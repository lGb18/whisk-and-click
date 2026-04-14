import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cakeCatalog } from '../data/cakeCatalog';
import { useAppFlow } from '../state/AppFlow'; // Import your flow state

// --- HELPER FUNCTIONS ---
const getPriceEstimation = (budget) => {
  const prices = { low: "1.00", medium: "2.00", high: "3.00" };
  return prices[budget?.toLowerCase()] || "1.00";
};

const generateTitle = (cake) => {
  if (cake.title && cake.title.trim() !== "") return cake.title;
  const flavor = cake.flavor && cake.flavor !== "unknown" ? cake.flavor : "Signature";
  const style = cake.style && cake.style !== "unknown" ? cake.style : "Classic";
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  return `${capitalize(style)} ${capitalize(flavor)} Cake`;
};

export default function CatalogPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Destructure the setters from your context
  const { setSelectedCake, setCakeConfig } = useAppFlow();

  const filterCategories = useMemo(() => {
    const validFlavors = cakeCatalog
      .map(cake => cake.flavor)
      .filter(flavor => flavor && flavor !== "unknown");
    const uniqueFlavors = [...new Set(validFlavors)].map(f => f.charAt(0).toUpperCase() + f.slice(1));
    return ["All", ...uniqueFlavors];
  }, []);

  const displayedCakes = useMemo(() => {
    if (activeFilter === "All") return cakeCatalog;
    return cakeCatalog.filter(
      cake => cake.flavor?.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [activeFilter]);

  // --- THE HANDLER ---
  // This bridges the catalog data to your Order Confirmation flow
  const handleSelectCake = (cake) => {
    // 1. Set the exact catalog item as the selected reference
    setSelectedCake(cake);

    // 2. Pre-fill the cakeConfig so the confirmation page and createOrder function have the data
    setCakeConfig({
      occasion: cake.occasion !== "unknown" ? cake.occasion : "",
      flavor: cake.flavor !== "unknown" ? cake.flavor : "",
      style: cake.style !== "unknown" ? cake.style : "",
      budget: cake.budget !== "unknown" ? cake.budget : "",
      size_category: cake.size_category !== "unknown" ? cake.size_category : "",
    });

    // 3. Navigate directly to the confirmation/customization page
    navigate("/order-confirmation"); // Make sure this matches your actual route path!
  };

  return (
    <main className="page-shell">
      <div className="container-reco layout-stack">
        
        <header style={{ textAlign: "center", marginBottom: "var(--space-md)" }}>
          <h1 className="page-title">Shop Catalog</h1>
          <p className="page-subtitle" style={{ marginTop: "var(--space-sm)", maxWidth: "600px", margin: "var(--space-sm) auto 0" }}>
            Browse our full collection of handcrafted bakes. Filter by your favorite flavors to find the perfect match.
          </p>
        </header>

        <nav 
          aria-label="Product categories"
          style={{ 
            display: "flex", 
            gap: "var(--space-sm)", 
            justifyContent: "center", 
            flexWrap: "wrap",
            marginBottom: "var(--space-lg)" 
          }}
        >
          {filterCategories.map(category => (
            <button 
              key={category}
              className={`option-button ${activeFilter === category ? 'selected' : ''}`}
              onClick={() => setActiveFilter(category)}
              style={{ minWidth: "100px", borderRadius: "24px" }}
            >
              {category}
            </button>
          ))}
        </nav>

        <div className="category-grid">
          {displayedCakes.map((cake) => {
            const displayTitle = generateTitle(cake);
            const price = getPriceEstimation(cake.budget);

            return (
              <article 
                key={cake.cake_id} 
                className="card" 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer"
                }}
                onClick={() => handleSelectCake(cake)}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSelectCake(cake)}
              >
                <div style={{ height: "260px", backgroundColor: "var(--surface-muted)", position: "relative" }}>
                  <div style={{
                    position: "absolute",
                    top: "var(--space-sm)",
                    left: "var(--space-sm)",
                    backgroundColor: "var(--surface)",
                    color: "var(--text-primary)",
                    padding: "4px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "capitalize",
                    boxShadow: "var(--shadow-card-soft)",
                    zIndex: 2
                  }}>
                    {cake.size_category} Size
                  </div>

                  <img 
                    src={cake.image} 
                    alt={`Photo of ${displayTitle}`} 
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    onError={(e) => { 
                      e.target.src = "/assets/placeholder.png"; 
                      e.target.style.objectFit = "contain"; 
                      e.target.style.padding = "20px"; 
                    }}
                  />
                </div>

                <div style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-xs)", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                    <h2 style={{ fontSize: "var(--font-h3-size)", margin: 0, lineHeight: 1.2 }}>
                      {displayTitle}
                    </h2>
                    <span style={{ color: "var(--primary)", fontWeight: "600", fontSize: "18px" }}>
                      {price}
                    </span>
                  </div>
                  
                  <p className="caption" style={{ textTransform: "capitalize", margin: "4px 0 0 0" }}>
                    {cake.occasion !== "unknown" ? cake.occasion : "Any Occasion"} • {cake.flavor !== "unknown" ? cake.flavor : "Signature Blend"}
                  </p>

                  <div style={{ marginTop: "auto", paddingTop: "var(--space-md)" }}>
                    <button 
                      className="primary-button" 
                      style={{ width: "100%", padding: "10px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCake(cake);
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