
import os
from typing import List, Dict, Any, Optional
import json
import logging
from pydantic import BaseModel
from datetime import datetime
import stripe

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Data models
class PDFField(BaseModel):
    id: str
    label: str
    type: str
    position: Dict[str, float]
    value: str = ""
    suggestion: Optional[str] = None

class PDFDocument(BaseModel):
    id: str
    name: str
    type: str
    formFields: List[PDFField]

class WorkflowMatch(BaseModel):
    id: str
    title: str
    relevance_score: float
    key_terms: List[str]

class ProjectDetails(BaseModel):
    description: str
    location: str
    project_type: str
    client_type: str
    estimated_duration: Optional[int] = None

# Workflow and permit data specific to LA County (v0 focus)
LA_WORKFLOWS = [
    {
        "id": "la-utility-trenching",
        "title": "LA County Utility Trenching Permit Workflow",
        "key_terms": ["trench", "utility", "excavation", "los angeles", "fiber", "conduit", "underground"],
        "form_types": ["trenching permit", "encroachment permit", "traffic control plan"],
        "agency": "LA County Public Works",
        "price": 299
    },
    {
        "id": "la-traffic-control",
        "title": "LA County Traffic Control Plan Package",
        "key_terms": ["traffic", "lane closure", "detour", "los angeles", "road", "street"],
        "form_types": ["traffic control plan", "lane closure permit"],
        "agency": "LA Department of Transportation",
        "price": 249
    },
    {
        "id": "la-sidewalk",
        "title": "LA County Sidewalk Construction Workflow",
        "key_terms": ["sidewalk", "curb", "gutter", "los angeles", "pedestrian", "concrete"],
        "form_types": ["sidewalk permit", "pedestrian access plan"],
        "agency": "LA County Public Works",
        "price": 199
    },
    {
        "id": "la-road-repair",
        "title": "LA County Road Repair & ROW Permits",
        "key_terms": ["road", "repair", "asphalt", "concrete", "los angeles", "right of way", "pavement"],
        "form_types": ["right of way permit", "pavement cut permit"],
        "agency": "LA County Public Works",
        "price": 279
    },
]

