import nodemailer from 'nodemailer';

// Email configuration - using your VPS SMTP server
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost', // Local SMTP server on VPS
  port: parseInt(process.env.SMTP_PORT || '25'), // Local SMTP port (25 for Postfix/sendmail)
  secure: false, // No TLS for localhost
  auth: process.env.SMTP_PASSWORD ? {
    user: process.env.SMTP_USER || 'noreply@musclesports.co.uk',
    pass: process.env.SMTP_PASSWORD,
  } : undefined, // No auth needed for localhost Postfix
  tls: {
    rejectUnauthorized: false // Accept self-signed certificates
  }
});

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💪 MuscleSports</h1>
          <p>Premium Sports Nutrition</p>
        </div>
        <div class="content">
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for registering at MuscleSports. We're excited to have you join our community!</p>
          <p>To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #10b981;">${verificationUrl}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <p>If you didn't create an account with MuscleSports, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 MuscleSports. All rights reserved.</p>
          <p>Premium Sports Nutrition | Your Premier Sports Nutrition Destination</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Welcome to MuscleSports, ${name}!

    Thank you for registering. To complete your registration and activate your account, please verify your email address by visiting:

    ${verificationUrl}

    This link will expire in 24 hours.

    If you didn't create an account with MuscleSports, you can safely ignore this email.

    ---
    MuscleSports - Premium Sports Nutrition
    © 2025 MuscleSports. All rights reserved.
  `;

  try {
    await transporter.sendMail({
      from: `"MuscleSports" <noreply@musclesports.co.uk>`,
      replyTo: 'support@musclesports.co.uk',
      to: email,
      subject: '✅ Verify your MuscleSports account',
      text: textContent,
      html: htmlContent,
    });
    console.log('Verification email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
        }
        .offer {
          background: #f0fdf4;
          border: 2px solid #10b981;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to MuscleSports!</h1>
        </div>
        <div class="content">
          <h2>Your account is now verified, ${name}!</h2>
          <p>Thank you for verifying your email. You now have full access to all MuscleSports features!</p>
          
          <div class="offer">
            <h3>🎁 EXCLUSIVE WELCOME OFFER</h3>
            <h2 style="color: #10b981; margin: 10px 0;">10% OFF YOUR FIRST ORDER</h2>
            <p style="margin: 10px 0;">Use code: <strong style="font-size: 18px; color: #059669;">WELCOME10</strong></p>
          </div>

          <p>Start shopping now and fuel your fitness journey with premium sports nutrition!</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" class="button">Start Shopping</a>
          </div>

          <h3>What's Next?</h3>
          <ul>
            <li>Browse our premium protein powders</li>
            <li>Check out pre-workout supplements</li>
            <li>Explore our vitamins and minerals</li>
            <li>Build your perfect supplement stack</li>
          </ul>
        </div>
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
          <p>&copy; 2025 MuscleSports. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"MuscleSports" <noreply@musclesports.co.uk>`,
      replyTo: 'support@musclesports.co.uk',
      to: email,
      subject: '🎉 Welcome to MuscleSports - Your Account is Verified!',
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

