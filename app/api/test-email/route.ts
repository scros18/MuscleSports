import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Generate a test verification token
    const testToken = 'test-token-' + Date.now();
    
    // Send the test email
    const success = await sendVerificationEmail(email, name, testToken);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: `Test verification email sent to ${email}` 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

