import { useNavigate } from 'react-router-dom';
import { useAppFlow } from '../state/AppFlow';
import { useBlueprints } from '../hooks/useBlueprints'; // The hook we built in Sprint 1
import { useBestSellers } from '../hooks/useBestSellers';
import PublicHeader from "../components/PublicHeader";
// Uses the new database schema
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

export default function BestSellersPage() {
  const navigate = useNavigate();
  const { setSelectedCake, setCakeConfig } = useAppFlow();
  
  // 1. Fetch live data from Supabase
  const { data: bestSellersData = [], isLoading, error } = useBestSellers(10);

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

  if (isLoading) return <div className="page-shell"><p style={{textAlign:"center"}}>Loading our best sellers...</p></div>;
  if (error) return <div className="page-shell"><p style={{textAlign:"center", color:"red"}}>Failed to load catalog.</p></div>;

  return (
    <main className="page-shell">
      <div className="container-reco layout-stack">
        <PublicHeader />
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

        <div className="category-grid">
          {bestSellersData.map((item, index) => {
            const displayTitle = generateTitle(item);

            return (
              <article 
                key={item.id} // UUID from Supabase
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
                
                <div style={{
                  position: "absolute", top: "var(--space-md)", left: "var(--space-md)",
                  backgroundColor: "var(--secondary)", color: "var(--text-primary)",
                  width: "40px", height: "40px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "bold", fontSize: "20px", zIndex: 2,
                  boxShadow: "var(--shadow-card)"
                }}>
                  #{index + 1}
                </div>

                <div style={{ aspectRatio: "1/1", width: "100%", backgroundColor: "var(--surface-muted)", position: "relative" }}>
                  <img 
                    src={item.image_url} // FIXED schema reference
                    alt={`Photo of ${displayTitle}`} 
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.src = "/assets/placeholder.png"; e.target.style.objectFit = "contain"; }}
                  />
                </div>

                <div style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h2 style={{ fontSize: "var(--font-h3-size)", marginBottom: "var(--space-xs)", lineHeight: 1.2 }}>
                    {displayTitle}
                  </h2>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
                    <span style={{ color: "var(--primary)", fontWeight: "600", fontSize: "18px" }}>
                      ₱{item.base_price} {/* FIXED to read live database price */}
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