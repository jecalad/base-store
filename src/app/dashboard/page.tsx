"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { accessToken, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !accessToken) {
      router.replace("/auth/login");
    }
  }, [accessToken, loading, router]);

  if (loading) {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  if (!accessToken) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Bienvenido al dashboard</h1>
        <p className="text-muted">Estás autenticado 🎉</p>
      </div>
    </div>
  );
}
