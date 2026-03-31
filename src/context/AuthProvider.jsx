import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");

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
        setIsAuthLoading(false);
        return;
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        await ensureProfile(data.session.user);
      }

      setIsAuthLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        await ensureProfile(nextSession.user);
      }
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
  }

  const value = useMemo(
    () => ({
      session,
      user,
      isAuthLoading,
      authMessage,
      setAuthMessage,
      signUp,
      signIn,
      signOut,
    }),
    [session, user, isAuthLoading, authMessage]
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