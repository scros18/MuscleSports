import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Import the same storage from the main route
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    const promoCodeIndex = promoCodes.findIndex(pc => pc.id === id);
    if (promoCodeIndex === -1) {
      return NextResponse.json(
        { message: "Promo code not found" },
        { status: 404 }
      );
    }

    // Update the promo code
    promoCodes[promoCodeIndex] = {
      ...promoCodes[promoCodeIndex],
      ...body,
    };

    return NextResponse.json(promoCodes[promoCodeIndex]);
  } catch (error) {
    console.error("Error updating promo code:", error);
    return NextResponse.json(
      { error: "Failed to update promo code" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const promoCodeIndex = promoCodes.findIndex(pc => pc.id === id);
    if (promoCodeIndex === -1) {
      return NextResponse.json(
        { message: "Promo code not found" },
        { status: 404 }
      );
    }

    // Remove the promo code
    promoCodes.splice(promoCodeIndex, 1);

    return NextResponse.json({ message: "Promo code deleted successfully" });
  } catch (error) {
    console.error("Error deleting promo code:", error);
    return NextResponse.json(
      { error: "Failed to delete promo code" },
      { status: 500 }
    );
  }
}
