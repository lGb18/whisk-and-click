import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import { CAKE_IMAGES, HERO_SLIDES } from "../data/assets";

const CategoryCard = ({ title, imageUrl, onClick }) => (
  <button 
    className="category-card" 
    onClick={onClick}
    style={{ 
      borderRadius: "var(--radius-card)", 
      border: "none",
      height: "320px", 
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      cursor: "pointer",
      padding: "0", 
      backgroundColor: "var(--surface-muted)",
      boxShadow: "var(--shadow-card-soft)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease"
    }}
  >
    {/* Background Image */}
    {imageUrl && (
      <img 
        src={imageUrl} 
        alt={`Category: ${title.replace('\n', ' ')}`} 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover", 
          zIndex: 1,
          transition: "transform 0.5s ease" 
        }}
      />
    )}

    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "70%",
      background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
      zIndex: 2
    }} />

    {/* Text Content */}
    <h3 style={{ 
      color: "var(--surface)", 
      fontSize: "var(--font-h2-size)", 
      fontWeight: "var(--font-h2-weight)",
      fontFamily: "var(--font-heading)",
      margin: "var(--space-lg)", 
      zIndex: 3, 
      position: "relative",
      whiteSpace: "pre-line",
      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
      textAlign: "left"
    }}>
      {title}
    </h3>
  </button>
);

const CategorySkeleton = () => (
  <div 
    className="skeleton-pulse"
    style={{ 
      backgroundColor: "var(--surface-muted)", 
      height: "320px",
      borderRadius: "var(--radius-card)",
      padding: "var(--space-lg)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }}
  >
    <div style={{ width: "60%", height: "28px", backgroundColor: "var(--border)", borderRadius: "4px", marginBottom: "8px" }} />
    <div style={{ width: "40%", height: "28px", backgroundColor: "var(--border)", borderRadius: "4px" }} />
  </div>
);


const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div style={{
      width: "100%",
      maxWidth: "540px",
      aspectRatio: "4/5",
      backgroundColor: "var(--surface-muted)",
      borderRadius: "var(--radius-card)", 
      boxShadow: "var(--shadow-card)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      margin: "0 auto"
    }}>
      <div style={{
        display: "flex",
        width: "100%",
        height: "100%",
        transform: `translateX(-${currentIndex * 100}%)`,
        transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
      }}>
        {HERO_SLIDES.map((slide) => (
          <img 
            key={slide.id} 
            src={slide.src} 
            alt={slide.alt} 
            style={{ width: "100%", height: "100%", objectFit: "cover", flexShrink: 0 }} 
           
            loading={slide.id === 1 ? "eager" : "lazy"} 
          />
        ))}
      </div>

      <div style={{ 
        position: "absolute", 
        bottom: "var(--space-lg)", 
        left: "0", 
        width: "100%", 
        display: "flex", 
        justifyContent: "space-between", 
        padding: "0 var(--space-lg)", 
        pointerEvents: "none" 
      }}>
        <button type="button" onClick={prevSlide} className="carousel-button" aria-label="Previous image" style={{ pointerEvents: "auto" }}>
          &#10094;
        </button>
        <button type="button" onClick={nextSlide} className="carousel-button" aria-label="Next image" style={{ pointerEvents: "auto" }}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

const HeroSection = ({ onStart, onBrowse }) => (
  <section style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      gap: "var(--space-3xl)", 
      flexWrap: "wrap",
      minHeight: "max(600px, calc(100vh - var(--space-2xl) * 2))",
      paddingTop: "var(--space-xl)",
      paddingBottom: "var(--space-xl)",
      margin: "var(--space-lg) auto"
    }}
  >
    <div style={{ 
      flex: "1 1 400px",
      display: "flex", 
      flexDirection: "column", 
      gap: "var(--space-md)", 
      alignItems: "flex-start", 
      textAlign: "left" 
    }}>
      <span style={{ 
        color: "var(--primary)", 
        fontWeight: "600", 
        fontSize: "var(--font-caption-size)", 
        textTransform: "uppercase", 
        letterSpacing: "1.5px" 
      }}>
        Whisk & Click Bakery
      </span>

      <h1 style={{ 
        fontSize: "var(--font-h1-size)", 
        fontWeight: "var(--font-h1-weight)",
        lineHeight: "var(--font-h1-line)", 
        margin: 0, 
        color: "var(--text-primary)", 
        fontFamily: "var(--font-heading)" 
      }}>
        Design the perfect cake,<br/>baked just for you.
      </h1>

      <p style={{ 
        fontSize: "var(--font-body-size)", 
        color: "var(--text-secondary)", 
        lineHeight: "var(--font-body-line)", 
        maxWidth: "480px", 
        margin: "0 0 var(--space-sm) 0" 
      }}>
        Find personalized cake designs based on your preferences, dietary needs, and our shop-supported flavors.
      </p>

      <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap" }}>
        <button className="primary-button" onClick={onStart}>
          Start Designing
        </button>
        <button className="secondary-button" onClick={onBrowse}>
          Shop Catalog
        </button>
      </div>
    </div>

    <div style={{ flex: "1 1 400px", position: "relative" }}>
       <HeroCarousel />
    </div>
  </section>
);

