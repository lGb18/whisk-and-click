import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuthSession } from "../hooks/useAuthSession";

function genericInvalidCredentialsMessage() {
  return "Invalid email or password.";
}

function genericSignupMessage() {
  return "Unable to create account with those details.";
}

export default function AuthPage({ mode = "customer" }) {
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    signOut,
    role,
    profile,
    isAuthLoading,
    user,
    reloadProfile,
  } = useAuthSession();

  const isManagementMode = mode === "management";

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isManagementMode) {
      setIsRegister(false);
    }
  }, [isManagementMode]);

  useEffect(() => {
    if (isAuthLoading) return;

    // Only auto-redirect management users if they are already privileged.
    if (isManagementMode && (role === "staff" || role === "admin")) {
      navigate("/admin/orders", { replace: true });
    }
  }, [isAuthLoading, isManagementMode, role, navigate]);

  async function fetchCurrentProfile(currentUserId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", currentUserId)
      .single();

    if (error) throw error;
    return data;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError("");
    setIsSubmitting(true);

    try {
      if (isRegister && !isManagementMode) {
        await signUp({ email, password });
        navigate("/my-orders", { replace: true });
        return;
      }

      const data = await signIn({ email, password });
      const signedInUser = data?.user ?? data?.session?.user ?? null;

      if (!signedInUser?.id) {
        setLocalError(genericInvalidCredentialsMessage());
        return;
      }

      const currentProfile = await fetchCurrentProfile(signedInUser.id);
      await reloadProfile();

      if (currentProfile?.is_active === false) {
        await signOut();
        setLocalError("Your account is disabled. Contact an administrator.");
        return;
      }

      if (isManagementMode) {
        if (currentProfile?.role !== "staff" && currentProfile?.role !== "admin") {
          await signOut();
          setLocalError("Management access is not available for this account.");
          return;
        }

        navigate("/admin/orders", { replace: true });
        return;
      }

      navigate("/my-orders", { replace: true });
    } catch (error) {
      if (isRegister && !isManagementMode) {
        setLocalError(genericSignupMessage());
      } else {
        setLocalError(genericInvalidCredentialsMessage());
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCustomerSignOut() {
    setLocalError("");
    setIsSubmitting(true);

    try {
      await signOut();
      navigate("/auth", { replace: true });
    } catch (error) {
      setLocalError(error?.message ?? "Failed to sign out.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const pageTitle = isManagementMode ? "Management Login" : "Account Access";
  const pageSubtitle = isManagementMode
    ? "Sign in with a staff or admin account."
    : "Sign in or create an account to continue.";

  if (isAuthLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F9F7F4",
          display: "grid",
          placeItems: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            background: "#FFFFFF",
            border: "1px solid #ECECEC",
            borderRadius: "18px",
            padding: "24px",
            color: "#333333",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  // Customer mode: if already signed in, show account panel instead of bouncing away.
  if (!isManagementMode && user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F9F7F4",
          display: "grid",
          placeItems: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            display: "grid",
            gap: "18px",
            background: "#FFFFFF",
            border: "1px solid #ECECEC",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <div style={{ display: "grid", gap: "6px" }}>
            <h1 style={{ margin: 0, color: "#333333" }}>Account Access</h1>
            <div style={{ color: "#666666" }}>
              You are already signed in.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "8px",
              padding: "16px",
              borderRadius: "12px",
              background: "#FAFAFA",
              border: "1px solid #EEEEEE",
            }}
          >
            <div style={{ color: "#333333" }}>
              <strong>Email:</strong> {profile?.email || user?.email || "—"}
            </div>
            <div style={{ color: "#333333" }}>
              <strong>Role:</strong> {role || "customer"}
            </div>
          </div>

          {localError ? (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#FDEDED",
                color: "#B3261E",
                border: "1px solid #F5C2C0",
              }}
            >
              {localError}
            </div>
          ) : null}

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => navigate("/my-orders")}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: "#E25D4D",
                color: "#FFFFFF",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Go to My Orders
            </button>

            <button
              type="button"
              onClick={handleCustomerSignOut}
              disabled={isSubmitting}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid #DDDDDD",
                background: "#FFFFFF",
                color: "#333333",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Signing out..." : "Sign Out"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => navigate("/admin/login")}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #DDDDDD",
                background: "#FFFFFF",
                color: "#333333",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Management Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F9F7F4",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          display: "grid",
          gap: "18px",
          background: "#FFFFFF",
          border: "1px solid #ECECEC",
          borderRadius: "18px",
          padding: "24px",
        }}
      >
        <div style={{ display: "grid", gap: "6px" }}>
          <h1 style={{ margin: 0, color: "#333333" }}>{pageTitle}</h1>
          <div style={{ color: "#666666" }}>{pageSubtitle}</div>
        </div>

        {!isManagementMode ? (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #DDDDDD",
                background: !isRegister ? "#E25D4D" : "#FFFFFF",
                color: !isRegister ? "#FFFFFF" : "#333333",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setIsRegister(true)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #DDDDDD",
                background: isRegister ? "#E25D4D" : "#FFFFFF",
                color: isRegister ? "#FFFFFF" : "#333333",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Create Account
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #D8D8D8",
              background: "#FFFFFF",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #D8D8D8",
              background: "#FFFFFF",
            }}
          />

          {localError ? (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#FDEDED",
                color: "#B3261E",
                border: "1px solid #F5C2C0",
              }}
            >
              {localError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              background: "#E25D4D",
              color: "#FFFFFF",
              fontWeight: 600,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting
              ? "Please wait..."
              : isRegister && !isManagementMode
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {!isManagementMode ? (
            <button
              type="button"
              onClick={() => navigate("/admin/login")}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #DDDDDD",
                background: "#FFFFFF",
                color: "#333333",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Management Login
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/auth")}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #DDDDDD",
                background: "#FFFFFF",
                color: "#333333",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Back to Customer Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}