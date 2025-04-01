
// This file demonstrates server-side code that would run in a Node.js environment
// to handle Stripe payments for workflow purchases.

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

/**
 * Create a Stripe checkout session for workflow purchase
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function createCheckoutSession(req, res) {
  try {
    const { workflowId, workflowTitle, price, customerId } = req.body;
    
    // Validate required parameters
    if (!workflowId || !workflowTitle || !price) {
      return res.status(400).json({
        error: 'Missing required parameters: workflowId, workflowTitle, or price'
      });
    }

    // Create line items for Stripe checkout
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: workflowTitle,
            description: `Access to ${workflowTitle} workflow`,
          },
          unit_amount: price * 100, // Convert dollars to cents
        },
        quantity: 1,
      },
    ];

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId || undefined, // Optional customer ID if user is registered
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment', // One-time payment
      success_url: `${req.headers.origin}/workflow/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/workflow/${workflowId}`,
      metadata: {
        workflowId,
      },
    });

    // Return the session ID for the client to redirect
    res.status(200).json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Verify a completed payment and grant access to workflow
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function verifyPayment(req, res) {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId parameter' });
    }

    // Retrieve the checkout session to verify payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the payment was successful
    if (session.payment_status === 'paid') {
      const workflowId = session.metadata.workflowId;
      
      // In production, you would:
      // 1. Update a database to grant the user access to this workflow
      // 2. Create any necessary user-specific resources
      
      return res.status(200).json({
        success: true,
        workflowId,
        message: 'Payment verified, workflow access granted'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
    
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Handle Stripe webhook events
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function handleWebhookEvent(req, res) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle specific events
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Process the payment completion
      if (session.payment_status === 'paid') {
        const workflowId = session.metadata.workflowId;
        const customerId = session.customer;
        
        console.log(`Payment succeeded for workflow ${workflowId}`);
        
        // Update database to grant access to the workflow
        // await grantWorkflowAccess(customerId, workflowId);
      }
      break;
      
    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      console.log(`Payment failed: ${paymentIntent.last_payment_error?.message}`);
      
      // Handle failed payment if necessary
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  res.status(200).json({ received: true });
}

// Export functions for use in an Express.js app
module.exports = {
  createCheckoutSession,
  verifyPayment,
  handleWebhookEvent
};

// Example Express.js routes:
/*
const express = require('express');
const router = express.Router();
const { createCheckoutSession, verifyPayment, handleWebhookEvent } = require('./stripe_payment');

// Create checkout session
router.post('/checkout', createCheckoutSession);

// Verify payment
router.post('/verify-payment', verifyPayment);

// Handle Stripe webhooks
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhookEvent);

module.exports = router;
*/
