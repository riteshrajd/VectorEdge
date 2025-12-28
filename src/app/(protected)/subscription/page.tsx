"use client";

import { JSX, useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { 
  Check, 
  Crown, 
  Star, 
  Shield, 
  Zap, 
  Mail, 
  Headphones,
  Sparkles,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useInitializeUser } from "@/app/hooks/useInitializeUser";
import { RazorpayInstance, RazorpayOptions, RazorpayPaymentFailureResponse, RazorpayPaymentSuccessResponse } from "@/types/types";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function Subscription(): JSX.Element {
  useInitializeUser();
  const { user } = useUserStore();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "yearly" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const processPayment = async (plan: "monthly" | "yearly", amount: number) => {
    if (useUserStore.getState().user?.is_paid_member) return;
    if (isProcessing) return; 

    setIsProcessing(true);
    setLoadingPlan(plan);

    try {
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "INR" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create Razorpay order");
      }

      const order = await response.json();

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "VectorEdge",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`,
        order_id: order.id,
        handler: async function (response: RazorpayPaymentSuccessResponse) {
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
              setTimeout(() => {
                router.push('/');
              }, 2000);
            } else {
              throw new Error(result.error || 'Payment verification failed.');
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            alert(`Payment verification failed: ${errorMessage}`);
            setIsProcessing(false);
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
          color: "#6366f1",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            setLoadingPlan(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response: RazorpayPaymentFailureResponse) {
        console.error("Payment failed:", response.error);
        alert(`Payment Failed: ${response.error.description}`);
        setIsProcessing(false);
        setLoadingPlan(null);
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("There was an error processing your payment. Please try again.");
      setIsProcessing(false);
      setLoadingPlan(null);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center transition-colors duration-300">
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-12 rounded-2xl shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {loadingPlan === "monthly" ? "Processing Monthly Plan..." : "Processing Yearly Plan..."}
            </h2>
            <p className="text-gray-500 dark:text-neutral-400">
              Please wait while we secure your subscription
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/5 bg-white/70 dark:bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/20 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-600 dark:text-neutral-300 hover:text-black dark:hover:text-white"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/60 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium mb-4 backdrop-blur-md">
            <Sparkles size={12} />
            Unlock Premium Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight text-gray-900 dark:text-white">
            Supercharge Your <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 bg-clip-text text-transparent">Trading Experience</span>
          </h2>
          <p className="text-base text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Join thousands of traders trusting VectorEdge for advanced insights.
          </p>
        </div>

        {/* Pricing Cards Container */}
        {/* Removed 'items-start' to allow grid to stretch items to equal height */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Monthly Plan */}
          <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 group flex flex-col h-full">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Monthly Plan</h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">Perfect for getting started</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Star className="w-5 h-5 text-gray-700 dark:text-white" />
                </div>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">₹1299</span>
              <span className="text-gray-500 dark:text-neutral-400 text-sm"> /month</span>
            </div>

            <div className="flex-grow">
                <ul className="grid grid-cols-1 gap-y-3 mb-6 text-sm">
                {[
                    { icon: Check, text: "Access to basic features" },
                    { icon: Zap, text: "Monthly market updates" },
                    { icon: Mail, text: "Email support" },
                    { icon: Shield, text: "Secure trading environment" }
                ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <feature.icon size={10} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-neutral-300">{feature.text}</span>
                    </li>
                ))}
                </ul>
            </div>

            <button
              onClick={() => processPayment("monthly", 1299)}
              disabled={isProcessing || user?.is_paid_member}
              className="w-full mt-auto bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-white/10"
            > 
              {user?.is_paid_member ? "Already Subscribed" : "Get Monthly Plan"}
            </button>
          </div>

          {/* Yearly Plan - Removed translate-y so it aligns perfectly */}
          <div className="relative 
            bg-white dark:bg-white/5 backdrop-blur-xl
            bg-gradient-to-b from-indigo-50/40 to-white 
            dark:bg-gradient-to-b dark:from-indigo-950/30 dark:to-neutral-900/40 
            backdrop-blur-xl border-2 border-primary/50 dark:border-primary/50 
            rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 
            group flex flex-col h-full"
          >
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-white dark:bg-neutral-900 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-blue-500/20">
                <Crown size={12} />
                Most Popular
              </div>
            </div>

            <div className="flex items-start justify-between mb-6 mt-2">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Yearly Plan</h3>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500 dark:text-neutral-400">Best value for pros</p>
                        <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            SAVE 36%
                        </span>
                    </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                </div>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">₹9999</span>
              <span className="text-gray-500 dark:text-neutral-400 text-sm"> /year</span>
            </div>

            <div className="flex-grow">
                {/* 2-Column Grid */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mb-6 text-sm">
                {[
                    { icon: Check, text: "All premium features" },
                    { icon: Zap, text: "Real-time insights" },
                    { icon: Headphones, text: "Priority support" },
                    { icon: Crown, text: "Beta access" },
                    { icon: Shield, text: "Advanced security" },
                    { icon: Star, text: "Exclusive reports" }
                ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                        <feature.icon size={10} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-neutral-200 text-xs sm:text-sm">{feature.text}</span>
                    </li>
                ))}
                </ul>
            </div>

            <button
              onClick={() => processPayment("yearly", 9999)}
              disabled={isProcessing || user?.is_paid_member}
              className="w-full mt-auto bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
            >
              {user?.is_paid_member ? "Already Subscribed" : "Get Yearly Plan"}
            </button>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="text-center mt-12 border-t border-gray-200 dark:border-white/5 pt-6 max-w-2xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-gray-500 dark:text-neutral-500 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-green-500" />
              <span>Secure Payment</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 dark:bg-white/20 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Check size={14} className="text-blue-500" />
              <span>Cancel Anytime</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 dark:bg-white/20 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Headphones size={14} className="text-purple-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}