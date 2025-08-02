import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

const ACCESS_SECRET = process.env.JWT_SECRET || 'clave-super-secreta'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'clave-refresh-secreta'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  }

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' } // breve, para frontend
  )

  const refreshToken = jwt.sign(
    { userId: user.id },
    REFRESH_SECRET,
    { expiresIn: '7d' } // largo plazo
  )

  // Guardar el refresh token en cookie segura
  
const cookieStore = await cookies() 
cookieStore.set('refreshToken', refreshToken, {
  httpOnly: true,
  secure: false,
  maxAge: 7 * 24 * 60 * 60, // 7 días
  sameSite: 'lax',
  path: '/',
});

  return NextResponse.json({ accessToken })
}
