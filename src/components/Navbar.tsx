"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

type TokenPayload = {
  role: string;
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { accessToken } = useAuth();

  let role: string | null = null;
  if (accessToken) {
    try {
      const payload: TokenPayload = jwtDecode(accessToken);
      role = payload.role;
    } catch (e) {
      role = null;
    }
  }

  return (
    <header className="border-b shadow-sm bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-black">
          BaseStore
        </Link>

        {/* Centro: menú */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-sm text-gray-700 hover:text-black">
            Productos
          </Link>
          {role === "ADMIN" && (
            <Link href="/admin" className="text-sm text-gray-700 hover:text-black">
              Admin
            </Link>
          )}
          {role === "SALES" && (
            <Link href="/ventas" className="text-sm text-gray-700 hover:text-black">
              Ventas
            </Link>
          )}
        </nav>

        {/* Derecha: login + carrito */}
        <div className="hidden md:flex gap-4 items-center">
        {accessToken ? (
        <form action="/api/auth/logout" method="POST">
            <Button type="submit" variant="outline" size="sm">
            Cerrar sesión
            </Button>
        </form>
        ) : (
        <Link href="/auth/login" className="text-sm text-gray-700 hover:text-black">
            Ingresar
        </Link>
        )}

          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-black" />
            {/* TODO: badge con cantidad */}
          </Link>
        </div>

        {/* Botón móvil */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-sm text-gray-700 hover:text-black">Productos</Link>
            {role === "ADMIN" && <Link href="/admin">Admin</Link>}
            {role === "SALES" && <Link href="/ventas">Ventas</Link>}
            {accessToken ? (
              <form action="/api/auth/logout" method="POST">
                <Button type="submit" variant="outline" size="sm">
                  Cerrar sesión
                </Button>
              </form>
            ) : (
              <Link href="/auth/login" className="text-sm text-gray-700 hover:text-black">
                Ingresar
              </Link>
            )}
            <Link href="/cart">Carrito</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
