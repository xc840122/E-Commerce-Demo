import { Metadata } from "@/actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe";


export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return new Response("Invalid request", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.log("Stripe webhook secret not set");
    return new Response("Invalid webhook secret", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Error verifying webhook", error);
    return new Response("Invalid request", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const order = await createOrderInSanity(session);
      console.log("Order created in Sanity", order);
    } catch (error) {
      console.error("Error creating order in Sanity", error);
      return new Response("Error creating order in Sanity", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  const { orderNumber, customerName, customerEmail, clerkUserId } = metadata as Metadata;

  const lineItemWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    {
      expand: ["data.price.product"],
    }
  );

  const sanityProducts = lineItemWithProduct.data.map(item => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }));

  const order = await backendClient.create({
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customer,
    clerkUserId: clerkUserId,
    email: customerEmail,
    currency: "nzd",
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100 : 0,
    products: sanityProducts,
    total_price: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
  });

  return order;
}