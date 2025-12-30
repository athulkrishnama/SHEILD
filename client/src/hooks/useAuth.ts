import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/check", {
        withCredentials: true,
      });

      setAuthState({
        isAuthenticated: response.data.authenticated,
        user: response.data.user || null,
        loading: false,
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    ...authState,
    checkAuth,
    logout,
  };
};
