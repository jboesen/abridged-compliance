
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Retrieve user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    // Parse the request body
    const { planId } = await req.json();
    if (!planId) throw new Error("No plan ID provided");
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if an existing Stripe customer record exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Map plan IDs to Stripe price data
    const planPriceData = {
      "basic-monthly": {
        name: "Basic Monthly",
        unit_amount: 999, // $9.99
        recurring: { interval: "month" }
      },
      "pro-monthly": {
        name: "Professional Monthly",
        unit_amount: 1999, // $19.99
        recurring: { interval: "month" }
      },
      "business-monthly": {
        name: "Business Monthly",
        unit_amount: 4999, // $49.99
        recurring: { interval: "month" }
      },
      "basic-yearly": {
        name: "Basic Yearly",
        unit_amount: 9990, // $99.90
        recurring: { interval: "year" }
      },
      "pro-yearly": {
        name: "Professional Yearly",
        unit_amount: 19990, // $199.90
        recurring: { interval: "year" }
      },
      "business-yearly": {
        name: "Business Yearly",
        unit_amount: 49990, // $499.90
        recurring: { interval: "year" }
      }
    };
    
    const planData = planPriceData[planId as keyof typeof planPriceData];
    if (!planData) throw new Error("Invalid plan ID");

    // Create a subscription session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: planData.name },
            unit_amount: planData.unit_amount,
            recurring: planData.recurring,
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payments`,
      metadata: {
        user_id: user.id,
        plan_id: planId
      }
    });

    console.log("Created checkout session:", session.id);
    
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-checkout function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
