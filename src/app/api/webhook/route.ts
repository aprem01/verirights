import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const trackId = session.metadata?.track_id;

      if (userId) {
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: session.customer as string })
          .eq("id", userId);
      }

      if (trackId) {
        await supabase.from("registrations").update({
          payment_id: session.payment_intent as string,
        }).eq("track_id", trackId);
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      // Update user subscription status as needed
      break;
    }

    case "customer.subscription.deleted": {
      // Handle subscription cancellation
      break;
    }
  }

  return NextResponse.json({ received: true });
}
