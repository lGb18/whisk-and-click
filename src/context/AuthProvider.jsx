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

  async function loadOwnProfile(currentUserId) {
    if (!currentUserId) {
      setProfile(null);
      setRole("customer");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUserId)
      .single();

    if (error) {
      console.error("Profile load error:", error.message);
      setProfile(null);
      setRole("customer");
      return;
    }

    setProfile(data);
    setRole(data?.role ?? "customer");

    console.log("loadOwnProfile userId:", currentUserId);
    console.log("profile row:", data);
    console.log("profile error:", error);
  }

  async function ensureProfile(currentUser) {
    if (!currentUser) return;

    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || null,
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("Profile upsert error:", error.message);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      setIsAuthLoading(true);

      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        setAuthMessage(error.message);
        setSession(null);
        setUser(null);
        setProfile(null);
        setRole("customer");
        setIsAuthLoading(false);
        return;
      }

      const sessionData = data?.session ?? null;

      setSession(sessionData);
      setUser(sessionData?.user ?? null);

      if (sessionData?.user) {
        await ensureProfile(sessionData.user);
        await loadOwnProfile(sessionData.user.id);
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
        await loadOwnProfile(nextSession.user.id);
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

    setSession(null);
    setUser(null);
    setProfile(null);
    setRole("customer");
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
    }),
    [session, user, isAuthLoading, authMessage, profile, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider.");
  }

  return context;
}