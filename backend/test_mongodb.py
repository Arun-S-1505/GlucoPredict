#!/usr/bin/env python3
"""
MongoDB Atlas Connection Test Script
Run this script to verify your MongoDB Atlas setup
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_mongodb_connection():
    """Test MongoDB Atlas connection"""
    try:
        from pymongo import MongoClient
        from pymongo.server_api import ServerApi
        
        # Get MongoDB URI from environment
        mongodb_uri = os.getenv('MONGODB_URI')
        if not mongodb_uri:
            print("❌ MONGODB_URI not found in environment variables")
            print("📝 Please check your .env file")
            return False
        
        print("🔄 Testing MongoDB Atlas connection...")
        print(f"🌐 URI: {mongodb_uri[:20]}...")
        
        # Create MongoDB client
        client = MongoClient(mongodb_uri, server_api=ServerApi('1'))
        
        # Test connection
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
        
        # Get database info
        db_name = os.getenv('DB_NAME', 'glucopredict')
        db = client[db_name]
        
        print(f"📊 Database: {db_name}")
        print(f"📁 Collections: {db.list_collection_names()}")
        
        # Test collections
        users_collection = db.users
        predictions_collection = db.predictions
        
        # Get collection stats
        user_count = users_collection.count_documents({})
        prediction_count = predictions_collection.count_documents({})
        
        print(f"👥 Users: {user_count}")
        print(f"🔮 Predictions: {prediction_count}")
        
        client.close()
        return True
        
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("🔧 Install required packages: pip install -r requirements.txt")
        return False
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\n🛠️  Troubleshooting:")
        print("1. Check your MONGODB_URI in .env file")
        print("2. Verify your MongoDB Atlas credentials")
        print("3. Ensure your IP is whitelisted")
        print("4. Check if cluster is running")
        return False

def test_environment_variables():
    """Test if all required environment variables are set"""
    required_vars = [
        'MONGODB_URI',
        'JWT_SECRET',
        'DB_NAME',
    ]
    
    print("\n🔍 Checking environment variables...")
    missing_vars = []
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"✅ {var}: {'*' * min(len(value), 10)}...")
        else:
            print(f"❌ {var}: Not set")
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n⚠️  Missing variables: {', '.join(missing_vars)}")
        return False
    
    print("✅ All required environment variables are set!")
    return True

def test_dependencies():
    """Test if all required Python packages are installed"""
    required_packages = [
        'pymongo',
        'flask',
        'flask_cors',
        'bcrypt',
        'jwt',
        'dotenv',
        'email_validator'
    ]
    
    print("\n📦 Checking required packages...")
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package}: Not installed")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        print("🔧 Install with: pip install -r requirements.txt")
        return False
    
    print("✅ All required packages are installed!")
    return True

def main():
    """Run all tests"""
    print("🧪 GlucoPredict MongoDB Atlas Integration Test")
    print("=" * 50)
    
    # Test 1: Environment Variables
    env_ok = test_environment_variables()
    
    # Test 2: Dependencies
    deps_ok = test_dependencies()
    
    # Test 3: MongoDB Connection (only if env vars are OK)
    if env_ok and deps_ok:
        mongo_ok = test_mongodb_connection()
    else:
        mongo_ok = False
        print("\n⏭️  Skipping MongoDB connection test (fix issues above first)")
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 Test Summary:")
    print(f"   Environment Variables: {'✅' if env_ok else '❌'}")
    print(f"   Dependencies: {'✅' if deps_ok else '❌'}")
    print(f"   MongoDB Connection: {'✅' if mongo_ok else '❌'}")
    
    if env_ok and deps_ok and mongo_ok:
        print("\n🎉 All tests passed! Your MongoDB Atlas integration is ready!")
        print("\n🚀 Next steps:")
        print("   1. Start your backend: python main.py")
        print("   2. Test the API endpoints")
        print("   3. Connect your frontend")
    else:
        print("\n🔧 Please fix the issues above and run the test again.")
        print("📖 See MONGODB_SETUP.md for detailed instructions.")

if __name__ == "__main__":
    main()