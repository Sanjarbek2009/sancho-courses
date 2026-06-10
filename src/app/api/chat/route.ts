import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { broadcastMessage } from '@/lib/chatStream';

// GET: Oxirgi 50 ta xabarni yuklash
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const messages = await prisma.chatMessage.findMany({
      take: 50,
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isPaid: true,
          },
        },
        replyTo: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isPaid: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Yangi xabar yuborish
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const { content, type, fileUrl, replyToId } = await req.json();

    if (!content && !fileUrl) {
      return NextResponse.json({ error: 'Message content or file is required' }, { status: 400 });
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        userId: dbUser.id,
        content,
        type: type || 'text',
        fileUrl,
        replyToId: replyToId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isPaid: true,
          },
        },
        replyTo: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isPaid: true,
              },
            },
          },
        },
      },
    });

    // Real-time rejimda barcha ulanishlarga xabarni tarqatish
    broadcastMessage(newMessage);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
