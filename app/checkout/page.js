// app/checkout/page.js
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {loadStripe} from '@stripe/stripe-js';
const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
  betas: ['custom_checkout_beta_5'],
});

import {CheckoutProvider, useCheckout, PaymentElement} from '@stripe/react-stripe-js';

export function CheckoutForm({cart, clearCart}) {
    const checkout = useCheckout();

    console.log(JSON.stringify(checkout));
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const toDollars = (amount) => {
        return (amount / 100).toFixed(2);
    }

    const getTaxAmount = () => {
        return toDollars(checkout.total.taxInclusive - checkout.total.taxExclusive);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError('');
    };

    const handleEmailBlur = async () => {
        if (!email || email.trim() === '') {
            return;
        }

        const result = await checkout.updateEmail(email)
        if (result.error) {
            setError(result.error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required');
            return;
        }

        setLoading(true);
        try {
            // Clear the cart from localStorage before confirming
            clearCart();

            const result = await checkout.confirm();
            if (result.type === 'error') {
                setError(result.error)
            }
        } catch (err) {
            setError(err.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                <CardTitle>Complete your purchase</CardTitle>
                <CardDescription>
                    Enter your details to complete the checkout process
                </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        className="w-full"
                    />
                    </div>

                    {/* Stripe Elements Container */}
                    <div className="space-y-2">
                    <Label>Payment details</Label>
                    <div
                        id="stripe-element-container"
                        className="p-4 border rounded-md bg-white"
                    >
                        <PaymentElement options={{layout: 'accordion'}}/>
                    </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    )}

                    {/* Order Summary */}
                    <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${toDollars(checkout.total.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                        <span>Tax</span>
                        <span>${getTaxAmount()}</span>
                    </div>
                    <div className="flex justify-between font-bold mt-4 text-lg">
                        <span>Total</span>
                        <span>${toDollars(checkout.total.total)}</span>
                    </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    >
                    {loading ? 'Processing...' : 'Pay now'}
                    </Button>
                </CardFooter>
                </form>
            </Card>
            </div>
        </div>
    );
};

export default function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [secret, setSecret] = useState('');

    useEffect(() => {
        // Only access localStorage after component mounts (client-side)
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);

        // get a checkout session
        const getCheckoutSession = async () => {
            const response = await fetch('/api/create_checkout_session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: savedCart,
                    ui_mode: 'custom',
                    tax_enabled: false,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setSecret(data.secret);
        };

        getCheckoutSession();
    }, []);

    const clearCart = () => {
        localStorage.removeItem('cart');
        setCart([]);
    }

    if (secret) {
        return (
          <CheckoutProvider
            stripe={stripe}
            options={{clientSecret: secret}}
          >
            <CheckoutForm cart={cart} clearCart={clearCart}/>
          </CheckoutProvider>
        );
    } else {
        return null;
    }
};