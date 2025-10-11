import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Database } from '@/lib/database';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Get orders for the user
    const orders = await Database.getOrdersByUserId(decoded.userId);

    // Format orders for response
    const formattedOrders = orders.map(order => ({
      id: order.id,
      items: order.items,
      total: order.total,
      status: order.status,
      shippingAddress: order.shippingAddress,
      createdAt: order.created_at.toISOString(),
      updatedAt: order.updated_at.toISOString()
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Get order data from request
    const { items, total, shippingAddress } = await request.json();

    if (!items || !total) {
      return NextResponse.json({ error: "Items and total are required" }, { status: 400 });
    }

    // Generate order ID
    const orderId = Date.now().toString();

    // Create order
    await Database.createOrder({
      id: orderId,
      userId: decoded.userId,
      items,
      total,
      shippingAddress
    });

    return NextResponse.json({
      order: {
        id: orderId,
        items,
        total,
        status: 'pending',
        shippingAddress,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}