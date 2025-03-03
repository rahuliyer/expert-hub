"use client"
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import EmbeddedCheckoutComponent from "@/components/EmbeddedCheckout";
import { Button } from "@/components/ui/button";

function EmbeddedCheckoutContent() {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // Get the client secret from session storage
    const secret = sessionStorage.getItem("checkoutClientSecret");
    if (secret) {
      setClientSecret(secret);
    } else {
      // If no client secret found, redirect back to cart
      router.push("/cart");
    }
  }, [router]);

  const handleCancel = () => {
    // Clear session storage and redirect to home
    sessionStorage.removeItem("checkoutClientSecret");
    router.push("/");
  };

  return (
    <div className="container mx-auto">
      <div className="py-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel Checkout
        </Button>
      </div>
      {clientSecret ? (
        <EmbeddedCheckoutComponent clientSecret={clientSecret} />
      ) : (
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Loading checkout...</p>
        </div>
      )}
    </div>
  );
}

export default function EmbeddedCheckoutPage() {
  return (
    <Suspense>
      <EmbeddedCheckoutContent />
    </Suspense>
  );
}