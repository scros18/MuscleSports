import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { sendWelcomeEmail } from '@/lib/email';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const user = await Database.findUserByVerificationToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json(
        { message: 'Email already verified', alreadyVerified: true },
        { status: 200 }
      );
    }

    // Mark email as verified
    await Database.verifyUserEmail(user.id);

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    // Create JWT token for auto-login
    const authToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role || 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      createdAt: user.created_at?.toISOString(),
    };

    return NextResponse.json({
      message: 'Email verified successfully',
      user: userData,
      token: authToken,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}

