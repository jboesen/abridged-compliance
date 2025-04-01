
import os
import stripe
import json
import logging
from typing import Dict, Any

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StripePaymentProcessor:
    """
    Handles Stripe payment processing for workflow purchases
    """
    
    def __init__(self, api_key: str):
        """
        Initialize the Stripe payment processor with an API key
        """
        self.api_key = api_key
        stripe.api_key = api_key
        logger.info("Stripe payment processor initialized")
    
    def create_payment_intent(self, amount: int, currency: str, description: str, 
                              customer_email: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a payment intent for a workflow purchase
        """
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount,  # amount in cents
                currency=currency,
                description=description,
                receipt_email=customer_email,
                metadata=metadata
            )
            
            return {
                "success": True,
                "client_secret": intent.client_secret,
                "amount": amount,
                "payment_id": intent.id
            }
        
        except Exception as e:
            logger.error(f"Error creating payment intent: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def confirm_payment(self, payment_intent_id: str) -> Dict[str, Any]:
        """
        Confirm a payment intent after customer completes payment
        """
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            if intent.status == "succeeded":
                return {
                    "success": True,
                    "status": intent.status,
                    "amount": intent.amount,
                    "payment_id": intent.id
                }
            else:
                return {
                    "success": False,
                    "status": intent.status,
                    "message": f"Payment not successful. Status: {intent.status}"
                }
                
        except Exception as e:
            logger.error(f"Error confirming payment: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def create_checkout_session(self, workflow_id: str, workflow_title: str, 
                               price_in_cents: int, success_url: str, 
                               cancel_url: str) -> Dict[str, Any]:
        """
        Create a Stripe Checkout Session for a workflow purchase
        """
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": workflow_title,
                            "description": f"Purchase of {workflow_title} workflow",
                        },
                        "unit_amount": price_in_cents,
                    },
                    "quantity": 1,
                }],
                mode="payment",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    "workflow_id": workflow_id,
                    "workflow_title": workflow_title
                }
            )
            
            return {
                "success": True,
                "session_id": session.id,
                "checkout_url": session.url
            }
            
        except Exception as e:
            logger.error(f"Error creating checkout session: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

# Flask API implementation
def create_flask_app():
    """Create a Flask API for the Stripe payment processor"""
    try:
        from flask import Flask, request, jsonify, redirect
    except ImportError:
        logger.error("Flask is not installed. Please install it with 'pip install flask'")
        return None
    
    app = Flask(__name__)
    
    # In a real app, this would be loaded from environment variables
    stripe_api_key = os.environ.get("STRIPE_API_KEY", "sk_test_your_stripe_key")
    payment_processor = StripePaymentProcessor(stripe_api_key)
    
    @app.route('/api/payment/create-intent', methods=['POST'])
    def create_payment_intent():
        data = request.json
        
        workflow_id = data.get('workflow_id')
        workflow_title = data.get('workflow_title')
        amount_in_cents = data.get('amount_in_cents')  # amount in cents
        customer_email = data.get('email')
        
        if not all([workflow_id, workflow_title, amount_in_cents, customer_email]):
            return jsonify({"error": "Missing required fields"}), 400
        
        metadata = {
            "workflow_id": workflow_id,
            "workflow_title": workflow_title
        }
        
        result = payment_processor.create_payment_intent(
            amount=amount_in_cents,
            currency="usd",
            description=f"Purchase of {workflow_title}",
            customer_email=customer_email,
            metadata=metadata
        )
        
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 500
    
    @app.route('/api/payment/create-checkout', methods=['POST'])
    def create_checkout_session():
        data = request.json
        
        workflow_id = data.get('workflow_id')
        workflow_title = data.get('workflow_title')
        price_in_cents = data.get('price_in_cents')
        
        # Front-end URLs for redirection
        success_url = data.get('success_url', 'http://localhost:5173/payment/success')
        cancel_url = data.get('cancel_url', 'http://localhost:5173/marketplace')
        
        if not all([workflow_id, workflow_title, price_in_cents]):
            return jsonify({"error": "Missing required fields"}), 400
        
        result = payment_processor.create_checkout_session(
            workflow_id=workflow_id,
            workflow_title=workflow_title,
            price_in_cents=price_in_cents,
            success_url=success_url,
            cancel_url=cancel_url
        )
        
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 500
    
    @app.route('/api/payment/confirm', methods=['POST'])
    def confirm_payment_intent():
        data = request.json
        payment_intent_id = data.get('payment_intent_id')
        
        if not payment_intent_id:
            return jsonify({"error": "Payment intent ID is required"}), 400
        
        result = payment_processor.confirm_payment(payment_intent_id)
        
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 500
    
    # Webhook handler for Stripe events
    @app.route('/api/payment/webhook', methods=['POST'])
    def stripe_webhook():
        payload = request.get_data()
        sig_header = request.headers.get('Stripe-Signature')
        
        # In a real app, this would be loaded from environment variables
        webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
            
            # Handle the event
            if event['type'] == 'payment_intent.succeeded':
                payment_intent = event['data']['object']
                workflow_id = payment_intent['metadata'].get('workflow_id')
                
                logger.info(f"Payment succeeded for workflow: {workflow_id}")
                # In a real app, this would update a database, grant access, etc.
            
            return jsonify(success=True), 200
        except Exception as e:
            logger.error(f"Error handling webhook: {str(e)}")
            return jsonify(error=str(e)), 400
    
    return app

# Example usage for testing
if __name__ == "__main__":
    # This would be loaded from environment variables in a real app
    stripe_api_key = "sk_test_your_stripe_key"
    
    processor = StripePaymentProcessor(stripe_api_key)
    
    # Example: Create a payment intent
    result = processor.create_payment_intent(
        amount=29900,  # $299.00
        currency="usd",
        description="LA County Utility Trenching Permit Workflow",
        customer_email="customer@example.com",
        metadata={"workflow_id": "la-utility-trenching"}
    )
    
    print(json.dumps(result, indent=2))
