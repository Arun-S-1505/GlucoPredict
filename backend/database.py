from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, PyMongoError
from bson import ObjectId
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
import logging

load_dotenv()

class MongoDB:
    _instance = None
    _db = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDB, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._db is None:
            self.connect()
    
    def connect(self):
        """Connect to MongoDB Atlas"""
        try:
            mongodb_uri = os.getenv('MONGODB_URI')
            if not mongodb_uri:
                raise ValueError("MONGODB_URI not found in environment variables")
            
            self.client = MongoClient(mongodb_uri)
            self._db = self.client.glucopredict
            
            # Test connection
            self.client.admin.command('ping')
            print("✅ Connected to MongoDB Atlas successfully")
            
            # Create indexes for better performance
            self._create_indexes()
            
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            raise e
    
    def _create_indexes(self):
        """Create database indexes for better performance"""
        try:
            # Users collection indexes
            self._db.users.create_index("email", unique=True)
            self._db.users.create_index("created_at")
            
            # Predictions collection indexes
            self._db.predictions.create_index([("user_id", 1), ("created_at", -1)])
            self._db.predictions.create_index("created_at")
            
            print("✅ Database indexes created successfully")
        except Exception as e:
            print(f"⚠️ Warning: Could not create indexes: {e}")
    
    def get_db(self):
        """Get database instance"""
        if self._db is None:
            self.connect()
        return self._db
    
    def close_connection(self):
        """Close database connection"""
        if hasattr(self, 'client'):
            self.client.close()
            print("🔌 Database connection closed")

class UserRepository:
    def __init__(self):
        self.db = MongoDB().get_db()
        self.users = self.db.users
    
    def create_user(self, email: str, password_hash: str, name: str = None) -> dict:
        """Create a new user"""
        try:
            user_data = {
                "email": email.lower().strip(),
                "password_hash": password_hash,
                "name": name.strip() if name else None,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "is_active": True,
                "prediction_count": 0,
                "last_login": None
            }
            
            result = self.users.insert_one(user_data)
            user_data['_id'] = result.inserted_id
            
            # Remove password hash from returned data
            user_data.pop('password_hash', None)
            return user_data
            
        except DuplicateKeyError:
            raise ValueError("User with this email already exists")
        except Exception as e:
            raise Exception(f"Failed to create user: {str(e)}")
    
    def get_user_by_email(self, email: str) -> dict:
        """Get user by email"""
        try:
            user = self.users.find_one({"email": email.lower().strip()})
            return user
        except Exception as e:
            raise Exception(f"Failed to get user: {str(e)}")
    
    def get_user_by_id(self, user_id: str) -> dict:
        """Get user by ID"""
        try:
            user = self.users.find_one({"_id": ObjectId(user_id)})
            if user:
                user.pop('password_hash', None)  # Remove password hash
            return user
        except Exception as e:
            raise Exception(f"Failed to get user: {str(e)}")
    
    def update_last_login(self, user_id: str):
        """Update user's last login timestamp"""
        try:
            self.users.update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": {"last_login": datetime.now(timezone.utc)},
                    "$inc": {"login_count": 1}
                }
            )
        except Exception as e:
            print(f"Warning: Could not update last login: {e}")
    
    def increment_prediction_count(self, user_id: str):
        """Increment user's prediction count"""
        try:
            self.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$inc": {"prediction_count": 1}}
            )
        except Exception as e:
            print(f"Warning: Could not update prediction count: {e}")

class PredictionRepository:
    def __init__(self):
        self.db = MongoDB().get_db()
        self.predictions = self.db.predictions
    
    def create_prediction(self, user_id: str, prediction_data: dict) -> dict:
        """Create a new prediction record"""
        try:
            prediction = {
                "user_id": ObjectId(user_id),
                "pregnancies": prediction_data.get("pregnancies"),
                "glucose": prediction_data.get("glucose"),
                "blood_pressure": prediction_data.get("bloodPressure"),
                "skin_thickness": prediction_data.get("skinThickness"),
                "insulin": prediction_data.get("insulin"),
                "bmi": prediction_data.get("bmi"),
                "diabetes_pedigree": prediction_data.get("diabetesPedigree"),
                "age": prediction_data.get("age"),
                "risk_level": prediction_data.get("risk"),
                "risk_message": prediction_data.get("message"),
                "probabilities": prediction_data.get("probabilities", {}),
                "predicted_class": prediction_data.get("predicted_class"),
                "model_accuracy": prediction_data.get("model_accuracy"),
                "response_time_ms": prediction_data.get("response_time_ms"),
                "created_at": datetime.now(timezone.utc)
            }
            
            result = self.predictions.insert_one(prediction)
            prediction['_id'] = result.inserted_id
            
            return prediction
            
        except Exception as e:
            raise Exception(f"Failed to save prediction: {str(e)}")
    
    def get_user_predictions(self, user_id: str, limit: int = 50, skip: int = 0) -> list:
        """Get user's prediction history"""
        try:
            predictions = list(
                self.predictions.find({"user_id": ObjectId(user_id)})
                .sort("created_at", -1)
                .skip(skip)
                .limit(limit)
            )
            
            # Convert ObjectId to string for JSON serialization
            for pred in predictions:
                pred['_id'] = str(pred['_id'])
                pred['user_id'] = str(pred['user_id'])
            
            return predictions
            
        except Exception as e:
            raise Exception(f"Failed to get predictions: {str(e)}")
    
    def get_prediction_stats(self, user_id: str) -> dict:
        """Get user's prediction statistics"""
        try:
            pipeline = [
                {"$match": {"user_id": ObjectId(user_id)}},
                {
                    "$group": {
                        "_id": "$risk_level",
                        "count": {"$sum": 1},
                        "latest": {"$max": "$created_at"}
                    }
                }
            ]
            
            results = list(self.predictions.aggregate(pipeline))
            
            stats = {
                "total_predictions": sum(r["count"] for r in results),
                "risk_distribution": {r["_id"]: r["count"] for r in results},
                "latest_prediction": max((r["latest"] for r in results), default=None)
            }
            
            return stats
            
        except Exception as e:
            raise Exception(f"Failed to get prediction stats: {str(e)}")

# Global instances
mongodb = MongoDB()
user_repo = UserRepository()
prediction_repo = PredictionRepository()