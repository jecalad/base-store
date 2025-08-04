"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  loading: boolean;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
const [loading, setLoading] = useState(true);


useEffect(() => {
  const getAccessTokenFromRefresh = async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.accessToken) {
        setAccessToken(data.accessToken);
        console.info("✅ Token restaurado desde refresh");
      } else {
        console.info("🔁 No se restauró el token (sin refresh cookie o token expirado)");
        setAccessToken(null);
      }
    } catch (err) {
      console.error("❌ Error inesperado al refrescar el token:", err);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  getAccessTokenFromRefresh();
}, []);
  
  
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
