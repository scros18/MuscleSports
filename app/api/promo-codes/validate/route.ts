import { NextRequest, NextResponse } from "next/server";

// Import the same storage from the admin route
// In production, you would use a shared database
let promoCodes = [
  {
    id: "1",
    code: "WELCOME10",
    discountPercentage: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
    usedCount: 0,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { message: "Promo code is required" },
        { status: 400 }
      );
    }

    // Find the promo code
    const promoCode = promoCodes.find(
      pc => pc.code.toUpperCase() === code.toUpperCase() && pc.isActive
    );

    if (!promoCode) {
      return NextResponse.json(
        { message: "Invalid or inactive promo code" },
        { status: 404 }
      );
    }

    // Return the valid promo code (without sensitive info)
    return NextResponse.json({
      code: promoCode.code,
      discountPercentage: promoCode.discountPercentage,
    });
  } catch (error) {
    console.error("Error validating promo code:", error);
    return NextResponse.json(
      { error: "Failed to validate promo code" },
      { status: 500 }
    );
  }
}
