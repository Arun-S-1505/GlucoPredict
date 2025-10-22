#!/usr/bin/env python3
"""
GlucoPredict API Test Suite
Tests all API endpoints to ensure they work correctly
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:8000"
TEST_USER = {
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpassword123"
}

TEST_PREDICTION_DATA = {
    "pregnancies": 1,
    "glucose": 120,
    "blood_pressure": 80,
    "skin_thickness": 20,
    "insulin": 79,
    "bmi": 25.5,
    "diabetes_pedigree": 0.5,
    "age": 30
}

class APITester:
    def __init__(self):
        self.auth_token = None
        self.test_results = []
    
    def log_test(self, test_name, success, message=""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if message:
            print(f"    📝 {message}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message
        })
    
    def test_health_endpoint(self):
        """Test the health check endpoint"""
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                self.log_test("Health Check", True, f"Server is healthy: {data.get('status')}")
                return True
            else:
                self.log_test("Health Check", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Error: {e}")
            return False
    
    def test_register_endpoint(self):
        """Test user registration"""
        try:
            response = requests.post(
                f"{BASE_URL}/auth/register",
                json=TEST_USER,
                timeout=10
            )
            
            if response.status_code == 201:
                data = response.json()
                self.log_test("User Registration", True, f"User created: {data.get('user', {}).get('email')}")
                return True
            elif response.status_code == 400 and "already exists" in response.text:
                self.log_test("User Registration", True, "User already exists (expected)")
                return True
            else:
                self.log_test("User Registration", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("User Registration", False, f"Error: {e}")
            return False
    
    def test_login_endpoint(self):
        """Test user login"""
        try:
            login_data = {
                "email": TEST_USER["email"],
                "password": TEST_USER["password"]
            }
            
            response = requests.post(
                f"{BASE_URL}/auth/login",
                json=login_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get('token')
                self.log_test("User Login", True, f"Token received: {self.auth_token[:20] if self.auth_token else 'None'}...")
                return True
            else:
                self.log_test("User Login", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("User Login", False, f"Error: {e}")
            return False
    
    def test_profile_endpoint(self):
        """Test getting user profile"""
        if not self.auth_token:
            self.log_test("User Profile", False, "No auth token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.get(
                f"{BASE_URL}/auth/profile",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("User Profile", True, f"Profile retrieved: {data.get('email')}")
                return True
            else:
                self.log_test("User Profile", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("User Profile", False, f"Error: {e}")
            return False
    
    def test_public_prediction(self):
        """Test public prediction endpoint"""
        try:
            response = requests.post(
                f"{BASE_URL}/predict/public",
                json=TEST_PREDICTION_DATA,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                prediction = data.get('prediction')
                probability = data.get('probability')
                self.log_test("Public Prediction", True, f"Prediction: {prediction}, Probability: {probability}")
                return True
            else:
                self.log_test("Public Prediction", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Public Prediction", False, f"Error: {e}")
            return False
    
    def test_authenticated_prediction(self):
        """Test authenticated prediction endpoint"""
        if not self.auth_token:
            self.log_test("Authenticated Prediction", False, "No auth token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.post(
                f"{BASE_URL}/predict",
                json=TEST_PREDICTION_DATA,
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                prediction = data.get('prediction')
                prediction_id = data.get('prediction_id')
                self.log_test("Authenticated Prediction", True, f"Prediction saved with ID: {prediction_id}")
                return True
            else:
                self.log_test("Authenticated Prediction", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Authenticated Prediction", False, f"Error: {e}")
            return False
    
    def test_prediction_history(self):
        """Test getting prediction history"""
        if not self.auth_token:
            self.log_test("Prediction History", False, "No auth token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.get(
                f"{BASE_URL}/predictions",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                count = len(data.get('predictions', []))
                self.log_test("Prediction History", True, f"Found {count} predictions")
                return True
            else:
                self.log_test("Prediction History", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Prediction History", False, f"Error: {e}")
            return False
    
    def test_prediction_stats(self):
        """Test getting prediction statistics"""
        if not self.auth_token:
            self.log_test("Prediction Statistics", False, "No auth token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.get(
                f"{BASE_URL}/predictions/stats",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                stats = data.get('stats', {})
                self.log_test("Prediction Statistics", True, f"Total predictions: {stats.get('total_predictions', 0)}")
                return True
            else:
                self.log_test("Prediction Statistics", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Prediction Statistics", False, f"Error: {e}")
            return False
    
    def run_all_tests(self):
        """Run all API tests"""
        print("🧪 GlucoPredict API Test Suite")
        print("=" * 50)
        
        # Check if server is running
        if not self.test_health_endpoint():
            print("\n❌ Server is not responding. Please start the backend server first:")
            print("   cd backend")
            print("   python main.py")
            return
        
        print("\n🔐 Testing Authentication Endpoints...")
        self.test_register_endpoint()
        self.test_login_endpoint()
        self.test_profile_endpoint()
        
        print("\n🔮 Testing Prediction Endpoints...")
        self.test_public_prediction()
        self.test_authenticated_prediction()
        self.test_prediction_history()
        self.test_prediction_stats()
        
        # Summary
        print("\n" + "=" * 50)
        print("📊 Test Summary:")
        
        passed = sum(1 for test in self.test_results if test["success"])
        total = len(self.test_results)
        
        print(f"   ✅ Passed: {passed}")
        print(f"   ❌ Failed: {total - passed}")
        print(f"   📈 Success Rate: {(passed/total*100):.1f}%")
        
        if passed == total:
            print("\n🎉 All tests passed! Your API is working correctly!")
        else:
            print("\n🔧 Some tests failed. Check the error messages above.")
            print("📖 See MONGODB_SETUP.md for troubleshooting help.")
        
        return passed == total

def main():
    """Main function"""
    tester = APITester()
    
    print("🚀 Starting API tests...")
    print("📡 Make sure your backend server is running on http://localhost:8000")
    print()
    
    # Wait a moment for user to read
    time.sleep(2)
    
    success = tester.run_all_tests()
    
    if success:
        print("\n✨ Your GlucoPredict API is fully functional!")
        print("\n🎯 Next Steps:")
        print("   1. Update your frontend to use these endpoints")
        print("   2. Test the complete user flow")
        print("   3. Deploy to production")
    else:
        print("\n🛠️  Please fix the failing tests and try again.")

if __name__ == "__main__":
    main()