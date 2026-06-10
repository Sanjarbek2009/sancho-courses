const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Running database migration via raw SQL...');
  try {
    // 1. Add replyToId column if not exists
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "ChatMessage" ADD COLUMN IF NOT EXISTS "replyToId" TEXT;
    `);
    console.log('replyToId column added (or already existed).');

    // 2. Add foreign key constraint if it doesn't exist
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_replyToId_fkey" 
        FOREIGN KEY ("replyToId") REFERENCES "ChatMessage"("id") ON DELETE SET NULL;
      `);
      console.log('Foreign key constraint added successfully.');
    } catch (constraintErr) {
      if (constraintErr.message.includes('already exists') || constraintErr.message.includes('already_exists')) {
        console.log('Foreign key constraint already exists.');
      } else {
        throw constraintErr;
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
