"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  role: string;
};

export default function AdminPage() {
  const { accessToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!accessToken) {
      router.replace("/auth/login");
      return;
    }

    const payload: TokenPayload = jwtDecode(accessToken);
    

    if (payload.role !== "ADMIN") {
      router.replace("/");
    }
  }, [accessToken, loading, router]);

  if (loading || !accessToken) return null;

  const payload: TokenPayload = jwtDecode(accessToken);

  if (payload.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Panel de administración</h1>
        <p className="text-muted">Acceso restringido para administradores ✅</p>
      </div>
    </div>
  );
}
