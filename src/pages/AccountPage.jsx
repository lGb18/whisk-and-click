import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import AccountSummaryCard from "../components/AccountSummaryCard";
import { ErrorStateCard, SuccessStateCard } from "../components/PageState";
import { useAuthSession } from "../hooks/useAuthSession";
import { updateOwnProfile } from "../utils/profileQueries";

export default function AccountPage() {
  const navigate = useNavigate();
  const {
    user,
    profile,
    role,
    signOut,
    reloadProfile,
    isAuthLoading,
  } = useAuthSession();

  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setFullName(profile?.full_name || "");
  }, [profile]);


  async function handleSave(event) {
    event.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateOwnProfile({
        userId: user.id,
        fullName: fullName.trim() || null,
      });

      await reloadProfile();
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setErrorMessage(error?.message ?? "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await signOut();
      navigate("/auth", { replace: true });
    } catch (error) {
      setErrorMessage(error?.message ?? "Failed to sign out.");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (isAuthLoading) {
    return null;
  }

  return (
    <AppShell
      title="Account"
      subtitle="Review your account details, update your profile, and sign out."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 360px) 1fr",
          gap: "18px",
        }}
      >
        <AccountSummaryCard profile={profile} user={user} role={role} />

        <form
          onSubmit={handleSave}
          style={{
            display: "grid",
            gap: "14px",
            padding: "18px",
            borderRadius: "16px",
            background: "#FFFFFF",
            border: "1px solid #ECECEC",
          }}
        >
          <h2 style={{ margin: 0, color: "#333333", fontSize: "1.1rem" }}>
            Edit Profile
          </h2>

          <div style={{ display: "grid", gap: "6px" }}>
            <label style={{ fontWeight: 600, color: "#444444" }}>
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #D8D8D8",
                background: "#FFFFFF",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: "6px" }}>
            <label style={{ fontWeight: 600, color: "#444444" }}>
              Email
            </label>
            <input
              type="text"
              readOnly
              value={profile?.email || user?.email || ""}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #D8D8D8",
                background: "#F8F8F8",
                color: "#666666",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: "6px" }}>
            <label style={{ fontWeight: 600, color: "#444444" }}>
              Role
            </label>
            <input
              type="text"
              readOnly
              value={role || ""}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #D8D8D8",
                background: "#F8F8F8",
                color: "#666666",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: "6px" }}>
            <label style={{ fontWeight: 600, color: "#444444" }}>
              Access State
            </label>
            <input
              type="text"
              readOnly
              value={profile?.is_active === false ? "Disabled" : "Active"}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #D8D8D8",
                background: "#F8F8F8",
                color: "#666666",
              }}
            />
          </div>

          {errorMessage ? <ErrorStateCard message={errorMessage} /> : null}
          {successMessage ? <SuccessStateCard message={successMessage} /> : null}

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: "#E25D4D",
                color: "#FFFFFF",
                fontWeight: 600,
                cursor: isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid #DDDDDD",
                background: "#FFFFFF",
                color: "#333333",
                fontWeight: 600,
                cursor: isSigningOut ? "not-allowed" : "pointer",
                opacity: isSigningOut ? 0.7 : 1,
              }}
            >
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}