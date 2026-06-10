import { NextResponse, NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Foydalanuvchi premium yoki adminligini tekshirish
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, isPaid: true, role: true, isBanned: true },
    });

    if (!dbUser || dbUser.isBanned) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const isPremium = dbUser.isPaid || dbUser.role === 'ADMIN';
    if (!isPremium) {
      return NextResponse.json({ error: 'premium_required' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // public/uploads/chat/ katalogini yaratish (mavjud bo'lmasa)
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'chat');
    await mkdir(uploadsDir, { recursive: true });

    // Fayl nomini tozalash (faqat inglizcha harflar, raqamlar va nuqtalar)
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${Date.now()}_${cleanFilename}`;
    const filePath = join(uploadsDir, filename);

    // Faylni yozish
    await writeFile(filePath, buffer);

    const fileUrl = `/api/chat/media/${filename}`;
    return NextResponse.json({ message: 'File uploaded successfully', fileUrl });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
