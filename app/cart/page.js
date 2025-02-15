// app/cart/page.js
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function CartPage() {
  const router = useRouter();
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

  const handlePay = () => {
    alert('Payment processing would happen here');
    localStorage.removeItem('cart');
    setCart([]);
    router.push('/');
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
  )
}