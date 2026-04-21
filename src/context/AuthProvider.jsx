import { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState("customer");
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");

  const lastProfileLoadRef = useRef(null);
  const STALE_THRESHOLD_MS = 60_000;

  function isProfileStale() {
    if (!lastProfileLoadRef.current) return true;
    return Date.now() - lastProfileLoadRef.current > STALE_THRESHOLD_MS;
  }
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
      .select("id, full_name, phone_number, email, role, is_active, created_at, updated_at, disabled_at")
      .eq("id", currentUserId)
      .maybeSingle();

    if (error) {
      console.error("Profile load error:", error.message);
      // setProfile(null);
      // setRole("customer");
      return null;
    }

    setProfile(data);
    setRole(data?.role ?? "customer");
    lastProfileLoadRef.current = Date.now();
    return data;
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

  async function reloadProfile(force = false) {
    if (!user?.id) return null;
    if (!force && !isProfileStale()) return profile;

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
        const profileData = await loadOwnProfile(nextSession.user.id);
        await enforceActiveProfile(profileData);
      } else {
        setProfile(null);
        setRole("customer");
      }
      queryClient.invalidateQueries();
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signUp({ email, password, options }) {
    setAuthMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
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
    let wasDeadlocked = false;
    
    try {
      // 1. Try normal signout
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((_, reject) => 
          setTimeout(() => {
            wasDeadlocked = true; // Flag that Supabase is frozen
            reject(new Error("Signout network timeout"));
          }, 3000)
        )
      ]);
    } catch (error) {
      console.warn("Server signout delayed or failed, forcing local wipe:", error);
    } finally {
      // 2. Clear React and TanStack state
      if (queryClient) {
        queryClient.clear();
      }
      await clearAuthState();

      // 3. NUKE local storage to prevent Zombie Sessions
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          // Manually delete the Supabase auth token
          if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        console.warn("Failed to clear localStorage:", e);
      }

      // 4. If Supabase was deadlocked, React Router's navigate() is not enough.
      if (wasDeadlocked) {
        console.warn("Hard reloading to destroy frozen Supabase client...");
        window.location.href = "/auth";
      }
    }
  }
  // --- PASSWORD RECOVERY FLOW ---
  async function resetPassword(email) {
    setAuthMessage("");
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?type=recovery`,
    });

    if (error) {
      setAuthMessage(error.message);
      throw error;
    }
    return data;
  }

  async function updatePassword(newPassword) {
    setAuthMessage("");
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setAuthMessage(error.message);
      throw error;
    }
    return data;
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
      resetPassword,
      updatePassword,
    }),
    [session, user, isAuthLoading, authMessage, profile, role]
  );
  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;
    let lastVisibleTime = Date.now();
    const DEEP_SLEEP_THRESHOLD = 65000; // 5 minutes

    // 1. Maintain a rolling timestamp of when the app was last confirmed active
    const heartbeatInterval = window.setInterval(() => {
      // If the interval paused and skipped heavily due to OS sleep, catch it here
      if (Date.now() - lastVisibleTime > DEEP_SLEEP_THRESHOLD) {
        console.warn("Heartbeat skipped significantly. Forcing reload...");
        window.location.reload();
      } else {
        lastVisibleTime = Date.now();
      }
    }, 15000); // Check every 15 seconds

    // 2. Profile Revalidation Logic (Throttled)
    let isRevalidating = false;
    async function revalidateProfileAccess() {
      if (isRevalidating || isProfileStale() || cancelled) return;
      
      isRevalidating = true;
      try {
        const profileData = await loadOwnProfile(user.id);
        if (cancelled) return;
        await enforceActiveProfile(profileData);
      } catch (error) {
        console.error("Profile revalidation error:", error);
      } finally {
        // Simple debounce to prevent overlapping calls
        setTimeout(() => { isRevalidating = false; }, 2000);
      }
    }

    // 3. The true wake-up handler
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        // 1. The user left the tab or the computer is sleeping.
        // STOP the Supabase background timers so they don't corrupt the locks.
        supabase.auth.stopAutoRefresh();
      } else if (document.visibilityState === "visible") {
        // 2. The user is back.
        // RESTART the timers safely.
        supabase.auth.startAutoRefresh();
        
        // 3. Force a clean session check now that the thread is awake.
        supabase.auth.getSession();
      }
    }

    // Standard background revalidation for active sessions
    const revalidateInterval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        revalidateProfileAccess();
      }
    }, 60000); // 1 minute

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(heartbeatInterval);
      window.clearInterval(revalidateInterval);
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