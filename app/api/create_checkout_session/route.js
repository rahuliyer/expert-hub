// app/api/create-payment/route.js
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const body = await request.json();

    const { items } = body;

    const session = await stripe.checkout.sessions.create({
      line_items: items.map(item => ({
        price: item.priceId,
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      automatic_tax: {enabled: true},
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Payment link creation error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}