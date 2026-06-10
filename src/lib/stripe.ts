import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';

const apiVersionOption = '2026-05-27.dahlia' as const;

export const stripe = stripeSecret
  ? new Stripe(stripeSecret, {
      apiVersion: apiVersionOption,
    })
  : null;
