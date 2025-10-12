from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Allow frontend

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
    return {"message": "Prediction Backend API"}

@app.route("/health")
def health():
    return {"status": "healthy"}

@app.route("/predict", methods=["POST"])
def predict_diabetes():
    import time
    start_time = time.time()

    data = request.get_json()

    # Validate required fields
    required_fields = ["pregnancies", "glucose", "bloodPressure", "skinThickness", "insulin", "bmi", "diabetesPedigree", "age"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
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
        prediction_prob = model.predict(features_scaled, verbose=0)[0][0]
        prediction = int(prediction_prob > 0.5)

        # Calculate response time
        response_time = time.time() - start_time

        # Determine risk level based on prediction and probability
        if prediction == 1:
            risk = "high"
            message = f"High Risk of Diabetes (Probability: {prediction_prob:.1%})"
        else:
            risk = "low"
            message = f"Low Risk of Diabetes (Probability: {prediction_prob:.1%})"

        return jsonify({
            "risk": risk,
            "message": message,
            "probability": float(prediction_prob),
            "model_accuracy": 73.4,  # Test accuracy from training
            "response_time_ms": round(response_time * 1000, 2)
        })

    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8000)