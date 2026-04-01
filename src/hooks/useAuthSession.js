import { useAuthContext } from "../context/AuthProvider";

export function useAuthSession() {
  const context = useAuthContext();

  if (!context) {
    throw new Error('useAuthSession must be used within AuthProvider');
  }

  return context;
}