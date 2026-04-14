import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";

// =========================
// 1. SUB-COMPONENTS
// =========================

const CategoryCard = ({ title, color, imageUrl, onClick }) => (
  <button 
    className="category-card" 
    style={{ 
      backgroundColor: color,
      borderRadius: "var(--radius-card)", // Strictly 16px
      border: "none",
      height: "var(--layout-reco-card)", // Note: 380px might be too tall, adjust if needed!
      minHeight: "240px",
      padding: "var(--space-lg)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      cursor: "pointer",
      textAlign: "left"
    }}
    onClick={onClick}
  >
    <h3 style={{ 
      color: "var(--surface)", 
      fontSize: "var(--font-h2-size)", // Using 24px per your spec
      fontWeight: "var(--font-h2-weight)",
      fontFamily: "var(--font-heading)",
      margin: 0, 
      zIndex: 2, 
      whiteSpace: "pre-line" 
    }}>
      {title}
    </h3>
    {imageUrl && (
      <img 
        src={imageUrl} 
        alt={`${title.replace('\n', ' ')} illustration`} 
        loading="lazy"
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "180px",
          height: "180px",
          objectFit: "contain",
          zIndex: 1,
          pointerEvents: "none"
        }}
      />
    )}
  </button>
);

const CategorySkeleton = () => (
  <div style={{ 
    backgroundColor: "var(--surface-muted)", 
    height: "240px", 
    borderRadius: "var(--radius-card)",
    padding: "var(--space-lg)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end"
  }}>
    <div style={{ width: "60%", height: "24px", backgroundColor: "var(--border)", borderRadius: "4px", marginBottom: "8px" }} />
    <div style={{ width: "40%", height: "24px", backgroundColor: "var(--border)", borderRadius: "4px" }} />
  </div>
);

// =========================
// 2. HERO SECTION
// =========================

const HERO_SLIDES = [
  { id: 1, src: "/assets/hero-cake-1.jpg", alt: "Elegant custom floral wedding cake" },
  { id: 2, src: "/assets/hero-cake-2.jpg", alt: "Decadent chocolate drip birthday cake" },
  { id: 3, src: "/assets/hero-cake-3.jpg", alt: "Modern minimalist buttercream cake" }
];

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
      borderRadius: "var(--radius-card)", // 16px
      boxShadow: "var(--shadow-card)",
      position: "relative",
      overflow: "hidden",
      display: "flex"
    }}>
      <div style={{
        display: "flex",
        width: "100%",
        height: "100%",
        transform: `translateX(-${currentIndex * 100}%)`,
        transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
      }}>
        {HERO_SLIDES.map((slide) => (
          <img key={slide.id} src={slide.src} alt={slide.alt} style={{ width: "100%", height: "100%", objectFit: "cover", flexShrink: 0 }} loading="eager" />
        ))}
      </div>

      <div style={{ position: "absolute", bottom: "var(--space-lg)", left: "0", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 var(--space-lg)", pointerEvents: "none" }}>
        <button type="button" onClick={prevSlide} className="carousel-button" aria-label="Previous image" style={{ pointerEvents: "auto", width: "48px", height: "48px", borderRadius: "50%", border: "none", backgroundColor: "var(--surface)", cursor: "pointer" }}>&#10094;</button>
        <button type="button" onClick={nextSlide} className="carousel-button" aria-label="Next image" style={{ pointerEvents: "auto", width: "48px", height: "48px", borderRadius: "50%", border: "none", backgroundColor: "var(--surface)", cursor: "pointer" }}>&#10095;</button>
      </div>
    </div>
  );
};

