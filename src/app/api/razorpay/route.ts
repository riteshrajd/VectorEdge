import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { randomBytes } from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { amount, currency = "INR" } = await request.json();

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (e.g., paise for INR)
      currency,
      receipt: `receipt_order_${randomBytes(4).toString("hex")}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}