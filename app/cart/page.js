// app/cart/page.js
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"

function CartPageContent() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const checkoutType = searchParams.get('checkout_type') || 'checkout';

  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Only access localStorage after component mounts (client-side)
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const handleCancel = () => {
    localStorage.removeItem('cart');
    setCart([]);
    router.push('/');
  };

  const handlePay = async () => {
    try {
      if (checkoutType === 'elements') {
        router.push('/checkout');
        return;
      }

      // Define the endpoint based on checkout type
      const endpoint = checkoutType === 'payment_link'
        ? '/api/create_payment_link'
        : '/api/create_checkout_session';

      // Set ui_mode based on checkout type
      const ui_mode = checkoutType === 'embedded' 
        ? 'embedded' 
        : (checkoutType === 'elements' ? 'elements' : 'hosted');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          ui_mode: ui_mode,
          tax_enabled: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // For embedded checkout, redirect to embedded checkout page
      if (ui_mode === 'embedded' && data.clientSecret) {
        // Store client secret in session storage for embedded checkout
        sessionStorage.setItem('checkoutClientSecret', data.clientSecret);
        localStorage.removeItem('cart');
        setCart([]);
        router.push('/embedded-checkout');
        return;
      }
      
      // For hosted checkout, redirect to Stripe
      if (data.url) {
        localStorage.removeItem('cart');
        setCart([]);
        // Redirect to Stripe's payment page
        window.location.href = data.url;
      } else {
        throw new Error('No payment URL or client secret received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('There was a problem processing your payment. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p>Your cart is empty</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Return to Courses
        </Button>
      </div>
    );
  }

  return (
    <Suspense>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <Card key={item.cartId}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-600">Instructor: {item.instructor}</p>
                </div>
                <div className="font-bold">
                  ${item.price}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold">${getTotalPrice()}</span>
        </div>

        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePay}
            className="w-full"
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
    </Suspense>
  )
}

export default function CartPage() {
  return (
    <Suspense>
      <CartPageContent />
    </Suspense>
  )
}