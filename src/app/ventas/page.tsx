"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  role: string;
};

export default function VentasPage() {
  const { accessToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!accessToken) {
      router.replace("/auth/login");
      return;
    }

    const payload: TokenPayload = jwtDecode(accessToken);

    if (payload.role !== "SALES") {
      router.replace("/");
    }
  }, [accessToken, loading, router]);

  if (loading || !accessToken) return null;

  const payload: TokenPayload = jwtDecode(accessToken);

  if (payload.role !== "SALES") return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Panel de ventas</h1>
        <p className="text-muted">Solo accesible para el rol SALES</p>
      </div>
    </div>
  );
}
