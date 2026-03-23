import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const brand = await (prisma as any).brand.findFirst()
    if (brand) {
      const updated = await (prisma as any).brand.update({
        where: { id: brand.id },
        data: { name: brand.name + ' UPDATED' }
      })
      console.log('Brand updated:', updated.name)
    } else {
      console.log('No brand found to update')
    }
  } catch (e) {
    console.error('Error updating brand:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
