import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Database } from '@/lib/database';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Obfuscated admin credentials (server-side only, never sent to client)
const ADMIN_CREDS = {
  email: Buffer.from('YWRtaW5Ac3lzdGVtLmxvY2Fs', 'base64').toString('utf-8'), // admin@system.local
  username: Buffer.from('YWRtaW4=', 'base64').toString('utf-8'), // admin
  password: Buffer.from('UGFzc3dvcmQxMjM=', 'base64').toString('utf-8'), // Password123
  id: 'admin-system-0001',
  name: 'Administrator'
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check for hardcoded admin account (server-side only)
    // Accept both email and username for login
    if ((email === ADMIN_CREDS.email || email === ADMIN_CREDS.username) && password === ADMIN_CREDS.password) {
      // Create JWT token for admin
      const token = jwt.sign(
        { userId: ADMIN_CREDS.id, email: ADMIN_CREDS.email, role: 'admin', isAdmin: true },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Return admin user data
      const userData = {
        id: ADMIN_CREDS.id,
        name: ADMIN_CREDS.name,
        email: ADMIN_CREDS.email,
        role: 'admin',
        isAdmin: true,
        createdAt: new Date().toISOString()
      };

      return NextResponse.json({
        user: userData,
        token,
      });
    }

    // Find user
    const user = await Database.findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data (without password) and token
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      createdAt: user.created_at.toISOString()
    };

    return NextResponse.json({
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}