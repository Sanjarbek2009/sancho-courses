import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userId = params.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { isPaid, isBanned, role } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isPaid: isPaid !== undefined ? isPaid : undefined,
        isBanned: isBanned !== undefined ? isBanned : undefined,
        role: role !== undefined ? role : undefined,
      },
    });

    // Clear server cache so the client side pulls fresh authorization state
    try {
      revalidatePath('/course');
      revalidatePath(`/profile`);
      revalidatePath(`/admin/dashboard`);
      revalidatePath(`/`);
    } catch (revalErr) {
      console.error('Revalidation error:', revalErr);
    }

    return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
