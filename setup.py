#!/usr/bin/env python3
"""
GlucoPredict MongoDB Atlas Integration Setup Script
This script helps set up the complete environment for GlucoPredict
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def run_command(command, description="", ignore_errors=False):
    """Run a shell command and return success status"""
    print(f"🔄 {description}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        if result.stdout.strip():
            print(f"✅ {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        if not ignore_errors:
            print(f"❌ Error: {e}")
            if e.stderr:
                print(f"   {e.stderr.strip()}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} is not compatible. Need Python 3.8+")
        return False

def check_node_version():
    """Check if Node.js is installed"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True, check=True)
        version = result.stdout.strip()
        print(f"✅ Node.js {version} is installed")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Node.js is not installed or not in PATH")
        print("📥 Please install Node.js from https://nodejs.org/")
        return False

def setup_backend():
    """Set up the backend environment"""
    print("\n🔧 Setting up Backend Environment...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return False
    
    os.chdir(backend_dir)
    
    # Install Python packages
    if not run_command("pip install -r requirements.txt", "Installing Python packages"):
        return False
    
    # Check if .env file exists
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  .env file not found. Please configure your MongoDB Atlas connection.")
        print("📖 See MONGODB_SETUP.md for detailed instructions.")
        return False
    
    print("✅ Backend setup complete")
    os.chdir("..")
    return True

def setup_frontend():
    """Set up the frontend environment"""
    print("\n🎨 Setting up Frontend Environment...")
    
    # Check if package.json exists
    if not Path("package.json").exists():
        print("❌ package.json not found in current directory")
        return False
    
    # Install dependencies
    if not run_command("npm install", "Installing Node.js packages"):
        return False
    
    print("✅ Frontend setup complete")
    return True

def test_backend():
    """Test the backend setup"""
    print("\n🧪 Testing Backend Setup...")
    
    backend_dir = Path("backend")
    os.chdir(backend_dir)
    
    # Test MongoDB connection
    if Path("test_mongodb.py").exists():
        success = run_command("python test_mongodb.py", "Testing MongoDB connection", ignore_errors=True)
        if success:
            print("✅ MongoDB connection test passed")
        else:
            print("⚠️  MongoDB connection test failed. Check your .env configuration.")
    
    os.chdir("..")
    return True

def create_startup_scripts():
    """Create convenient startup scripts"""
    print("\n📜 Creating startup scripts...")
    
    # Backend startup script
    backend_script = """#!/bin/bash
# Start GlucoPredict Backend
echo "🚀 Starting GlucoPredict Backend..."
cd backend
python main.py
"""
    
    with open("start_backend.sh", "w") as f:
        f.write(backend_script)
    
    # Windows batch file
    backend_batch = """@echo off
echo 🚀 Starting GlucoPredict Backend...
cd backend
python main.py
pause
"""
    
    with open("start_backend.bat", "w") as f:
        f.write(backend_batch)
    
    # Frontend startup script
    frontend_script = """#!/bin/bash
# Start GlucoPredict Frontend
echo "🎨 Starting GlucoPredict Frontend..."
npm run dev
"""
    
    with open("start_frontend.sh", "w") as f:
        f.write(frontend_script)
    
    # Windows batch file
    frontend_batch = """@echo off
echo 🎨 Starting GlucoPredict Frontend...
npm run dev
pause
"""
    
    with open("start_frontend.bat", "w") as f:
        f.write(frontend_batch)
    
    print("✅ Startup scripts created")
    print("   - start_backend.bat (Windows) / start_backend.sh (Linux/Mac)")
    print("   - start_frontend.bat (Windows) / start_frontend.sh (Linux/Mac)")

def display_next_steps():
    """Display next steps for the user"""
    print("\n" + "=" * 60)
    print("🎉 Setup Complete! Next Steps:")
    print("=" * 60)
    
    print("\n1️⃣  Configure MongoDB Atlas:")
    print("   📖 Follow MONGODB_SETUP.md for detailed instructions")
    print("   🔧 Update backend/.env with your MongoDB connection string")
    
    print("\n2️⃣  Start the Backend:")
    print("   💻 Windows: double-click start_backend.bat")
    print("   🐧 Linux/Mac: ./start_backend.sh")
    print("   📡 Backend will run on http://localhost:8000")
    
    print("\n3️⃣  Start the Frontend:")
    print("   💻 Windows: double-click start_frontend.bat")
    print("   🐧 Linux/Mac: ./start_frontend.sh")
    print("   🌐 Frontend will run on http://localhost:5173")
    
    print("\n4️⃣  Test the Application:")
    print("   🧪 Run backend/test_api.py to test all endpoints")
    print("   🌐 Open http://localhost:5173 in your browser")
    print("   👤 Try registering a new user and making predictions")
    
    print("\n5️⃣  Deploy to Production:")
    print("   🚀 Backend: Deploy to Render/Railway/Heroku")
    print("   🌍 Frontend: Deploy to Vercel/Netlify")
    print("   🔒 Update CORS origins and environment variables")
    
    print("\n📚 Documentation:")
    print("   📋 API Endpoints: See backend/test_api.py")
    print("   🗄️  Database Schema: See MONGODB_SETUP.md")
    print("   🔧 Troubleshooting: See MONGODB_SETUP.md")

def main():
    """Main setup function"""
    print("🍃 GlucoPredict MongoDB Atlas Integration Setup")
    print("=" * 50)
    
    # Check prerequisites
    print("\n🔍 Checking Prerequisites...")
    if not check_python_version():
        return
    
    if not check_node_version():
        return
    
    # Setup backend
    backend_success = setup_backend()
    
    # Setup frontend
    frontend_success = setup_frontend()
    
    # Test backend if setup was successful
    if backend_success:
        test_backend()
    
    # Create startup scripts
    create_startup_scripts()
    
    # Display next steps
    display_next_steps()
    
    if backend_success and frontend_success:
        print("\n✨ Setup completed successfully!")
    else:
        print("\n⚠️  Setup completed with some issues. Please check the errors above.")

if __name__ == "__main__":
    main()