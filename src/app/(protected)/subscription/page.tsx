"use client";

import { JSX, useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Subscription(): JSX.Element {
  const { user } = useUserStore();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "yearly" | null>(
    null
  );

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const processPayment = async (plan: "monthly" | "yearly", amount: number) => {
    if (loadingPlan) return; // Prevent multiple clicks
    setLoadingPlan(plan);

    try {
      // 1. Create an order from our backend
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, currency: "INR" }), // Razorpay expects amount in smallest currency unit
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create Razorpay order");
      }

      const order = await response.json();

      // 2. Open Razorpay Checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "VectorEdge",
        description: `${
          plan.charAt(0).toUpperCase() + plan.slice(1)
        } Subscription`,
        order_id: order.id,
        handler: async function (response: any) {
          console.log("Payment successful, now verifying...", response);
          setLoadingPlan(plan); // Keep showing loading state during verification

          try {
            const verificationResponse = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan,
                userId: user?.id,
              }),
            });

            const result = await verificationResponse.json();

            if (result.success) {
              alert('Payment Verified! Your subscription is now active. Redirecting...');
              router.push('/'); // Redirect to the home page
            } else {
              throw new Error(result.error || 'Payment verification failed.');
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            alert(`Payment verification failed: ${errorMessage}`);
          } finally {
            setLoadingPlan(null);
          }
        },
        prefill: {
          name: user?.full_name || "Valued Customer",
          email: user?.email,
        },
        notes: {
          plan: plan,
          userId: user?.id,
        },
        theme: {
          color: "#3b82f6", // A nice blue color for the modal
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        alert(`Payment Failed: ${response.error.description}`);
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("There was an error processing your payment. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-main)] p-4">
      <h1 className="text-4xl font-bold text-[var(--text-color)] mb-8">Choose Your Plan</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Monthly Subscription Card */}
        <div
          className="bg-slate-100 dark:bg-slate-800 rounded-lg shadow-lg p-8 w-80 text-center cursor-pointer transform transition-transform duration-300 hover:scale-105"
          onClick={() => processPayment("monthly", 1)} // Amount in INR (e.g., ₹1)
        >
          <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4">Monthly Plan</h2>
          <p className="text-5xl font-bold text-[var(--accent-color)] mb-4">₹1</p>
          <p className="text-[var(--text-color-light)] mb-6">per month</p>
          <ul className="text-[var(--text-color)] text-left mb-8 space-y-2">
            <li>✓ Access to basic features</li>
            <li>✓ Monthly updates</li>
            <li>✓ Email support</li>
          </ul>
          <button
            className="bg-[var(--accent-color)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--accent-color-dark)] transition-colors duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loadingPlan === "monthly"}
          >
            {loadingPlan === "monthly" ? "Processing..." : "Select Monthly"}
          </button>
        </div>

        {/* Yearly Subscription Card */}
        <div
          className="bg-slate-100 dark:bg-slate-800 rounded-lg shadow-lg p-8 w-80 text-center cursor-pointer transform transition-transform duration-300 hover:scale-105 border-2 border-[var(--accent-color)] relative"
          onClick={() => processPayment("yearly", 2)} // Amount in INR (e.g., ₹2)
        >
          <div className="absolute top-0 right-0 bg-[var(--accent-color)] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
            Save 36%
          </div>
          <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4">Yearly Plan</h2>
          <p className="text-5xl font-bold text-[var(--accent-color)] mb-4">₹2</p>
          <p className="text-[var(--text-color-light)] mb-6">per year</p>
          <ul className="text-[var(--text-color)] text-left mb-8 space-y-2">
            <li>✓ Access to all features</li>
            <li>✓ Continuous updates</li>
            <li>✓ Priority email support</li>
            <li>✓ Access to beta features</li>
          </ul>
          <button
            className="bg-[var(--accent-color)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--accent-color-dark)] transition-colors duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loadingPlan === "yearly"}
          >
            {loadingPlan === "yearly" ? "Processing..." : "Select Yearly"}
          </button>
        </div>
      </div>
    </div>
  );
}