// app/page.js
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Mock data for expert classes
const expertClasses = [
  {
    id: 1,
    title: "Time Travel & DeLorean Maintenance",
    instructor: "Dr. Emmett Brown, Temporal Physicist",
    price: 399.99,
    duration: "116 minutes",
    level: "Advanced",
    category: "Science",
    description: "A comprehensive study of temporal physics and classic car maintenance featuring the DeLorean DMC-12.",
    image: "/Back_To_The_Future.jpg"
  },
  {
    id: 2,
    title: "Mean Girls Leadership Academy",
    instructor: "Regina George, Queen Bee Emeritus",
    price: 299.99,
    duration: "97 minutes",
    level: "Intermediate",
    category: "Social Dynamics",
    description: "A tactical exploration of high school social hierarchies and power dynamics.",
    image: "/Mean_Girls.jpg"
  },
  {
    id: 3,
    title: "Satellite Systems & Cyber Defense",
    instructor: "David Levinson, Cable Repair Specialist",
    price: 149.99,
    duration: "145 minutes",
    level: "Advanced",
    category: "Technology",
    description: "A comprehensive course on satellite communications and innovative approaches to network security.",
    image: "/Independence_Day.jpg"
  },
  {
    id: 4,
    title: "Creative Problem Solving",
    instructor: "Kevin McCallister, Home Defense Specialist",
    price: 249.99,
    duration: "103 minutes",
    level: "Beginner",
    category: "Security",
    description: "An introduction to improvised home security techniques using household items.",
    image: "/Home_Alone.jpg"
  },
  {
    id: 5,
    title: "Corporate Theft Prevention",
    instructor: "Danny Ocean, Security Consultant",
    price: 511.99,
    duration: "116 minutes",
    level: "Advanced",
    category: "Business",
    description: "A detailed analysis of high-stakes casino security protocols and risk assessment.",
    image: "/Oceans_Eleven.jpg"
  },
  {
    id: 6,
    title: "Fashion & Florals for Spring",
    instructor: "Miranda Priestly, Editor-in-Chief",
    price: 299.99,
    duration: "109 minutes",
    level: "Intermediate",
    category: "Fashion",
    description: "An essential overview of fashion industry standards and contemporary color theory.",
    image: "/The_Devil_Wears_Prada.jpg"
  }
];

export default function HomePage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Only access localStorage after component mounts (client-side)
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const addToCart = (course) => {
    // Create a unique instance of the course with a timestamp
    const courseWithTimestamp = {
      ...course,
      cartId: `${course.id}-${Date.now()}`  // Using a timestamp to make each cart item unique
    };
    const newCart = [...cart, courseWithTimestamp];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const getTotalItems = () => cart.length;
  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Cart */}
      <div className="bg-white shadow">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">ExpertHub: Hollywood's Finest</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm">
                Cart: {getTotalItems()} courses (${getTotalPrice()})
              </span>
              <Button
                disabled={cart.length === 0}
                onClick={() => router.push('/cart')}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertClasses.map((course) => (
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
  )
}