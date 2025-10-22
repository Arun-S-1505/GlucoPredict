from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os
from dotenv import load_dotenv
from datetime import datetime, timezone

# Import our custom modules
from database import user_repo, prediction_repo, mongodb
from auth import (
    hash_password, verify_password, generate_token, 
    require_auth, validate_email, validate_password
)

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
CORS(app, origins=cors_origins)

# Global variables for model and scaler
model = None
scaler = None

def load_model():
    global model, scaler
    if model is None:
        print("Loading model and scaler...")
        import tensorflow as tf
        import joblib
        model = tf.keras.models.load_model('diabetes_model.h5')
        scaler = joblib.load('scaler.pkl')
        print("Model and scaler loaded successfully!")

@app.route("/")
def root():
    return {
        "message": "GlucoPredict API - Version 3.0",
        "features": ["User Authentication", "MongoDB Integration", "Prediction History"],
        "endpoints": {
            "auth": ["/auth/register", "/auth/login", "/auth/profile"],
            "predictions": ["/predict", "/predictions", "/predictions/stats"]
        }
    }

@app.route("/health")
def health():
    try:
        # Test database connection
        db = mongodb.get_db()
        db.admin.command('ping')
        db_status = "connected"
    except:
        db_status = "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# Authentication Routes
@app.route("/auth/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        name = data.get('name', '').strip()
        
        # Validate email format
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Validate password strength
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({"error": message}), 400
        
        # Check if user already exists
        existing_user = user_repo.get_user_by_email(email)
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 409
        
        # Hash password and create user
        password_hash = hash_password(password)
        user = user_repo.create_user(email, password_hash, name)
        
        # Generate authentication token
        token = generate_token(str(user['_id']), user['email'])
        
        return jsonify({
            "message": "User registered successfully",
            "user": {
                "id": str(user['_id']),
                "email": user['email'],
                "name": user['name']
            },
            "token": token
        }), 201
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"error": "Registration failed. Please try again."}), 500

@app.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Get user from database
        user = user_repo.get_user_by_email(email)
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Verify password
        if not verify_password(password, user['password_hash']):
            return jsonify({"error": "Invalid email or password"}), 401
        
        if not user.get('is_active', True):
            return jsonify({"error": "Account is deactivated"}), 401
        
        # Update last login
        user_repo.update_last_login(str(user['_id']))
        
        # Generate authentication token
        token = generate_token(str(user['_id']), user['email'])
        
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": str(user['_id']),
                "email": user['email'],
                "name": user['name'],
                "prediction_count": user.get('prediction_count', 0)
            },
            "token": token
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Login failed. Please try again."}), 500

@app.route("/auth/profile", methods=["GET"])
@require_auth
def get_profile():
    try:
        user = request.current_user
        return jsonify({
            "user": {
                "id": str(user['_id']),
                "email": user['email'],
                "name": user['name'],
                "prediction_count": user.get('prediction_count', 0),
                "created_at": user['created_at'].isoformat() if user.get('created_at') else None,
                "last_login": user['last_login'].isoformat() if user.get('last_login') else None
            }
        }), 200
    except Exception as e:
        return jsonify({"error": "Failed to get profile"}), 500

