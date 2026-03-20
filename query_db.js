const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const props = await prisma.property.findMany({ select: { id: true, title: true, price: true } });
  console.log(props);
}
main().catch(console.error).finally(() => prisma.$disconnect());
