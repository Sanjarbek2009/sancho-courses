import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const hasAccess = session && session.user && session.user.role === 'ADMIN';
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const paidStudentsCount = await prisma.user.count({
      where: {
        isPaid: true,
        role: { not: 'ADMIN' },
      },
    });

    const totalStudents = await prisma.user.count({
      where: {
        role: { not: 'ADMIN' },
      },
    });

    const totalRevenue = paidStudentsCount * 19;

    const totalLessons = await prisma.lesson.count();
    const totalCompletions = await prisma.userProgress.count({
      where: { isCompleted: true },
    });

    const averageProgress =
      totalStudents > 0 && totalLessons > 0
        ? Math.round((totalCompletions / (totalStudents * totalLessons)) * 100)
        : 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSignups = await prisma.user.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    });

    return NextResponse.json({
      totalRevenue,
      activePaidStudents: paidStudentsCount,
      averageProgress: Math.min(100, averageProgress),
      recentSignups,
      totalStudents,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
