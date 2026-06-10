import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const email = session.user.email;

    // Check database to see if already paid
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPaid: true, role: true },
    });

    if (user?.isPaid || user?.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Siz allaqachon premium xarid qilgansiz' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (stripe) {
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'AI Video Masterclass - SANCHO.AI',
                description: 'Lifetime access to AI Video Academy modules, script templates, and community dashboard.',
              },
              unit_amount: 9900,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${appUrl}/course?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/?canceled=true`,
        customer_email: email || undefined,
        metadata: {
          userId: userId,
        },
      });

      return NextResponse.json({ url: checkoutSession.url });
    } else {
      // Mock payment fallback
      await prisma.user.update({
        where: { id: userId },
        data: { isPaid: true },
      });

      return NextResponse.json({
        url: `${appUrl}/course?payment=mock_success`,
        isMock: true,
      });
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
