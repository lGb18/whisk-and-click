import { useNavigate } from "react-router-dom";
import { useAuthSession } from "../hooks/useAuthSession";

export default function PublicHeader() {
  const navigate = useNavigate();
  const { user, role, isAuthLoading } = useAuthSession();

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "var(--space-md) 0",
      borderBottom: "1px solid var(--border)",
      marginBottom: "var(--space-xl)"
    }}>
      <div 
        onClick={() => navigate("/")} 
        style={{ 
          display: "flex",
          alignItems: "center",
          gap: "12px", // Space between logo and text
          cursor: "pointer", 
        }}
      >
        <img 
          src="/logo.jpg" 
          alt="Whisk & Click Logo" 
          style={{ 
            height: "40px", // Adjust this based on your logo's proportions
            width: "auto",
            borderRadius: "8px", // Optional: softens sharp JPG corners
            objectFit: "contain"
          }} 
        />
        <span style={{ 
          fontWeight: 800, 
          fontSize: "22px", 
          color: "var(--primary)", 
          fontFamily: "var(--font-heading)",
          letterSpacing: "-0.5px"
        }}>
          Whisk & Click
        </span>
      </div>

      {/* Smart Navigation Actions */}
      <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
        
        <button 
          onClick={() => navigate("/catalog")}
          style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 600, color: "var(--text-secondary)", padding: "8px 12px" }}
        >
          Catalog
        </button>

        {!isAuthLoading && (
          user ? (
            <button 
              className="primary-button" 
              style={{ padding: "8px 16px", minHeight: "auto", fontSize: "14px" }} 
              // Route Staff/Admin to the Order Queue, Route Customers to B2C Dashboard
              onClick={() => navigate(role === "admin" || role === "staff" ? "/admin/orders" : "/dashboard")}
            >
              {role === "admin" || role === "staff" ? "Admin Portal" : "My Dashboard"}
            </button>
          ) : (
            <button 
              className="secondary-button" 
              style={{ padding: "8px 16px", minHeight: "auto", fontSize: "14px" }} 
              onClick={() => navigate("/auth")}
            >
              Sign In
            </button>
          )
        )}
      </div>
    </header>
  );
}