class PDFProcessor:
    """
    Process PDF documents to extract form fields, provide AI suggestions,
    and match to relevant workflows in the LA County marketplace.
    """
    
    def __init__(self, stripe_api_key=None):
        self.nlp_model = None  # Would initialize language model here
        self.stripe_api_key = stripe_api_key
        logger.info("LA County PDF Processor initialized")
    
    def extract_project_details(self, text: str) -> ProjectDetails:
        """Extract project details from text using NLP"""
        # In production, this would use a real NLP model
        logger.info(f"Extracting project details from text of length: {len(text)}")
        
        # Check for LA County location indicators
        location = "Los Angeles County"
        if "downtown la" in text.lower() or "downtown los angeles" in text.lower():
            location = "Downtown Los Angeles"
        elif "hollywood" in text.lower():
            location = "Hollywood, Los Angeles"
        elif "santa monica" in text.lower():
            location = "Santa Monica, Los Angeles"
        
        # Determine project type
        project_type = "utility"
        if "road" in text.lower() or "pavement" in text.lower():
            project_type = "road repair"
        elif "sidewalk" in text.lower() or "curb" in text.lower():
            project_type = "sidewalk"
        elif "traffic" in text.lower() or "lane closure" in text.lower():
            project_type = "traffic control"
        
        return ProjectDetails(
            description=text[:100] + "..." if len(text) > 100 else text,
            location=location,
            project_type=project_type,
            client_type="contractor" if "contractor" in text.lower() else "civil engineer",
            estimated_duration=14  # Default to 2 weeks
        )
    
    def analyze_pdf(self, pdf_path: str) -> List[PDFDocument]:
        """
        Analyze PDF to extract text, identify form fields for LA County permits,
        and create interactive form overlay
        """
        logger.info(f"Analyzing PDF for LA County permits: {pdf_path}")
        
        # In production, this would use a PDF processing library
        # For this example, we'll return mock data based on filename
        pdf_filename = os.path.basename(pdf_path).lower()
        
        if "trench" in pdf_filename or "excavation" in pdf_filename:
            return [self._create_la_trenching_permit()]
        elif "traffic" in pdf_filename:
            return [self._create_la_traffic_control_plan()]
        else:
            # Return multiple documents for a general project submission
            return [
                self._create_la_trenching_permit(),
                self._create_la_traffic_control_plan(),
                self._create_la_utility_notification()
            ]
    
    def match_workflows(self, text: str, location: str = None) -> List[WorkflowMatch]:
        """Match extracted text to relevant LA County workflows in the marketplace"""
        logger.info(f"Matching workflows for text of length: {len(text)} and location: {location}")
        
        text = text.lower()
        matches = []
        
        # Simple keyword matching (in production, this would use vector embeddings)
        for workflow in LA_WORKFLOWS:
            score = 0
            matching_terms = []
            
            # Check key terms
            for term in workflow["key_terms"]:
                if term.lower() in text:
                    score += 1
                    matching_terms.append(term)
            
            # Los Angeles focus for v0
            if location and "los angeles" in location.lower():
                score += 2
                matching_terms.append("Los Angeles")
            
            if score > 0:
                matches.append(WorkflowMatch(
                    id=workflow["id"],
                    title=workflow["title"],
                    relevance_score=score,
                    key_terms=matching_terms
                ))
        
        # Sort by relevance score
        matches.sort(key=lambda x: x.relevance_score, reverse=True)
        
        return matches[:3]  # Return top 3 matches
    
    def generate_field_suggestions(self, document: PDFDocument, project_details: ProjectDetails) -> PDFDocument:
        """Generate AI suggestions for form fields based on project details"""
        logger.info(f"Generating field suggestions for LA County document: {document.name}")
        
        # In production, this would use an LLM to generate contextual suggestions
        # For this example, we'll use simple rules with LA County specific details
        
        # Simple date suggestions
        today = datetime.now()
        start_date = today.strftime("%m/%d/%Y")
        
        for field in document.formFields:
            if "description" in field.label.lower():
                field.suggestion = f"{project_details.project_type.title()} - {project_details.description[:20]}"
            elif "address" in field.label.lower() or "location" in field.label.lower():
                field.suggestion = f"123 Main St, {project_details.location}"
            elif "date" in field.label.lower():
                field.suggestion = start_date
            elif "duration" in field.label.lower() or "days" in field.label.lower():
                field.suggestion = "14"  # Two weeks
            elif "length" in field.label.lower() and "trench" in field.label.lower():
                field.suggestion = "500"  # 500 feet
            elif "width" in field.label.lower() and "trench" in field.label.lower():
                field.suggestion = "24"  # 24 inches
            elif "license" in field.label.lower() or "contractor" in field.label.lower():
                field.suggestion = "LA-123456"
            elif "street" in field.label.lower() and "classification" in field.label.lower():
                field.suggestion = "Collector Street"
            elif "lane" in field.label.lower() and "closure" in field.label.lower():
                field.suggestion = "Partial - One Lane"
            elif "hours" in field.label.lower():
                field.suggestion = "9:00 AM - 4:00 PM"
            elif "pedestrian" in field.label.lower():
                field.suggestion = "Temporary Walkway"
            # LA County specific
            elif "la" in field.label.lower() or "los angeles" in field.label.lower():
                field.suggestion = "Los Angeles County"
            elif "agency" in field.label.lower():
                field.suggestion = "LA County Public Works"
        
        return document
    
    def process_payment(self, workflow_id: str, token: str, customer_email: str) -> Dict[str, Any]:
        """Process payment for a workflow purchase"""
        logger.info(f"Processing payment for workflow: {workflow_id}")
        
        if not self.stripe_api_key:
            logger.error("Stripe API key not configured")
            return {"success": False, "error": "Payment processing not configured"}
        
        try:
            # Find the workflow
            workflow = next((w for w in LA_WORKFLOWS if w["id"] == workflow_id), None)
            if not workflow:
                return {"success": False, "error": "Workflow not found"}
            
            # Set up Stripe with API key
            stripe.api_key = self.stripe_api_key
            
            # Create payment
            payment = stripe.PaymentIntent.create(
                amount=workflow["price"] * 100,  # Amount in cents
                currency="usd",
                payment_method=token,
                confirmation_method="manual",
                confirm=True,
                description=f"Purchase of {workflow['title']}",
                receipt_email=customer_email,
                metadata={
                    "workflow_id": workflow_id,
                    "workflow_title": workflow["title"]
                }
            )
            
            return {
                "success": True,
                "payment_id": payment.id,
                "workflow_id": workflow_id,
                "amount": workflow["price"]
            }
            
        except Exception as e:
            logger.error(f"Payment error: {str(e)}")
            return {"success": False, "error": str(e)}
    
    # Mock document creators for LA County
    def _create_la_trenching_permit(self) -> PDFDocument:
        return PDFDocument(
            id="la-trenching-permit",
            name="LA County Trenching Permit Application",
            type="Municipal Permit",
            formFields=[
                PDFField(id="field1", label="Project Description", type="text", position={"x": 30, "y": 20}),
                PDFField(id="field2", label="LA County Location", type="text", position={"x": 70, "y": 20}),
                PDFField(id="field3", label="Start Date", type="text", position={"x": 30, "y": 40}),
                PDFField(id="field4", label="Duration (days)", type="text", position={"x": 70, "y": 40}),
                PDFField(id="field5", label="Trench Length (ft)", type="text", position={"x": 30, "y": 60}),
                PDFField(id="field6", label="Trench Width (inches)", type="text", position={"x": 70, "y": 60}),
                PDFField(id="field7", label="CA Contractor License #", type="text", position={"x": 50, "y": 80}),
            ]
        )
    
    def _create_la_traffic_control_plan(self) -> PDFDocument:
        return PDFDocument(
            id="la-traffic-control",
            name="LA County Traffic Control Plan",
            type="Traffic Management",
            formFields=[
                PDFField(id="field1", label="LA Street Classification", type="text", position={"x": 30, "y": 20}),
                PDFField(id="field2", label="Lane Closure Type", type="text", position={"x": 70, "y": 20}),
                PDFField(id="field3", label="Working Hours", type="text", position={"x": 30, "y": 40}),
                PDFField(id="field4", label="Detour Required", type="text", position={"x": 70, "y": 40}),
                PDFField(id="field5", label="Pedestrian Protection", type="text", position={"x": 50, "y": 60}),
            ]
        )
    
    def _create_la_utility_notification(self) -> PDFDocument:
        return PDFDocument(
            id="la-utilities-notification",
            name="LA County Utility Notification Form",
            type="811 Notification",
            formFields=[
                PDFField(id="field1", label="Ticket Number", type="text", position={"x": 30, "y": 20}),
                PDFField(id="field2", label="Excavation Method", type="text", position={"x": 70, "y": 20}),
                PDFField(id="field3", label="Utility Type", type="text", position={"x": 30, "y": 40}),
                PDFField(id="field4", label="Marking Instructions", type="text", position={"x": 70, "y": 40}),
                PDFField(id="field5", label="Notification Date", type="text", position={"x": 50, "y": 60}),
            ]
        )

