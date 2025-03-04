// app/api/create-payment/route.js
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import Stripe from 'stripe';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2019-10-17; custom_checkout_beta=v1;',
});

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const body = await request.json();

    const { items, ui_mode, tax_enabled } = body;

    if (ui_mode === 'hosted' || ui_mode == null) {
        // Hosted checkout
        const session = await stripe.checkout.sessions.create({
        line_items: items.map(item => ({
            price: item.priceId,
            quantity: 1,
        })),
        mode: 'payment',
        ui_mode: 'hosted',
        success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?canceled=true`,
        automatic_tax: {enabled: tax_enabled === true},
        });

        return NextResponse.json({
            url: session.url,
        });
    } else if (ui_mode === 'embedded') {
        // Embedded checkout
        const session = await stripe.checkout.sessions.create({
            line_items: items.map(item => ({
                price: item.priceId,
                quantity: 1,
            })),
            mode: 'payment',
            ui_mode: 'embedded',
            return_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
            automatic_tax: {enabled: tax_enabled === true},
        });

        return NextResponse.json({
            clientSecret: session.client_secret,
            url: session.url,
        });
    } else {
        // Elements checkout
        const session = await stripe.checkout.sessions.create({
            line_items: items.map(item => ({
                price: item.priceId,
                quantity: 1,
            })),
            mode: 'payment',
            ui_mode: 'custom',
            adaptive_pricing: {
                enabled: true,
            },
            return_url: `${origin}/`,
        });

        return NextResponse.json({
            secret: session.client_secret,
        });
    }
  } catch (error) {
    console.error('Payment link creation error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}