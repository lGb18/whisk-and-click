import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState("customer");
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");

  async function clearAuthState() {
    setSession(null);
    setUser(null);
    setProfile(null);
    setRole("customer");
  }

  async function loadOwnProfile(currentUserId) {
    if (!currentUserId) {
      setProfile(null);
      setRole("customer");
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, is_active, created_at, updated_at, disabled_at")
      .eq("id", currentUserId)
      .single();

    if (error) {
      console.error("Profile load error:", error.message);
      setProfile(null);
      setRole("customer");
      return null;
    }

    setProfile(data);
    setRole(data?.role ?? "customer");
    return data;
  }

  async function ensureProfile(currentUser) {
    if (!currentUser) return;

    const payload = {
      id: currentUser.id,
      email: currentUser.email || null,
    };

    const metadataFullName = currentUser.user_metadata?.full_name?.trim();

    if (metadataFullName) {
      payload.full_name = metadataFullName;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Profile upsert error:", error.message);
    }
  }

  async function enforceActiveProfile(currentProfile) {
    if (currentProfile && currentProfile.is_active === false) {
      await supabase.auth.signOut();
      await clearAuthState();
      setAuthMessage("Your account is disabled. Contact an administrator.");
      return false;
    }

    return true;
  }

  async function reloadProfile() {
    if (!user?.id) return null;
    const profileData = await loadOwnProfile(user.id);
    await enforceActiveProfile(profileData);
    return profileData;
  }

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      setIsAuthLoading(true);

      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        setAuthMessage(error.message);
        await clearAuthState();
        setIsAuthLoading(false);
        return;
      }

      const sessionData = data?.session ?? null;

      setSession(sessionData);
      setUser(sessionData?.user ?? null);

      if (sessionData?.user) {
        await ensureProfile(sessionData.user);
        const profileData = await loadOwnProfile(sessionData.user.id);
        await enforceActiveProfile(profileData);
      } else {
        setProfile(null);
        setRole("customer");
      }

      if (isMounted) {
        setIsAuthLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        await ensureProfile(nextSession.user);
        const profileData = await loadOwnProfile(nextSession.user.id);
        await enforceActiveProfile(profileData);
      } else {
        setProfile(null);
        setRole("customer");
      }

      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signUp({ email, password }) {
    setAuthMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setAuthMessage(error.message);
      throw error;
    }

    return data;
  }

  async function signIn({ email, password }) {
    setAuthMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthMessage(error.message);
      throw error;
    }

    return data;
  }

  async function signOut() {
    setAuthMessage("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthMessage(error.message);
      throw error;
    }

    await clearAuthState();
  }

  const value = useMemo(
    () => ({
      session,
      user,
      isAuthLoading,
      authMessage,
      profile,
      role,
      setAuthMessage,
      signUp,
      signIn,
      signOut,
      reloadProfile,
    }),
    [session, user, isAuthLoading, authMessage, profile, role]
  );
  useEffect(() => {
  if (!user?.id) return;

  let cancelled = false;

  async function revalidateProfileAccess() {
      try {
        const profileData = await loadOwnProfile(user.id);

        if (cancelled) return;

        await enforceActiveProfile(profileData);
      } catch (error) {
        console.error("Profile revalidation error:", error);
      }
    }

    function handleWindowFocus() {
      revalidateProfileAccess();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        revalidateProfileAccess();
      }
    }

    const intervalId = window.setInterval(() => {
      revalidateProfileAccess();
    }, 30000); // every 30 seconds

    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user?.id]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider.");
  }

  return context;
}