# API endpoints implementation
def process_pdf_document(pdf_path: str, project_description: str = "") -> dict:
    """Process a PDF document and return form fields with suggestions for LA County permits"""
    processor = PDFProcessor()
    
    # Extract project details from description
    project_details = processor.extract_project_details(project_description)
    
    # Process PDF
    documents = processor.analyze_pdf(pdf_path)
    
    # Generate suggestions for each document
    for i in range(len(documents)):
        documents[i] = processor.generate_field_suggestions(documents[i], project_details)
    
    # Find matching workflows
    workflows = processor.match_workflows(project_description, project_details.location)
    
    return {
        "project_details": project_details.dict(),
        "documents": [doc.dict() for doc in documents],
        "recommended_workflows": [wf.dict() for wf in workflows]
    }

def search_workflows(query: str, location: str = None) -> dict:
    """Search for relevant workflows in the LA County marketplace"""
    processor = PDFProcessor()
    matches = processor.match_workflows(query, location)
    
    return {
        "query": query,
        "location": location,
        "results": [match.dict() for match in matches]
    }

def purchase_workflow(workflow_id: str, token: str, email: str, stripe_api_key: str) -> dict:
    """Purchase a workflow using Stripe payment processing"""
    processor = PDFProcessor(stripe_api_key=stripe_api_key)
    return processor.process_payment(workflow_id, token, email)

# Flask API implementation (would be implemented in a real backend)
# This is a skeleton implementation for demonstration purposes
def create_flask_app():
    """Create a Flask API for the PDF processor"""
    try:
        from flask import Flask, request, jsonify
    except ImportError:
        logger.error("Flask is not installed. Please install it with 'pip install flask'")
        return None
    
    app = Flask(__name__)
    
    @app.route('/api/process-pdf', methods=['POST'])
    def api_process_pdf():
        data = request.json
        pdf_path = data.get('pdf_path')
        project_description = data.get('project_description', '')
        
        if not pdf_path:
            return jsonify({"error": "PDF path is required"}), 400
            
        result = process_pdf_document(pdf_path, project_description)
        return jsonify(result)
    
    @app.route('/api/search-workflows', methods=['POST'])
    def api_search_workflows():
        data = request.json
        query = data.get('query')
        location = data.get('location')
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
            
        result = search_workflows(query, location)
        return jsonify(result)
    
    @app.route('/api/purchase-workflow', methods=['POST'])
    def api_purchase_workflow():
        data = request.json
        workflow_id = data.get('workflow_id')
        token = data.get('token')
        email = data.get('email')
        
        if not all([workflow_id, token, email]):
            return jsonify({"error": "Workflow ID, payment token, and email are required"}), 400
        
        # In a real app, get this from environment variables or secure storage
        stripe_api_key = "sk_test_your_stripe_key"
        
        result = purchase_workflow(workflow_id, token, email, stripe_api_key)
        return jsonify(result)
    
    return app

# Example usage for testing
if __name__ == "__main__":
    # Example: Process PDF
    result = process_pdf_document(
        "/tmp/example_la_trenching_permit.pdf",
        "Need to install fiber optic cable in Los Angeles, 500ft trench along Main Street"
    )
    print(json.dumps(result, indent=2))
    
    # Example: Search workflows
    result = search_workflows(
        "sidewalk repair Los Angeles",
        "Los Angeles County"
    )
    print(json.dumps(result, indent=2))
