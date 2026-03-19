const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const colors = await prisma.color.findMany();
  console.log('Count:', colors.length);
  console.log('Colors:', colors);
  process.exit(0);
}
main();
