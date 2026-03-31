import { useState } from "react";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import { useAuthSession } from "../hooks/useAuthSession";

export default function AuthPage() {
  const {
    user,
    authMessage,
    setAuthMessage,
    signUp,
    signIn,
    signOut,
    isAuthLoading,
  } = useAuthSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignUp() {
    setIsSubmitting(true);
    setAuthMessage("");

    try {
      await signUp({ email, password });
      setAuthMessage("Sign up successful. Check your email if confirmation is enabled.");
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignIn() {
    setIsSubmitting(true);
    setAuthMessage("");

    try {
      await signIn({ email, password });
      setAuthMessage("Signed in successfully.");
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setIsSubmitting(true);
    setAuthMessage("");

    try {
      await signOut();
      setAuthMessage("Signed out.");
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="container-summary">
        <div
          className="card"
          style={{
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <PageHeader
            title="Account Access"
            subtitle="Sign in to save and access your orders securely."
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting || isAuthLoading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting || isAuthLoading}
          />

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <PrimaryButton onClick={handleSignIn} disabled={isSubmitting || isAuthLoading}>
              Sign In
            </PrimaryButton>

            <SecondaryButton onClick={handleSignUp} disabled={isSubmitting || isAuthLoading}>
              Sign Up
            </SecondaryButton>

            {user && (
              <SecondaryButton onClick={handleSignOut} disabled={isSubmitting || isAuthLoading}>
                Sign Out
              </SecondaryButton>
            )}
          </div>

          <div>
            <strong>Current user:</strong> {user?.email || "No active session"}
          </div>

          {authMessage && <div>{authMessage}</div>}
        </div>
      </div>
    </div>
  );
}