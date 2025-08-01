import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const passwordAdmin = await bcrypt.hash('admin123', 10)
  const passwordUser = await bcrypt.hash('user123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@tienda.com' },
    update: {},
    create: {
      email: 'admin@tienda.com',
      name: 'Admin',
      password: passwordAdmin,
      role: 'ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { email: 'cliente@tienda.com' },
    update: {},
    create: {
      email: 'cliente@tienda.com',
      name: 'Cliente',
      password: passwordUser,
      role: 'USER',
    },
  })

  console.log('✅ Seed ejecutado correctamente.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
