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

declare global {
  interface Window {
    Razorpay: any;
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
    if (isProcessing) return; // Prevent multiple clicks

    setIsProcessing(true);
    setLoadingPlan(plan);

    try {
      // 1. Create an order from our backend
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, currency: "INR" }),
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
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`,
        order_id: order.id,
        handler: async function (response: any) {
          console.log("Payment successful, now verifying...", response);
          
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
              // Show success state briefly before redirect
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
            // Reset loading states if user cancels payment
            setIsProcessing(false);
            setLoadingPlan(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response: any) {
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              {loadingPlan === "monthly" ? "Processing Monthly Plan..." : "Processing Yearly Plan..."}
            </h2>
            <p className="text-muted-foreground">
              Please wait while we set up your subscription
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Choose Your Plan
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} />
            Unlock Premium Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Supercharge Your 
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Trading Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of traders who trust VectorEdge for advanced market insights and professional-grade tools.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="relative bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Monthly Plan</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-4xl font-bold text-primary">₹1299</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground">Perfect for getting started</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                { icon: Check, text: "Access to basic features" },
                { icon: Zap, text: "Monthly market updates" },
                { icon: Mail, text: "Email support" },
                { icon: Shield, text: "Secure trading environment" }
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon size={12} className="text-primary" />
                  </div>
                  <span className="text-foreground">{feature.text}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => processPayment("yearly", 2)}
              disabled={isProcessing || user?.is_paid_member}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg"
            > 
              {user?.is_paid_member ? "Already Subscribed" : "Get Monthly Plan"}
            </button>
          </div>

          {/* Yearly Plan - Popular */}
          <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Crown size={16} />
                Most Popular
              </div>
            </div>

            <div className="text-center mb-8 mt-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Yearly Plan</h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-primary">₹9999</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium mb-2">
                <Sparkles size={14} />
                Save 36%
              </div>
              <p className="text-muted-foreground">Best value for serious traders</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                { icon: Check, text: "Access to all premium features" },
                { icon: Zap, text: "Real-time market insights" },
                { icon: Headphones, text: "Priority support" },
                { icon: Crown, text: "Beta feature access" },
                { icon: Shield, text: "Advanced security features" },
                { icon: Star, text: "Exclusive market reports" }
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon size={12} className="text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => processPayment("yearly", 2)}
              disabled={isProcessing || user?.is_paid_member}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg"
            >
              {user?.is_paid_member ? "Already Subscribed" : "Get Yearly Plan"}
            </button>
          </div>
        </div>

        {/* Trust Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>Secure Payment</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <div className="flex items-center gap-2">
              <Check size={16} />
              <span>Cancel Anytime</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <div className="flex items-center gap-2">
              <Headphones size={16} />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}