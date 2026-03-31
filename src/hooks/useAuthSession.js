import { useAuthContext } from "../context/AuthProvider";

export function useAuthSession() {
  return useAuthContext();
}