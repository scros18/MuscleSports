import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";

const PAYPAL_API_URL = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";

// Get PayPal access token
async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, items, shippingInfo } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Get PayPal access token
    const accessToken = await getAccessToken();

    // Capture the PayPal order
    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal capture error:", data);
      return NextResponse.json({ error: "Failed to capture PayPal payment" }, { status: 500 });
    }

    // Check if payment was successful
    if (data.status === "COMPLETED") {
      // Save order to database
      const dbOrderId = `PP-${Date.now()}`;
      
      try {
        await Database.createOrder({
          id: dbOrderId,
          userId: shippingInfo?.email || "guest",
          items: items || [],
          total: parseFloat(data.purchase_units[0].payments.captures[0].amount.value),
          shippingAddress: shippingInfo,
          paymentMethod: "paypal",
          paymentId: orderId,
          status: "paid"
        });
      } catch (dbError) {
        console.error("Database order creation error:", dbError);
        // Payment succeeded but order couldn't be saved - log this for manual review
      }

      return NextResponse.json({
        success: true,
        orderId: dbOrderId,
        paypalOrderId: orderId,
        status: data.status,
        payer: data.payer,
      });
    }

    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  } catch (error) {
    console.error("PayPal capture API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
