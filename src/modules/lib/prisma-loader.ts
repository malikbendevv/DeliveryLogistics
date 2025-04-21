// Force Windows to load Prisma correctly
const path = require('path');
const prismaPath = path.join(__dirname, 'node_modules', '.prisma', 'client');
const { PrismaClient } = require(prismaPath);

module.exports = new PrismaClient();
