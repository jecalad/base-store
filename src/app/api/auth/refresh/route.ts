import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    const newAccessToken = jwt.sign(
      { userId: payload.userId },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (err) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
