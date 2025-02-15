// app/components/PaymentStatusModal.js
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle } from 'lucide-react';

const PaymentStatusModalContent = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    const canceled = searchParams.get('canceled');

    if (session_id) {
      setStatus('success');
      setOpen(true);
    } else if (canceled) {
      setStatus('failed');
      setOpen(true);
    }
  }, [searchParams]);

  const getStatusContent = () => {
    if (status === 'success') {
      return {
        icon: <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />,
        title: "Payment Successful!",
        description: "Thank you for your purchase. You can now access your courses.",
        buttonText: "Continue to Courses"
      };
    }
    return {
      icon: <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />,
      title: "Payment Cancelled",
      description: "Your payment was not completed. Please try again or contact support if you need assistance.",
      buttonText: "Return to Cart"
    };
  };

  const content = getStatusContent();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          {content.icon}
          <AlertDialogTitle className="text-xl">
            {content.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {content.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => setOpen(false)}
            className="w-full"
          >
            {content.buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const PaymentStatusModal = () => {
  return (
    <Suspense fallback={null}>
      <PaymentStatusModalContent />
    </Suspense>
  );
};

export default PaymentStatusModal;