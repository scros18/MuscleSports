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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: #f9fafb;
        }
        .email-wrapper {
          background: #f9fafb;
          padding: 40px 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 60px 40px 80px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          bottom: -50px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
        .header::after {
          content: '';
          position: absolute;
          top: -100px;
          right: -150px;
          width: 500px;
          height: 500px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 50%;
        }
        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60px;
          background: white;
          clip-path: ellipse(60% 60px at 50% 100%);
        }
        .logo-container {
          position: relative;
          z-index: 10;
          margin-bottom: 20px;
        }
        .logo {
          max-width: 200px;
          height: auto;
          display: block;
          margin: 0 auto;
          background: white;
          padding: 25px 35px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .tagline {
          position: relative;
          z-index: 10;
          color: white;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.5px;
          margin-top: 20px;
          opacity: 0.95;
        }
        .content {
          padding: 50px 40px;
          background: white;
        }
        h2 {
          color: #111827;
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 20px;
          letter-spacing: -0.5px;
        }
        p {
          color: #4b5563;
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .button-container {
          text-align: center;
          margin: 35px 0;
        }
        .button {
          display: inline-block;
          padding: 16px 40px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: transform 0.2s;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .link-box {
          background: #f3f4f6;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #10b981;
          margin: 20px 0;
        }
        .link-text {
          word-break: break-all;
          color: #059669;
          font-size: 14px;
          font-family: 'Courier New', monospace;
        }
        .highlight {
          background: #d1fae5;
          padding: 2px 8px;
          border-radius: 4px;
          color: #065f46;
          font-weight: 600;
        }
        .footer {
          background: #f9fafb;
          text-align: center;
          padding: 30px 40px;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <div class="logo-container">
              <img src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://musclesports.co.uk'}/email-logo.png" alt="MuscleSports" class="logo" />
            </div>
            <p class="tagline">Premium Sports Nutrition</p>
            <div class="wave"></div>
          </div>
          <div class="content">
            <h2>Welcome, ${name}!</h2>
            <p>Thank you for registering at <strong>MuscleSports</strong>. We're excited to have you join our community of athletes and fitness enthusiasts!</p>
            <p>To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
            <div class="button-container">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p style="color: #9ca3af; font-size: 14px; text-align: center;">Or copy and paste this link into your browser:</p>
            <div class="link-box">
              <p class="link-text">${verificationUrl}</p>
            </div>
            <p style="text-align: center;"><span class="highlight">This link will expire in 24 hours</span></p>
            <p style="margin-top: 30px; color: #9ca3af; font-size: 14px;">If you didn't create an account with MuscleSports, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p><strong>&copy; 2025 MuscleSports</strong> · All rights reserved</p>
            <p>Your Premier Sports Nutrition Destination</p>
          </div>
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
      subject: 'Verify your MuscleSports account',
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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: #f9fafb;
        }
        .email-wrapper {
          background: #f9fafb;
          padding: 40px 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 60px 40px 80px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          bottom: -50px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
        .header::after {
          content: '';
          position: absolute;
          top: -100px;
          right: -150px;
          width: 500px;
          height: 500px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 50%;
        }
        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60px;
          background: white;
          clip-path: ellipse(60% 60px at 50% 100%);
        }
        .logo-container {
          position: relative;
          z-index: 10;
          margin-bottom: 20px;
        }
        .logo {
          max-width: 200px;
          height: auto;
          display: block;
          margin: 0 auto;
          background: white;
          padding: 25px 35px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .header-title {
          position: relative;
          z-index: 10;
          color: white;
          font-size: 28px;
          font-weight: 700;
          margin-top: 25px;
          letter-spacing: -0.5px;
        }
        .content {
          padding: 50px 40px;
          background: white;
        }
        h2 {
          color: #111827;
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 20px;
          letter-spacing: -0.5px;
        }
        h3 {
          color: #111827;
          font-size: 20px;
          font-weight: 600;
          margin: 30px 0 15px 0;
        }
        p {
          color: #4b5563;
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .offer {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border: 3px solid #10b981;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
        }
        .offer h3 {
          color: #065f46;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 10px 0;
        }
        .offer-discount {
          color: #059669;
          font-size: 32px;
          font-weight: 800;
          margin: 10px 0;
          letter-spacing: -1px;
        }
        .promo-code {
          display: inline-block;
          background: white;
          color: #059669;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 2px;
          margin: 10px 0;
          border: 2px dashed #10b981;
        }
        .button-container {
          text-align: center;
          margin: 35px 0;
        }
        .button {
          display: inline-block;
          padding: 16px 40px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          color: #4b5563;
          font-size: 16px;
          padding: 12px 0 12px 32px;
          position: relative;
        }
        li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
          font-size: 18px;
        }
        .footer {
          background: #f9fafb;
          text-align: center;
          padding: 30px 40px;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <div class="logo-container">
              <img src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://musclesports.co.uk'}/email-logo.png" alt="MuscleSports" class="logo" />
            </div>
            <h1 class="header-title">Welcome to MuscleSports!</h1>
            <div class="wave"></div>
          </div>
          <div class="content">
            <h2>Your account is verified, ${name}!</h2>
            <p>Thank you for verifying your email. You now have full access to all MuscleSports features and can start building your perfect supplement stack!</p>
            
            <div class="offer">
              <h3>Exclusive Welcome Offer</h3>
              <div class="offer-discount">10% OFF</div>
              <p style="color: #065f46; margin: 10px 0;">YOUR FIRST ORDER</p>
              <div class="promo-code">WELCOME10</div>
            </div>

            <p>Start shopping now and fuel your fitness journey with premium sports nutrition backed by science and trusted by athletes worldwide.</p>
            
            <div class="button-container">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" class="button">Start Shopping</a>
            </div>

            <h3>What's Next?</h3>
            <ul>
              <li>Browse our premium protein powders and mass gainers</li>
              <li>Check out high-performance pre-workout supplements</li>
              <li>Explore essential vitamins, minerals, and recovery aids</li>
              <li>Build your perfect supplement stack with expert guidance</li>
            </ul>
          </div>
          <div class="footer">
            <p><strong>&copy; 2025 MuscleSports</strong> · All rights reserved</p>
            <p>Your Premier Sports Nutrition Destination</p>
          </div>
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
      subject: 'Welcome to MuscleSports - Your Account is Verified!',
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

