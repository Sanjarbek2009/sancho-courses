import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 400 });
  }

  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook signature failed: ${errMsg}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      // Perform atomic database transaction
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: {
            isPaid: true,
            stripeCustId: session.customer as string,
          },
        }),
      ]);

      // Clear Next.js server-side cache for critical paths
      try {
        revalidatePath('/course');
        revalidatePath('/');
      } catch (revalErr) {
        console.error('Revalidation error:', revalErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
