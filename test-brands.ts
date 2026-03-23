import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const brands = await (prisma as any).brand.findMany()
    console.log('Brands found:', brands.length)
  } catch (e) {
    console.error('Error querying brands:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
