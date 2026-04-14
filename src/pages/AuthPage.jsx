import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuthSession } from "../hooks/useAuthSession";


export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { 
    signIn, signUp, signOut, resetPassword, updatePassword, 
    user, isAuthLoading, reloadProfile 
  } = useAuthSession();

  const initialView = searchParams.get("type") === "recovery" ? "update_password" : "sign_in";
  const [view, setView] = useState(initialView);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fullName, setFullName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if they are already logged in (but NOT if they are here to update their password)
  useEffect(() => {
    if (isAuthLoading) return;
    if (user && view !== "update_password") {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthLoading, user, view, navigate]);

  async function handleGoogleLogin() {
    setLocalError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' }
    });
    if (error) setLocalError("Failed to initialize Google login.");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      // --- FLOW 1: REQUEST PASSWORD RESET LINK ---
      if (view === "forgot_password") {
        if (!email) throw new Error("Please enter your email.");
        await resetPassword(email);
        setSuccessMessage("Check your email for the password reset link!");
        setIsSubmitting(false);
        return;
      }

      // --- FLOW 2: UPDATE TO NEW PASSWORD ---
      if (view === "update_password") {
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        await updatePassword(password);
        setSuccessMessage("Password updated successfully! Redirecting...");
        setTimeout(() => navigate("/dashboard", { replace: true }), 2000);
        return;
      }

      // --- FLOW 3: SIGN UP ---
      if (view === "sign_up") {
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        if (!fullName.trim()) throw new Error("Please provide your full name.");
        if (!phoneNumber.trim()) throw new Error("Please provide a contact number.");
        if (!acceptedTerms) throw new Error("You must agree to the Terms of Service.");
        
        await signUp({ 
          email, 
          password, 
          options: { 
            data: { 
              full_name: fullName.trim(),
              phone_number: phoneNumber.trim() 
            } 
          } 
        });
        
        navigate("/dashboard", { replace: true });
        return;
      }

      // --- FLOW 4: SIGN IN (Default) ---
      const data = await signIn({ email, password });
      const signedInUser = data?.user ?? data?.session?.user ?? null;

      if (!signedInUser?.id) throw new Error("Invalid email or password.");

      const currentProfile = await reloadProfile(true); 

      if (currentProfile?.is_active === false) {
        await signOut();
        throw new Error("Your account is disabled. Contact an administrator.");
      }

      navigate("/dashboard", { replace: true });
      
    } catch (error) {
      setLocalError(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAuthLoading) return <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "var(--background, #F9F7F4)", display: "grid", placeItems: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "#FFFFFF", border: "1px solid #ECECEC", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        
        {/* Dynamic Header */}
        <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px", textAlign: "center" }}>
          {view === "sign_up" && "Create an Account"}
          {view === "sign_in" && "Welcome Back"}
          {view === "forgot_password" && "Reset Password"}
          {view === "update_password" && "Set New Password"}
        </h1>
        
        <p style={{ color: "#666666", textAlign: "center", marginBottom: "24px", fontSize: "14px", lineHeight: "1.5" }}>
          {view === "sign_up" && "Join Whisk & Click to start designing custom cakes."}
          {view === "sign_in" && "Sign in to manage your orders."}
          {view === "forgot_password" && "Enter your email address and we'll send you a link to reset your password."}
          {view === "update_password" && "Your identity has been verified. Please enter your new secure password below."}
        </p>

        {/* Hide OAuth for password recovery flows */}
        {(view === "sign_in" || view === "sign_up") && (
          <>
            <button type="button" onClick={handleGoogleLogin} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #D8D8D8", background: "#FFF", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "500", marginBottom: "24px" }}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: "18px", height: "18px" }} />
              Continue with Google
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ECECEC" }} />
              <span style={{ fontSize: "12px", color: "#999" }}>OR EMAIL</span>
              <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ECECEC" }} />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {view === "sign_up" && (
            <>
              {/* Existing Full Name Input */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D8D8D8" }} placeholder="Jane Doe" />
              </div>

              {/* Phone Number Input */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>Phone Number</label>
                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D8D8D8" }} placeholder="+63 900 000 0000" />
                <span style={{ fontSize: "12px", color: "#666" }}>For urgent updates regarding your cake orders.</span>
              </div>
            </>
          )}

          {/* Email is needed for Sign In, Sign Up, and Forgot Password (but NOT update password) */}
          {view !== "update_password" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #D8D8D8" }} placeholder="jane@example.com" />
            </div>
          )}

          {/* Password is needed for Sign In, Sign Up, and Update Password (but NOT forgot password) */}
          {view !== "forgot_password" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                 <label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                    {view === "update_password" ? "New Password" : "Password"}
                 </label>
                 
                 {/* The Forgot Password Link */}
                 {view === "sign_in" && (
                   <button type="button" onClick={() => { setView("forgot_password"); setLocalError(""); setSuccessMessage(""); }} style={{ background: "none", border: "none", color: "var(--primary, #E25D4D)", fontSize: "12px", cursor: "pointer", padding: 0 }}>
                     Forgot password?
                   </button>
                 )}
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #D8D8D8", paddingRight: "40px" }} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>
                  {showPassword ? "-" : "---"}
                </button>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {localError && <div style={{ padding: "10px", background: "#FDEDED", color: "#B3261E", borderRadius: "8px", fontSize: "14px", border: "1px solid #F5C2C0" }}>{localError}</div>}
          {successMessage && <div style={{ padding: "10px", background: "#EDFDF2", color: "#198754", borderRadius: "8px", fontSize: "14px", border: "1px solid #C3F0D3" }}>{successMessage}</div>}

          {/* Dynamic Submit Button */}
          <button type="submit" disabled={isSubmitting} style={{ padding: "14px", borderRadius: "8px", border: "none", background: "var(--primary, #E25D4D)", color: "#FFF", fontWeight: "600", fontSize: "16px", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, marginTop: "8px" }}>
            {isSubmitting ? "Processing..." : 
              view === "sign_in" ? "Sign In" : 
              view === "sign_up" ? "Create Account" : 
              view === "forgot_password" ? "Send Reset Link" : 
              "Update Password"
            }
          </button>
          {view === "sign_up" && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "8px" }}>
              <input 
                type="checkbox" 
                id="terms" 
                checked={acceptedTerms} 
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{ marginTop: "3px", cursor: "pointer" }}
              />
              <label htmlFor="terms" style={{ fontSize: "12px", color: "#666", lineHeight: "1.4", cursor: "pointer" }}>
                I agree to the <a href="/terms" target="_blank" style={{ color: "var(--primary, #E25D4D)", textDecoration: "none" }}>Terms of Service</a> and acknowledge the <a href="/privacy" target="_blank" style={{ color: "var(--primary, #E25D4D)", textDecoration: "none" }}>Privacy Policy</a>.
              </label>
            </div>
          )}
        </form>

        {/* Bottom Navigation */}
        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#666" }}>
          {view === "sign_up" && (
            <>Already have an account? <button type="button" onClick={() => setView("sign_in")} style={{ background: "none", border: "none", color: "var(--primary, #E25D4D)", fontWeight: "600", cursor: "pointer", padding: 0 }}>Sign In</button></>
          )}
          {view === "sign_in" && (
            <>Don't have an account? <button type="button" onClick={() => setView("sign_up")} style={{ background: "none", border: "none", color: "var(--primary, #E25D4D)", fontWeight: "600", cursor: "pointer", padding: 0 }}>Sign Up</button></>
          )}
          {(view === "forgot_password" || view === "update_password") && (
            <button type="button" onClick={() => setView("sign_in")} style={{ background: "none", border: "none", color: "var(--primary, #E25D4D)", fontWeight: "600", cursor: "pointer", padding: 0 }}>
              &larr; Back to Sign In
            </button>
          )}
        </div>

      </div>
    </div>
  );
}