// app/components/ClientPage.js
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import PaymentStatusModal from './PaymentStatusModal';

function ClientPageContent({ initialProducts }) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const checkoutType = searchParams.get('checkout_type') || 'checkout';
  
  // Available checkout types
  const checkoutTypes = [
    { id: 'checkout', name: 'Standard Checkout' },
    { id: 'elements', name: 'Elements Checkout' },
    { id: 'embedded', name: 'Embedded Checkout' },
    { id: 'payment_link', name: 'Payment Link' }
  ];

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const addToCart = (course) => {
    const courseWithTimestamp = {
      ...course,
      cartId: `${course.id}-${Date.now()}`
    };
    const newCart = [...cart, courseWithTimestamp];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const getTotalItems = () => cart.length;
  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  return (
    <>
        <PaymentStatusModal />
        <div className="min-h-screen bg-gray-50">
        {/* Header with Cart */}
        <div className="bg-white shadow">
            <div className="container mx-auto p-4">
              <div className="flex justify-between items-center flex-col md:flex-row gap-4">
                <h1 className="text-2xl font-bold text-gray-800">ExpertHub: Learn from the Best in the Business!</h1>
                <div className="flex items-center gap-4 flex-wrap justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Checkout Type:</span>
                    <select 
                      className="p-2 border rounded text-sm"
                      value={checkoutType}
                      onChange={(e) => router.push(`/?checkout_type=${e.target.value}`)}
                    >
                      {checkoutTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      Cart: {getTotalItems()} courses (${getTotalPrice()})
                    </span>
                    <Button
                      disabled={cart.length === 0}
                      onClick={() => router.push(`/cart?checkout_type=${checkoutType}`)}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialProducts.map((course) => (
                <Card key={course.id} className="flex flex-col">
                <CardHeader className="p-0">
                    <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    />
                </CardHeader>
                <CardContent className="flex-1 p-4">
                    <CardTitle className="mb-2">{course.title}</CardTitle>
                    <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{course.instructor}</p>
                    <p>Duration: {course.duration}</p>
                    <p>Level: {course.level}</p>
                    <p>Category: {course.category}</p>
                    <p className="text-sm mt-2">{course.description}</p>
                    <p className="text-lg font-bold text-gray-900">${course.price}</p>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <Button
                    className="w-full"
                    onClick={() => addToCart(course)}
                    >
                    Add to Cart
                    </Button>
                </CardFooter>
                </Card>
            ))}
            </div>
        </div>
        </div>
    </>
  )
}

export default function ClientPage({ initialProducts }) {
  return (
    <Suspense>
      <ClientPageContent initialProducts={initialProducts} />
    </Suspense>
  )
}