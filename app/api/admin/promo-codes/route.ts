import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// In-memory storage for demo purposes
// In production, you would use a database
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

export async function GET() {
  try {
    // Verify admin access
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(promoCodes);
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch promo codes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { code, discountPercentage } = body;

    // Validate input
    if (!code || !discountPercentage || discountPercentage < 1 || discountPercentage > 100) {
      return NextResponse.json(
        { message: "Invalid promo code data" },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingCode = promoCodes.find(pc => pc.code.toUpperCase() === code.toUpperCase());
    if (existingCode) {
      return NextResponse.json(
        { message: "Promo code already exists" },
        { status: 400 }
      );
    }

    // Create new promo code
    const newPromoCode = {
      id: (promoCodes.length + 1).toString(),
      code: code.toUpperCase(),
      discountPercentage,
      isActive: true,
      createdAt: new Date().toISOString(),
      usedCount: 0,
    };

    promoCodes.push(newPromoCode);

    return NextResponse.json(newPromoCode, { status: 201 });
  } catch (error) {
    console.error("Error creating promo code:", error);
    return NextResponse.json(
      { error: "Failed to create promo code" },
      { status: 500 }
    );
  }
}