# Prediction Routes
@app.route("/predict", methods=["POST"])
@require_auth
def predict_diabetes():
    import time
    start_time = time.time()

    try:
        data = request.get_json()
        user = request.current_user

        # Validate required fields
        required_fields = ["pregnancies", "glucose", "bloodPressure", "skinThickness", "insulin", "bmi", "diabetesPedigree", "age"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Load model if not already loaded
        load_model()

        # Convert to the order expected by the model
        features = [
            float(data["pregnancies"]),
            float(data["glucose"]),
            float(data["bloodPressure"]),
            float(data["skinThickness"]),
            float(data["insulin"]),
            float(data["bmi"]),
            float(data["diabetesPedigree"]),
            float(data["age"])
        ]

        # Scale the features
        features_scaled = scaler.transform([features])

        # Make prediction
        prediction_prob = model.predict(features_scaled, verbose=0)[0]
        prediction_class = int(np.argmax(prediction_prob))

        # Calculate response time
        response_time = time.time() - start_time

        # Determine risk level based on 3-class prediction
        class_names = ['normal', 'borderline', 'high']
        risk_messages = {
            0: "Normal - Low Risk of Diabetes",
            1: "Borderline/Pre-diabetic - Moderate Risk of Diabetes",
            2: "High Risk of Diabetes"
        }

        risk = class_names[prediction_class]
        message = risk_messages[prediction_class]

        # Format probabilities
        probabilities = {
            "normal": float(prediction_prob[0]),
            "borderline": float(prediction_prob[1]),
            "high": float(prediction_prob[2])
        }

        # Prepare prediction result
        prediction_result = {
            "risk": risk,
            "message": message,
            "probabilities": probabilities,
            "predicted_class": prediction_class,
            "model_accuracy": float(os.getenv('MODEL_ACCURACY', 86.4)),
            "response_time_ms": round(response_time * 1000, 2)
        }

        # Save prediction to database
        try:
            prediction_data = {**data, **prediction_result}
            saved_prediction = prediction_repo.create_prediction(
                str(user['_id']), 
                prediction_data
            )
            
            # Update user's prediction count
            user_repo.increment_prediction_count(str(user['_id']))
            
            # Add prediction ID to response
            prediction_result['prediction_id'] = str(saved_prediction['_id'])
            
        except Exception as db_error:
            print(f"Failed to save prediction to database: {db_error}")
            # Continue without failing the prediction

        return jsonify(prediction_result)

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route("/predictions", methods=["GET"])
@require_auth
def get_predictions():
    try:
        user = request.current_user
        
        # Get query parameters
        limit = min(int(request.args.get('limit', 20)), 100)  # Max 100 records
        skip = int(request.args.get('skip', 0))
        
        # Get user's predictions
        predictions = prediction_repo.get_user_predictions(
            str(user['_id']), 
            limit=limit, 
            skip=skip
        )
        
        return jsonify({
            "predictions": predictions,
            "count": len(predictions),
            "limit": limit,
            "skip": skip
        }), 200
        
    except Exception as e:
        print(f"Get predictions error: {e}")
        return jsonify({"error": "Failed to fetch predictions"}), 500

@app.route("/predictions/stats", methods=["GET"])
@require_auth
def get_prediction_stats():
    try:
        user = request.current_user
        stats = prediction_repo.get_prediction_stats(str(user['_id']))
        
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"Get stats error: {e}")
        return jsonify({"error": "Failed to fetch statistics"}), 500

# Public prediction endpoint (for non-authenticated users)
@app.route("/predict/public", methods=["POST"])
def predict_diabetes_public():
    """Public prediction endpoint for users who aren't logged in"""
    import time
    start_time = time.time()

    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ["pregnancies", "glucose", "bloodPressure", "skinThickness", "insulin", "bmi", "diabetesPedigree", "age"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Load model if not already loaded
        load_model()

        # Convert to the order expected by the model
        features = [
            float(data["pregnancies"]),
            float(data["glucose"]),
            float(data["bloodPressure"]),
            float(data["skinThickness"]),
            float(data["insulin"]),
            float(data["bmi"]),
            float(data["diabetesPedigree"]),
            float(data["age"])
        ]

        # Scale the features
        features_scaled = scaler.transform([features])

        # Make prediction
        prediction_prob = model.predict(features_scaled, verbose=0)[0]
        prediction_class = int(np.argmax(prediction_prob))

        # Calculate response time
        response_time = time.time() - start_time

        # Determine risk level based on 3-class prediction
        class_names = ['normal', 'borderline', 'high']
        risk_messages = {
            0: "Normal - Low Risk of Diabetes",
            1: "Borderline/Pre-diabetic - Moderate Risk of Diabetes",
            2: "High Risk of Diabetes"
        }

        risk = class_names[prediction_class]
        message = risk_messages[prediction_class]

        # Format probabilities
        probabilities = {
            "normal": float(prediction_prob[0]),
            "borderline": float(prediction_prob[1]),
            "high": float(prediction_prob[2])
        }

        return jsonify({
            "risk": risk,
            "message": message,
            "probabilities": probabilities,
            "predicted_class": prediction_class,
            "model_accuracy": float(os.getenv('MODEL_ACCURACY', 86.4)),
            "response_time_ms": round(response_time * 1000, 2),
            "note": "Sign up to save your prediction history!"
        })

    except Exception as e:
        print(f"Public prediction error: {e}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

@app.teardown_appcontext
def close_db(error):
    """Close database connection when app context tears down"""
    if error:
        print(f"App context error: {error}")

if __name__ == "__main__":
    try:
        port = int(os.environ.get("PORT", 8000))
        debug_mode = os.getenv('DEBUG', 'False').lower() == 'true'
        
        print(f"🚀 Starting GlucoPredict API server...")
        print(f"📡 Port: {port}")
        print(f"🐛 Debug: {debug_mode}")
        print(f"🌐 CORS Origins: {cors_origins}")
        
        app.run(host="0.0.0.0", port=port, debug=debug_mode)
    except KeyboardInterrupt:
        print("\n👋 Shutting down gracefully...")
        mongodb.close_connection()
    except Exception as e:
        print(f"❌ Failed to start server: {e}")