import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppFlow } from '../state/AppFlow'; 
import PublicHeader from "../components/PublicHeader";
import { useBlueprints } from '../hooks/useBlueprints'; // FIXED: Read from Live DB

const generateTitle = (cake) => {
  if (cake?.name && cake.name.trim() !== "") return cake.name;
  const flavorStr = cake?.metadata?.inferred_flavor || "Signature";
  const styleStr = cake?.metadata?.theme || cake?.metadata?.frosting_style || "Classic";
  const capitalize = (str) => {
    if (!str) return "";
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
  };
  return `${capitalize(styleStr)} ${capitalize(flavorStr)} Cake`;
};

export default function CatalogPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  
  const { setSelectedCake, setCakeConfig } = useAppFlow();
  
  const { data: blueprints = [], isLoading, error } = useBlueprints();

  const filterCategories = ["All", "Classic", "Specialty", "Premium"];

  const displayedCakes = useMemo(() => {
    if (activeFilter === "All") return blueprints;
    
    return blueprints.filter(cake => {
      if (activeFilter === "Classic") return cake.flavor <= 3;
      if (activeFilter === "Specialty") return cake.flavor > 3 && cake.flavor < 8;
      if (activeFilter === "Premium") return cake.flavor >= 8;
      return true;
    });
  }, [activeFilter, blueprints]);

  const handleSelectCake = (cake) => {
    setSelectedCake(cake);

    setCakeConfig({
      form_factor: cake.form_factor,
      complexity: cake.complexity,
      aesthetic: cake.aesthetic,
      flavor: cake.flavor,
      primary_color: cake.primary_color
    });

    navigate("/order-confirmation"); 
  };

  if (isLoading) return <div className="page-shell"><PublicHeader /><p style={{textAlign:"center"}}>Loading catalog...</p></div>;
  if (error) return <div className="page-shell"><PublicHeader /><p style={{textAlign:"center", color:"red"}}>Failed to load catalog.</p></div>;

  return (
    <main className="page-shell">
      <div className="container-reco layout-stack">
        <PublicHeader />
        <header style={{ textAlign: "center", marginBottom: "var(--space-md)" }}>
          <h1 className="page-title">Shop Catalog</h1>
          <p className="page-subtitle" style={{ marginTop: "var(--space-sm)", maxWidth: "600px", margin: "var(--space-sm) auto 0" }}>
            Browse our full collection of handcrafted bakes. Filter by your favorite flavors to find the perfect match.
          </p>
        </header>

        <nav 
          aria-label="Product categories"
          style={{ 
            display: "flex", gap: "var(--space-sm)", justifyContent: "center", 
            flexWrap: "wrap", marginBottom: "var(--space-lg)" 
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

            return (
              <article 
                key={cake.id}
                className="card" 
                style={{ 
                  display: "flex", flexDirection: "column", overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "pointer"
                }}
                onClick={() => handleSelectCake(cake)}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSelectCake(cake)}
              >
                <div style={{ aspectRatio: "1/1", width: "100%", backgroundColor: "var(--surface-muted)", position: "relative" }}>
                  <img 
                    src={cake.image_url} // FIXED: Use DB image path
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
                      ₱{cake.base_price}
                    </span>
                  </div>
                  
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