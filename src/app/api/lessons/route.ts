import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { encryptVideoUrl } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    let dbUser = null;
    if (session?.user?.id) {
      dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, email: true, role: true, isPaid: true, isBanned: true },
      });
    }

    if (dbUser?.isBanned) {
      return NextResponse.json({ error: 'banned' }, { status: 403 });
    }

    const isFullAccess = dbUser && (dbUser.isPaid || dbUser.role === 'ADMIN');

    if (!isFullAccess) {
      return NextResponse.json({ error: 'premium_required' }, { status: 403 });
    }

    const modules = await prisma.module.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    const isAdmin = dbUser?.role === 'ADMIN';

    // Talabalar uchun videoUrl shifrlanadi, adminlar uchun ochiq qoladi
    const processedModules = modules.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((les) => ({
        ...les,
        videoUrl: isAdmin ? les.videoUrl : encryptVideoUrl(les.videoUrl),
      })),
    }));

    return NextResponse.json(processedModules);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session && session.user && session.user.role === 'ADMIN';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title, videoUrl, description, notes, homework, orderIndex, moduleTitle, moduleDescription } = await req.json();

    if (!title || !videoUrl || !moduleTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let courseModule = await prisma.module.findFirst({
      where: { title: moduleTitle },
    });

    if (!courseModule) {
      const moduleCount = await prisma.module.count();
      courseModule = await prisma.module.create({
        data: {
          title: moduleTitle,
          description: moduleDescription || '',
          orderIndex: moduleCount + 1,
        },
      });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        videoUrl,
        description: description || '',
        notes: notes || '',
        homework: homework || '',
        orderIndex: parseInt(orderIndex) || 0,
        moduleId: courseModule.id,
      },
    });

    return NextResponse.json({ message: 'Lesson created successfully', lesson });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
