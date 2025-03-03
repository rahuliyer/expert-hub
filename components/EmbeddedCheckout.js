"use client"
import { useEffect, useState } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Alert, AlertDescription } from "@/components/ui/alert";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function EmbeddedCheckoutComponent({ clientSecret }) {
  const [error, setError] = useState(null);
  
  const handleOnChange = async (event) => {
    if (event.type === 'error') {
      setError(event.payload.error.message);
    }
  };

  if (!clientSecret) {
    return <div>Loading checkout...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout onChange={handleOnChange} />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
}