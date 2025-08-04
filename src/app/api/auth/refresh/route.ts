import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
const REFRESH_SECRET = process.env.REFRESH_SECRET || "clave-refresh-secreta";
const ACCESS_SECRET = process.env.JWT_SECRET || "clave-access";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  console.log("🔄 Intentando refrescar token");

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: number; };
    console.log("✅ Token válido, generando nuevo access token");

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    const newAccessToken = jwt.sign(
      { userId: payload.userId, role: user?.role || "USER" },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (err) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
