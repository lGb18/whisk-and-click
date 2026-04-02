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

export default function AuthPage() {
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    signOut,
    user,
    isAuthLoading,
    reloadProfile,
  } = useAuthSession();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthLoading, user, navigate]);

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
      if (isRegister) {
        await signUp({ email, password });
        navigate("/dashboard", { replace: true });
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

      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (isRegister) {
        setLocalError(genericSignupMessage());
      } else {
        setLocalError(genericInvalidCredentialsMessage());
      }
    } finally {
      setIsSubmitting(false);
    }
  }

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
            Sign in or create an account to continue.
          </div>
        </div>

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
              : isRegister
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}