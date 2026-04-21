import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import { CAKE_IMAGES, HERO_SLIDES } from "../data/assets";
import { useBlueprints } from "../hooks/useBlueprints";
import { useCarousel } from "../hooks/useCarousel";
import { useBestSellers } from "../hooks/useBestSellers";
import PublicHeader from "../components/PublicHeader";

const CategoryCard = ({ title, imageUrl, onClick }) => (
  <button 
    className="category-card" 
    onClick={onClick}
    style={{ 
      borderRadius: "var(--radius-card)", 
      border: "none",
      aspectRatio: "1/1",
      width: "100%",
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
      aspectRatio: "1/1", /* FIXED: Replaced 320px height */
      width: "100%",      /* FIXED: Ensure it fills its container */
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
  const [isPaused, setIsPaused] = useState(false);
  
  // Fetch live slides from Supabase
  const { data: slides = [], isLoading } = useCarousel();

  // FIXED: Now uses the dynamic 'slides' array length instead of the hardcoded HERO_SLIDES
  const nextSlide = () => setCurrentIndex((prev) => slides.length > 0 ? (prev + 1) % slides.length : 0);
  const prevSlide = () => setCurrentIndex((prev) => slides.length > 0 ? (prev - 1 + slides.length) % slides.length : 0);

  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  if (isLoading) return <div className="skeleton-pulse" style={{ width: "100%", aspectRatio: "4/5", borderRadius: "var(--radius-card)", margin: "0 auto", maxWidth: "540px" }} />;
  if (slides.length === 0) return null;

  return (
    <div 
      onMouseEnter={() => setIsPaused(true)}  
      onMouseLeave={() => setIsPaused(false)} 
      style={{
        width: "100%",
        maxWidth: "460px",
        aspectRatio: "1/1",
        backgroundColor: "var(--surface-muted)",
        borderRadius: "var(--radius-card)", 
        boxShadow: "var(--shadow-card)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        margin: "0 auto"
      }}
    >
      <div style={{
        display: "flex", width: "100%", height: "100%",
        transform: `translateX(-${currentIndex * 100}%)`,
        transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
      }}>
        {slides.map((slide) => (
          <img 
            key={slide.id} 
            src={slide.image_url} 
            alt={slide.alt_text} 
            style={{ width: "100%", height: "100%", objectFit: "cover", flexShrink: 0 }} 
          />
        ))}
      </div>

      <div style={{ 
        position: "absolute", bottom: "var(--space-lg)", left: "0", 
        width: "100%", display: "flex", justifyContent: "space-between", 
        padding: "0 var(--space-lg)", pointerEvents: "none" 
      }}>
        <button type="button" onClick={prevSlide} className="carousel-button" aria-label="Previous image" style={{ pointerEvents: "auto" }}>
          &#10094;
        </button>
        <button type="button" onClick={nextSlide} className="carousel-button" aria-label="Next image" style={{ pointerEvents: "auto" }}>
          &#10095;
        </button>
      </div>

      {/* FIXED: The dots now map dynamically to the database slides */}
      <div style={{
        position: "absolute", bottom: "12px", left: "0",
        width: "100%", display: "flex", justifyContent: "center",
        gap: "8px", pointerEvents: "none"
      }}>
        {slides.map((_, idx) => (
          <div 
            key={idx}
            style={{
              width: "8px", height: "8px", borderRadius: "50%",
              backgroundColor: currentIndex === idx ? "var(--primary)" : "rgba(255,255,255,0.5)",
              transition: "background-color 0.3s ease"
            }}
          />
        ))}
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
      minHeight: "auto",
      paddingTop: "var(--space-md)",
      paddingBottom: "var(--space-xl)",
      margin: "0 auto var(--space-xl) auto"
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
        Whisk & Click Bakeshop
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
  const cap = s => s?.replace(/^\w/, c => c.toUpperCase());
  // Fetch live data from Supabase
  const { data: bestSellers, isLoading, error } = useBestSellers(3);
  
  const categories = bestSellers ? bestSellers.map(cake => ({
    id: cake.id,
    title: cake.metadata?.theme ? `${cap(cake.metadata.theme)}\n` : cap(cake.name),
    route: "/best-sellers",
    imageUrl: cake.image_url
  })) : [];

  return (
    <main className="page-shell" style={{ padding: "0 var(--space-lg)" }}>
      <div style={{ maxWidth: "var(--layout-reco-grid)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
        <PublicHeader />
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
              Check out deals!
            </h2>
            <p style={{ color: "var(--surface)", opacity: 0.9, margin: 0, fontSize: "var(--font-body-size)" }}>
              Available for a limited time. Don't miss out on our sweetest offers.
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
              Best Sellers
            </h2>
            
            <button 
              style={{ 
                background: "none", border: "none", cursor: "pointer", 
                fontWeight: "600", fontSize: "15px", color: "var(--primary)", 
                display: "flex", alignItems: "center", gap: "4px", padding: 0 
              }} 
              onClick={() => navigate("/best-sellers")}
            >
              See All &rarr;
            </button>
          </header>

          {error ? (
            <div className="alert alert-error">
              <p style={{ margin: "0 0 var(--space-sm) 0" }}>Failed to load live catalog.</p>
              <button className="secondary-button" onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : (
            <div className="category-grid horizontal-mobile-scroll">
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