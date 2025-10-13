import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Database } from "@/lib/database";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shippingAddress = await Database.getUserShippingAddress(user.userId);
    return NextResponse.json({ shippingAddress });
  } catch (error) {
    console.error("Error fetching shipping address:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipping address" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shippingAddress = await request.json();
    await Database.updateUserShippingAddress(user.userId, shippingAddress);

    return NextResponse.json({ 
      success: true,
      message: "Shipping address saved successfully" 
    });
  } catch (error) {
    console.error("Error saving shipping address:", error);
    return NextResponse.json(
      { error: "Failed to save shipping address" },
      { status: 500 }
    );
  }
}

