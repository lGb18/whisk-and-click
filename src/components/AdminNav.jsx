import { useNavigate, useLocation } from "react-router-dom";
import { useAuthSession } from "../hooks/useAuthSession";

export default function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, signOut } = useAuthSession();

  if (role !== "staff" && role !== "admin") {
    return null;
  }

  const buttonStyle = (isActive) => ({
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #DDDDDD",
    background: isActive ? "#E25D4D" : "#FFFFFF",
    color: isActive ? "#FFFFFF" : "#333333",
    cursor: "pointer",
    fontWeight: 600,
  });

  async function handleSignOut() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <button
        onClick={() => navigate("/admin/orders")}
        style={buttonStyle(location.pathname === "/admin/orders")}
      >
        Admin Orders
      </button>

      {role === "admin" ? (
        <button
          onClick={() => navigate("/admin/users")}
          style={buttonStyle(location.pathname === "/admin/users")}
        >
          Admin Users
        </button>
      ) : null}

      <button
        onClick={() => navigate("/my-orders")}
        style={buttonStyle(false)}
      >
        My Orders
      </button>

      <button
        onClick={handleSignOut}
        style={buttonStyle(false)}
      >
        Sign Out
      </button>
    </div>
  );
}