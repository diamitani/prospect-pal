import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: any;

    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET && signature) {
      try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
        event = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err: any) {
        console.error(`⚠️ Stripe Webhook signature verification failed:`, err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
      }
    } else {
      // Direct JSON parsing fallback for test/dev payloads
      event = JSON.parse(rawBody);
    }

    const supabase = await createClient().catch(() => null);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId || "pro";

        console.log(`[Stripe Webhook] Checkout completed for user ${userId}, plan ${planId}`);

        if (supabase && userId && userId !== "anonymous") {
          await supabase
            .from("users")
            .update({
              plan: planId === "core" ? "agency" : planId === "diy" ? "free" : "pro",
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        console.log(`[Stripe Webhook] Subscription updated: ${subscription.id} status: ${subscription.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log(`[Stripe Webhook] Subscription cancelled: ${subscription.id}`);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, event: event.type });
  } catch (error) {
    console.error("[Stripe Webhook Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook handler failed" },
      { status: 500 }
    );
  }
}
