# PayPal Checkout Integration Guide

## Overview

Your MuscleSports checkout is now integrated with PayPal as the primary payment method. This guide will help you set up and test the PayPal integration.

## What's Been Implemented

✅ **PayPal-Only Checkout Flow**
- Simplified payment step with PayPal as the sole payment option
- Professional PayPal checkout UI with buyer protection messaging
- Secure order processing through PayPal API

✅ **Backend Integration**
- `/api/paypal/create-order` - Creates PayPal order and returns approval URL
- `/api/paypal/capture-order` - Captures payment after customer approval
- Database schema updated with `payment_method`, `payment_id`, and `paid` status

✅ **Success/Error Handling**
- Dedicated success page at `/checkout/success`
- Automatic order confirmation
- Cart clearing after successful payment
- Error handling with retry options

## Setup Instructions

### 1. Get PayPal API Credentials

#### For Testing (Sandbox):
1. Go to https://developer.paypal.com/
2. Log in with your PayPal account
3. Navigate to **Dashboard** → **Apps & Credentials**
4. Under **Sandbox**, click **Create App**
5. Name your app (e.g., "MuscleSports Checkout")
6. Copy the **Client ID** and **Secret**

#### For Production:
1. Same steps as above
2. Switch to the **Live** tab instead of Sandbox
3. Copy the Live credentials (only use these when going live!)

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ordify_db
DB_PORT=3306

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this

# PayPal Sandbox (for testing)
PAYPAL_CLIENT_ID=your-sandbox-client-id-here
PAYPAL_CLIENT_SECRET=your-sandbox-secret-here
PAYPAL_API_URL=https://api-m.sandbox.paypal.com

# Site URL (used for PayPal return URLs)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important:** Never commit `.env.local` to Git!

### 3. Update Database Schema

Run this to add the new payment fields to your orders table:

```bash
npm run db:migrate
```

Or manually run this SQL:

```sql
ALTER TABLE orders 
ADD COLUMN payment_method VARCHAR(50),
ADD COLUMN payment_id VARCHAR(255),
MODIFY COLUMN status ENUM('pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending';
```

### 4. Test the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Add items to cart** and proceed to checkout

3. **Complete checkout steps:**
   - Account/Login
   - Shipping information
   - Payment (PayPal only)
   - Review order

4. **Click "Place Order"** - You'll be redirected to PayPal

5. **Log in with Sandbox Account:**
   - Go to https://developer.paypal.com/dashboard/accounts
   - Use one of the sandbox test accounts
   - OR create a new sandbox buyer account

6. **Complete payment** on PayPal

7. **Verify success:**
   - You should be redirected back to `/checkout/success`
   - Order should be saved in database with `status = 'paid'`
   - Cart should be cleared

## Testing with PayPal Sandbox Accounts

PayPal provides test accounts for development:

1. Go to https://developer.paypal.com/dashboard/accounts
2. You'll see test accounts like:
   - **Personal (Buyer)** - Use this to make test purchases
   - **Business (Seller)** - This receives the payments

3. Click "View/Edit Account" to see login credentials
4. Use these credentials when testing checkout

## Checkout Flow

```
1. Customer adds products to cart
   ↓
2. Proceeds to checkout
   ↓
3. Fills in shipping information
   ↓
4. Selects PayPal payment (only option)
   ↓
5. Reviews order and clicks "Place Order"
   ↓
6. API creates PayPal order → Redirects to PayPal
   ↓
7. Customer logs into PayPal and approves payment
   ↓
8. PayPal redirects back to /checkout/success?token=xxx
   ↓
9. API captures payment and saves order to database
   ↓
10. Success message shown, cart cleared
```

## File Structure

### API Routes
- `app/api/paypal/create-order/route.ts` - Creates PayPal order
- `app/api/paypal/capture-order/route.ts` - Captures payment

### Components
- `components/checkout/payment-step.tsx` - PayPal payment selection
- `components/checkout/review-step.tsx` - Order review and payment trigger
- `app/checkout/success/page.tsx` - Success page after PayPal return

### Database
- `lib/database.ts` - Updated `createOrder` method with payment fields

## Going Live (Production)

When ready to accept real payments:

1. **Get Live PayPal Credentials:**
   - Switch to "Live" tab in PayPal Developer Dashboard
   - Copy Live Client ID and Secret

2. **Update `.env.local`:**
   ```bash
   PAYPAL_CLIENT_ID=your-live-client-id
   PAYPAL_CLIENT_SECRET=your-live-secret
   PAYPAL_API_URL=https://api-m.paypal.com  # Remove 'sandbox'
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```

3. **Update database to production database**

4. **Test thoroughly** with small real transactions first

5. **Monitor transactions** in your PayPal account dashboard

## Security Notes

✅ **What's Secure:**
- Payment processing happens on PayPal's servers (PCI compliant)
- Customer never enters card details on your site
- API credentials stored in environment variables (not in code)
- JWT authentication for order creation

⚠️ **Best Practices:**
- Never commit `.env.local` or credentials to Git
- Use different credentials for sandbox vs production
- Implement proper error logging for failed payments
- Monitor PayPal webhook for payment confirmations (optional enhancement)

## Troubleshooting

### "Failed to create PayPal order"
- Check that `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are set correctly
- Verify you're using sandbox credentials with sandbox API URL
- Check console for detailed error messages

### Payment approved but order not saved
- Check database connection is working
- Verify orders table has new `payment_method` and `payment_id` columns
- Check server console logs for database errors

### Redirect URL not working
- Ensure `NEXT_PUBLIC_BASE_URL` is set correctly
- For local dev, use `http://localhost:3000`
- For production, use your actual domain (with HTTPS)

## Next Steps

### Optional Enhancements:
1. **Add PayPal Webhooks** - Get notified of payment events
2. **Add more payment methods** - Stripe, credit cards, etc.
3. **Order confirmation emails** - Send receipt via email
4. **Admin dashboard** - View and manage orders
5. **Refund functionality** - Process refunds through PayPal API

## Support

- **PayPal Documentation:** https://developer.paypal.com/docs/
- **PayPal Sandbox:** https://developer.paypal.com/dashboard/
- **Integration Issues:** Check browser console and server logs for error details

---

**Ready to Test?**

1. Set up your PayPal sandbox credentials
2. Create `.env.local` with your credentials
3. Run `npm run dev`
4. Add products to cart and test checkout!
