import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPaid: true, role: true, isBanned: true },
    });

    if (dbUser?.isBanned) {
      return NextResponse.json({ error: 'banned' }, { status: 403 });
    }

    const hasAccess = dbUser && (dbUser.isPaid || dbUser.role === 'ADMIN');
    if (!hasAccess) {
      return NextResponse.json({ error: 'premium_required' }, { status: 403 });
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId: session.user.id },
      select: { lessonId: true, isCompleted: true },
    });

    return NextResponse.json(progress);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPaid: true, role: true, isBanned: true },
    });

    if (dbUser?.isBanned) {
      return NextResponse.json({ error: 'banned' }, { status: 403 });
    }

    const hasAccess = dbUser && (dbUser.isPaid || dbUser.role === 'ADMIN');
    if (!hasAccess) {
      return NextResponse.json({ error: 'premium_required' }, { status: 403 });
    }

    const { lessonId, isCompleted } = await req.json();

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        isCompleted: isCompleted !== undefined ? isCompleted : true,
      },
      create: {
        userId: session.user.id,
        lessonId,
        isCompleted: isCompleted !== undefined ? isCompleted : true,
      },
    });

    return NextResponse.json({ message: 'Progress updated', progress });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