// =========================
// MAIN COMPONENT
// =========================

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); 
        const data = [
          { 
            id: "cake_00002", 
            title: "Chocolate\nDrip Cake", 
            route: "/best-sellers",
            imageUrl: CAKE_IMAGES.CHOCO_DRIP
          },
          { 
            id: "cake_00001", 
            title: "Floral\nWedding Cake", 
            route: "/best-sellers", 
            imageUrl: CAKE_IMAGES.WEDDING_FLORAL 
          },
          { 
            id: "cake_00004", 
            title: "Savory\nSpecial", 
            route: "/best-sellers", 
            imageUrl: CAKE_IMAGES.SAVORY_SPECIAL 
          }
        ];
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <main className="page-shell" style={{ padding: "0 var(--space-lg)" }}>
      <div style={{ maxWidth: "var(--layout-reco-grid)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-3xl)" }}>
        
        <HeroSection onStart={() => navigate("/wizard")} onBrowse={() => navigate("/catalog")}  />

        <button 
          className="promo-banner card"
          style={{ 
            background: "linear-gradient(135deg, var(--primary) 0%, #C94C3E 100%)", 
            borderRadius: "var(--radius-card)",
            padding: "var(--space-xl) var(--space-2xl)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            boxShadow: "var(--shadow-card)"
          }} 
          onClick={() => navigate("/promo")}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <h2 style={{ color: "var(--surface)", fontSize: "var(--font-h1-size)", fontFamily: "var(--font-heading)", margin: 0 }}>
              Buy 2 Get 1 Free
            </h2>
            <p style={{ color: "var(--surface)", opacity: 0.9, margin: 0, fontSize: "var(--font-body-size)" }}>
              Valentine's Special • 7-14 February 2026
            </p>
            <span style={{ 
              display: "inline-flex", 
              alignItems: "center",
              justifyContent: "center",
              height: "40px", 
              padding: "0 var(--space-lg)",
              backgroundColor: "var(--surface)", 
              color: "var(--primary)", 
              borderRadius: "var(--radius-button)", 
              fontSize: "14px", 
              fontWeight: "600", 
              marginTop: "var(--space-md)", 
              width: "fit-content",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              Claim Offer
            </span>
          </div>
          
          <div style={{ 
            fontSize: "120px", 
            opacity: 0.1, 
            position: "absolute", 
            right: "-20px", 
            bottom: "-40px",
            pointerEvents: "none"
          }}>
            -
          </div>
        </button>

        {/* BEST SELLERS SECTION */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", paddingBottom: "var(--space-3xl)" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "var(--space-sm)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--font-h2-size)", fontWeight: "var(--font-h2-weight)", fontFamily: "var(--font-heading)" }}>
              Best Seller Categories
            </h2>
            
            {/* Restored the route to your dedicated Best Sellers page */}
            <button 
              style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                fontWeight: "600", 
                fontSize: "15px", 
                color: "var(--primary)", 
                display: "flex", 
                alignItems: "center", 
                gap: "4px", 
                padding: 0 
              }} 
              onClick={() => navigate("/best-sellers")}
            >
              See All Best Sellers &rarr;
            </button>
          </header>

          {error ? (
            <div className="alert alert-error">
              <p style={{ margin: "0 0 var(--space-sm) 0" }}>{error}</p>
              <button className="secondary-button" onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
              gap: "var(--space-lg)" 
            }}>
              {isLoading 
                ? Array.from({ length: 3 }).map((_, i) => <CategorySkeleton key={i} />)
                : categories.map((category) => (
                  <CategoryCard 
                    key={category.id}
                    title={category.title}
                    imageUrl={category.imageUrl}
                    onClick={() => navigate(category.route)}
                  />
                ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}