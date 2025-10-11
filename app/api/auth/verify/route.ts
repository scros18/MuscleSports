import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Database } from "@/lib/database";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Find user
    const user = await Database.findUserById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Return user data (without password) and map created_at to createdAt
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at.toISOString()
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}