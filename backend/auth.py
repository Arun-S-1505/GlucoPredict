import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify, current_app
from database import user_repo
import os
from dotenv import load_dotenv

load_dotenv()

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

def generate_token(user_id: str, email: str) -> str:
    """Generate a JWT token for user authentication"""
    try:
        payload = {
            'user_id': user_id,
            'email': email,
            'exp': datetime.now(timezone.utc) + timedelta(
                hours=int(os.getenv('JWT_EXPIRATION_HOURS', 24))
            ),
            'iat': datetime.now(timezone.utc)
        }
        
        token = jwt.encode(
            payload,
            os.getenv('JWT_SECRET', 'fallback-secret'),
            algorithm='HS256'
        )
        
        return token
    except Exception as e:
        raise Exception(f"Failed to generate token: {str(e)}")

def verify_token(token: str) -> dict:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(
            token,
            os.getenv('JWT_SECRET', 'fallback-secret'),
            algorithms=['HS256']
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")

def require_auth(f):
    """Decorator to require authentication for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Check for token in Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Authentication token is missing'}), 401
        
        try:
            # Verify token
            payload = verify_token(token)
            
            # Get user from database
            user = user_repo.get_user_by_id(payload['user_id'])
            if not user:
                return jsonify({'error': 'User not found'}), 401
            
            if not user.get('is_active', True):
                return jsonify({'error': 'Account is deactivated'}), 401
            
            # Add user info to request context
            request.current_user = user
            
        except Exception as e:
            return jsonify({'error': f'Token verification failed: {str(e)}'}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

def validate_email(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> tuple[bool, str]:
    """Validate password strength"""
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    
    if len(password) > 128:
        return False, "Password must be less than 128 characters"
    
    # Check for at least one letter and one number
    has_letter = any(c.isalpha() for c in password)
    has_number = any(c.isdigit() for c in password)
    
    if not (has_letter and has_number):
        return False, "Password must contain at least one letter and one number"
    
    return True, "Password is valid"