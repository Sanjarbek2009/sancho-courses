import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { registerClient } from '@/lib/chatStream';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, isPaid: true, role: true, isBanned: true },
    });

    if (!dbUser || dbUser.isBanned) {
      return new Response('Forbidden', { status: 403 });
    }

    const isPremium = dbUser.isPaid || dbUser.role === 'ADMIN';
    if (!isPremium) {
      return new Response('Premium Required', { status: 403 });
    }

    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    // Bog'lanish muvaffaqiyatli o'rnatilgani haqida dastlabki signal
    writer.write(encoder.encode('event: connected\ndata: {}\n\n'));

    // Ulanishni saqlab qolish uchun har 15 soniyada heartbeat yuborish
    const heartbeat = setInterval(() => {
      try {
        writer.write(encoder.encode(': heartbeat\n\n'));
      } catch {
        clearInterval(heartbeat);
      }
    }, 15000);

    // Stream mijozini ro'yxatdan o'tkazish
    const unregister = registerClient((message: string) => {
      try {
        writer.write(encoder.encode(`data: ${message}\n\n`));
      } catch (e) {
        console.error('Error writing to stream:', e);
        unregister();
      }
    });

    // Ulanish uzilganda (masalan, sahifa yopilganda) tozalash
    req.signal.addEventListener('abort', () => {
      clearInterval(heartbeat);
      unregister();
      try {
        writer.close();
      } catch {
        // ignore
      }
    });

    return new Response(responseStream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('SSE Stream Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
