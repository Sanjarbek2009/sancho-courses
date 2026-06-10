import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE() {
  try {
    // 1. Session check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, isBanned: true },
    });

    if (!dbUser || dbUser.isBanned || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Delete all chat messages from database
    await prisma.chatMessage.deleteMany({});

    // 3. Delete physical uploaded media files in public/uploads/chat/
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'chat');
    if (existsSync(uploadsDir)) {
      const files = await readdir(uploadsDir);
      for (const file of files) {
        if (file.startsWith('.')) continue; // Keep hidden/system files
        
        try {
          await unlink(join(uploadsDir, file));
        } catch (err) {
          console.error(`Error deleting file ${file}:`, err);
        }
      }
    }

    return NextResponse.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
