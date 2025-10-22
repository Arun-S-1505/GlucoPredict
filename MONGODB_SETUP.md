# 🍃 MongoDB Atlas Setup Guide for GlucoPredict

## 📋 Quick Setup Steps

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Verify your email

### 2. Create a Cluster

1. Click "Create a New Cluster"
2. Choose **FREE** shared cluster
3. Select a cloud provider (AWS recommended)
4. Choose a region close to your users
5. Give your cluster a name (e.g., "GlucoPredict")
6. Click "Create Cluster" (takes 3-5 minutes)

### 3. Create Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and password (save these!)
5. Set role to "Atlas Admin" or "Read and write to any database"
6. Click "Add User"

### 4. Setup Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's specific IP
5. Click "Confirm"

### 5. Get Connection String

1. Go to "Database" and click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Python" and version "3.12 or later"
4. Copy the connection string (looks like mongodb+srv://...)

### 6. Configure Your Application

1. Open `backend/.env` file
2. Replace the MONGODB_URI with your connection string
3. Replace `<username>` and `<password>` with your database user credentials
4. Replace `<database>` with `glucopredict`

Example:

```
MONGODB_URI=mongodb+srv://myuser:mypassword@glucopredict.abc123.mongodb.net/glucopredict?retryWrites=true&w=majority
```

### 7. Update JWT Secret

1. Generate a secure JWT secret:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
2. Replace JWT_SECRET in `.env` with the generated value

### 8. Test Connection

Run the backend server to test the connection:

```bash
cd backend
python main.py
```

Look for these success messages:

- ✅ Connected to MongoDB Atlas
- 🚀 Starting GlucoPredict API server...

## 🗄️ Database Structure

### Users Collection

```javascript
{
  "_id": ObjectId,
  "email": "user@example.com",
  "password": "hashed_password",
  "name": "John Doe",
  "created_at": ISODate,
  "last_login": ISODate,
  "is_active": true
}
```

### Predictions Collection

```javascript
{
  "_id": ObjectId,
  "user_id": ObjectId, // Reference to users collection
  "features": {
    "pregnancies": 1,
    "glucose": 120,
    "blood_pressure": 80,
    "skin_thickness": 20,
    "insulin": 79,
    "bmi": 25.5,
    "diabetes_pedigree": 0.5,
    "age": 30
  },
  "prediction": 0, // 0 = No Diabetes, 1 = Diabetes
  "probability": 0.15,
  "risk_level": "Low",
  "created_at": ISODate,
  "model_version": "v1.0"
}
```

## 🔧 Troubleshooting

### Common Issues:

**Connection Timeout**

- Check if your IP is whitelisted in Network Access
- Verify username/password in connection string

**Authentication Failed**

- Double-check database user credentials
- Ensure user has proper permissions

**DNS Resolution Error**

- Check internet connection
- Verify cluster URL is correct

**Import Error: pymongo**

- Install required packages: `pip install -r requirements.txt`

### Test Endpoints:

1. **Health Check**: `GET http://localhost:8000/health`
2. **Register User**: `POST http://localhost:8000/auth/register`
3. **Login**: `POST http://localhost:8000/auth/login`
4. **Make Prediction**: `POST http://localhost:8000/predict`

## 🚀 Production Deployment

For production deployment:

1. **Security**:

   - Use specific IP whitelist instead of 0.0.0.0/0
   - Use strong, unique JWT secret
   - Enable MongoDB Atlas backup

2. **Environment**:

   - Set `DEBUG=False`
   - Use production CORS origins
   - Configure proper logging

3. **Monitoring**:
   - Enable MongoDB Atlas monitoring
   - Set up alerts for connection issues
   - Monitor database performance metrics

## 📊 Database Management

### Useful MongoDB Compass Queries:

**Find all users:**

```javascript
{
}
```

**Find predictions for a user:**

```javascript
{"user_id": ObjectId("user_id_here")}
```

**Find high-risk predictions:**

```javascript
{"risk_level": "High"}
```

**Get prediction statistics:**

```javascript
[
  {
    $group: {
      _id: "$prediction",
      count: { $sum: 1 },
    },
  },
];
```

## 🔑 Environment Variables Reference

| Variable       | Description               | Example                 |
| -------------- | ------------------------- | ----------------------- |
| `MONGODB_URI`  | MongoDB connection string | `mongodb+srv://...`     |
| `JWT_SECRET`   | Secret key for JWT tokens | `abc123xyz...`          |
| `DB_NAME`      | Database name             | `glucopredict`          |
| `DEBUG`        | Enable debug mode         | `True/False`            |
| `CORS_ORIGINS` | Allowed frontend URLs     | `http://localhost:5173` |

---

✅ **Once configured, your app will automatically:**

- Store new users in MongoDB Atlas
- Save all predictions with user history
- Enable login/logout functionality
- Provide prediction analytics
- Maintain data persistence across deployments