const HeroSection = ({ onStart, onBrowse }) => (
  <section style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      gap: "var(--space-2xl)", 
      // STRICT 100vh fold minus padding to prevent double-scroll
      minHeight: "calc(100vh - var(--space-2xl) * 2)", 
      paddingTop: "var(--space-2xl)",
      paddingBottom: "var(--space-2xl)",
      margin: "32px auto"
    }}
  >
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-md)", alignItems: "flex-start", textAlign: "left" }}>
      <span style={{ color: "var(--primary)", fontWeight: "600", fontSize: "var(--font-caption-size)", textTransform: "uppercase", letterSpacing: "1px" }}>
        Whisk & Click Bakery
      </span>

      {/* Strictly using your H1 Typography Spec (32px / 600 Poppins) */}
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

      <p style={{ fontSize: "var(--font-body-size)", color: "var(--text-secondary)", lineHeight: "var(--font-body-line)", maxWidth: "480px", margin: 0 }}>
        Find personalized cake designs based on your preferences, dietary needs, and our shop-supported flavors.
      </p>

      <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-sm)" }}>
        <button className="primary-button" onClick={onStart} style={{ minHeight: "var(--control-height)", padding: "0 var(--space-lg)" }}>
          Start Designing
        </button>
        <button className="secondary-button" onClick={onBrowse} style={{ minHeight: "var(--control-height)", padding: "0 var(--space-lg)" }}>
          Shop Catalog
        </button>
      </div>
    </div>

    <div style={{ flex: 1, position: "relative", display: "flex", justifyContent: "flex-end" }}>
       <HeroCarousel />
    </div>
  </section>
);

// =========================
// 3. MAIN COMPONENT
// =========================

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        const data = [
          { id: "savory", title: "Savory\nSnacks", color: "var(--success)", route: "/category/savory", imageUrl: "/assets/popcorn.png" },
          { id: "sweet", title: "Sweet\nDonuts", color: "var(--warning)", route: "/category/sweet", imageUrl: "/assets/donut.png" },
          { id: "chocolate", title: "Chocolate\nCookies", color: "var(--primary)", route: "/category/chocolate", imageUrl: "/assets/cookie.png" }
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
    <main className="page-shell" style={{ padding: "0 var(--space-2xl)" }}>
      {/* Strictly adhering to your 1320px Reco Grid layout */}
      <div style={{ maxWidth: "var(--layout-reco-grid)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-3xl)" }}>
        
        <HeroSection onStart={() => navigate("/auth")} onBrowse={() => navigate("/catalog")}  />

        {/* PROMO BANNER */}
        <button 
          style={{ 
            backgroundColor: "var(--success)",
            borderRadius: "var(--radius-card)",
            padding: "var(--space-xl) var(--space-2xl)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "none",
            cursor: "pointer",
            textAlign: "left"
          }} 
          onClick={() => navigate("/promo")}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            <h2 style={{ color: "var(--surface)", fontSize: "var(--font-h1-size)", fontFamily: "var(--font-heading)", margin: 0 }}>Buy 2 Get Free</h2>
            <p style={{ color: "var(--surface)", opacity: 0.9, margin: 0, fontSize: "var(--font-body-size)" }}>7-12 February 2025</p>
            <span style={{ 
              display: "inline-flex", 
              alignItems: "center",
              justifyContent: "center",
              minHeight: "var(--control-height)", 
              padding: "0 var(--space-lg)",
              backgroundColor: "var(--text-primary)", 
              color: "var(--surface)", 
              borderRadius: "var(--radius-button)", 
              fontSize: "var(--font-button-size)", 
              fontWeight: "var(--font-button-weight)", 
              marginTop: "var(--space-xs)", 
              width: "fit-content" 
            }}>
              Get Promo
            </span>
          </div>
        </button>

        {/* BEST SELLERS SECTION */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", paddingBottom: "var(--space-3xl)" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 style={{ margin: 0, fontSize: "var(--font-h2-size)", fontWeight: "var(--font-h2-weight)", fontFamily: "var(--font-heading)" }}>Best Seller Categories</h2>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "var(--font-button-weight)", fontSize: "var(--font-button-size)", color: "var(--primary)", display: "flex", alignItems: "center", gap: "4px", padding: 0 }} onClick={() => navigate("/best-sellers")}>
              See All &rarr;
            </button>
          </header>

          {error ? (
            <div style={{ backgroundColor: "var(--error-bg)", border: `1px solid var(--error)`, color: "var(--error)", padding: "var(--space-md)", borderRadius: "var(--radius-input)" }}>
              <p>{error}</p>
              <button className="secondary-button" onClick={() => window.location.reload()} style={{ minHeight: "var(--control-height)" }}>Retry</button>
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
                    color={category.color}
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