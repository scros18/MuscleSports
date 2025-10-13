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

export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete user's data (orders and shipping address) but keep account
    await Database.deleteUserData(user.userId);

    return NextResponse.json({ 
      success: true,
      message: "Your data has been deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting user data:", error);
    return NextResponse.json(
      { error: "Failed to delete user data" },
      { status: 500 }
    );
  }
}

