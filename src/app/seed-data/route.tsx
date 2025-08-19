import { seedData } from "@/scripts/seed-tickers";
import { NextResponse } from "next/server";

// Notice the typo "asycn" is fixed to "async"
export async function GET() {
  return;
  try {
    const result = await seedData();
    
    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Seeding failed", error: result.message }, { status: 500 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message: "An unexpected error occurred", error: errorMessage }, { status: 500 });
  }
}