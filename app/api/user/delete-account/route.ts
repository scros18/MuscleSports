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

    // Prevent admin from deleting their own account via this endpoint
    if (user.role === 'admin' || user.isAdmin) {
      return NextResponse.json(
        { error: "Admin accounts cannot be deleted through this method" },
        { status: 403 }
      );
    }

    // Delete user account (will cascade delete orders due to foreign key)
    await Database.deleteUser(user.userId);

    return NextResponse.json({ 
      success: true,
      message: "Your account has been permanently deleted" 
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}

