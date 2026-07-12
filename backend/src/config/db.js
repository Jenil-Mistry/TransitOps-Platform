// Prisma Client Singleton
// Prevents multiple PrismaClient instances in development (hot reload)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

module.exports = prisma;
