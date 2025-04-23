const { PrismaClient } = require('@prisma/client');
console.log('Prisma Client Path:', require.resolve('.prisma/client'));
const prisma = new PrismaClient();
prisma.user.findMany().then(console.log).catch(console.error);