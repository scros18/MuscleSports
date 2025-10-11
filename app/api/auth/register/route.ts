import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Database } from '@/lib/database';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    console.log('Registration API called');
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await Database.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
    };

    await Database.createUser(user);
    console.log('User registered successfully:', email);

    // Get the created user from database to include created_at
    const createdUser = await Database.findUserByEmail(email);

    // Create JWT token
    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data (without password) and map created_at to createdAt
    const createdAtDate = createdUser.created_at;
    console.log('created_at raw:', createdAtDate, typeof createdAtDate);
    const createdAtISO = createdAtDate instanceof Date ? createdAtDate.toISOString() : new Date(createdAtDate).toISOString();
    console.log('createdAtISO:', createdAtISO);

    const userData = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      createdAt: createdAtISO
    };

    return NextResponse.json({
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}