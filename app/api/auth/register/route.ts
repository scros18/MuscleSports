import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Database } from '@/lib/database';
import { sendVerificationEmail } from '@/lib/email';

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
    const userId = Date.now().toString();
    const user = {
      id: userId,
      name,
      email,
      password: hashedPassword,
    };

    await Database.createUser(user);
    console.log('User registered successfully:', email);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Save verification token to database
    await Database.updateUserVerificationToken(userId, verificationToken, tokenExpires);

    // Send verification email
    try {
      await sendVerificationEmail(email, name, verificationToken);
      console.log('Verification email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    // Return success message (no auto-login until verified)
    return NextResponse.json({
      message: 'Registration successful! Please check your email to verify your account.',
      email: email,
      requiresVerification: true
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}