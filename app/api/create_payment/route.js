// app/api/create-payment/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { items } = body;

    const paymentLink = await stripe.paymentLinks.create({
      line_items: items.map(item => ({
        price: item.priceId,
        quantity: 1,
      })),
    });

    return NextResponse.json({ url: paymentLink.url });
  } catch (error) {
    console.error('Payment link creation error:', error);
    return NextResponse.json(
      { error: 'Error creating payment link' },
      { status: 500 }
    );
  }
}