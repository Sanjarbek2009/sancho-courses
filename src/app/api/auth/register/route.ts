import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'USER';
    const isPaid = role === 'ADMIN';

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword(password),
        role,
        isPaid,
      },
    });

    const response = NextResponse.json({
      message: 'Registered successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isPaid: user.isPaid },
    });

    response.cookies.delete('admin_session');

    return response;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
