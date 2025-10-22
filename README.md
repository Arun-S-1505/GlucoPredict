# 🩺 GlucoPredict - Advanced Diabetes Risk Assessment

A comprehensive full-stack web application for diabetes risk assessment using machine learning with integrated user management and prediction history storage via MongoDB Atlas.

## 🚀 Features

- **3-Class Risk Classification**: Advanced ML model that predicts Normal, Borderline (Pre-diabetic), or High Risk
- **Medical Accuracy**: Based on ADA (American Diabetes Association) glucose thresholds
- **Real-time Predictions**: Fast API responses with detailed probability breakdowns
- **Modern UI**: Clean, responsive React interface with Tailwind CSS
- **RESTful API**: Flask backend with proper CORS support

## 🏗️ Architecture

### Frontend (Development/Production)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Runtime**: Browsers only (no server-side Node.js needed)

### Backend (Runtime)
- **Flask** REST API (Python)
- **TensorFlow** ML model (Python)
- **Scikit-learn** for preprocessing (Python)
- **Runtime**: Python 3.8+ required

### Machine Learning
- **3-Class Neural Network**: Trained on Pima Indians Diabetes Dataset
- **Accuracy**: 86.4% on test data
- **Features**: 8 health metrics (Pregnancies, Glucose, Blood Pressure, Skin Thickness, Insulin, BMI, Diabetes Pedigree, Age)

## 📊 Model Performance

| Class | Description | Typical Glucose Range |
|-------|-------------|----------------------|
| Normal | Low Risk | < 100 mg/dL |
| Borderline | Moderate Risk (Pre-diabetic) | 100-125 mg/dL |
| High | High Risk | ≥ 126 mg/dL |

## 🛠️ Installation & Setup

### Prerequisites
- **Python (v3.8+)** - Required for running the Flask backend and ML model
- **Node.js (v16+)** - Required for building the React frontend (development only)
- **Git** - For cloning the repository

### Quick Start
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/glucopredict.git
cd glucopredict

# Start Backend (Python/Flask)
cd backend
pip install -r requirements.txt
python main.py &
# Backend runs on http://localhost:8000

# Start Frontend (React/Vite)
cd ..
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

## 🔧 Usage

1. **Start the backend**: `cd backend && python main.py`
2. **Start the frontend**: `npm run dev`
3. **Open browser**: Navigate to `http://localhost:5173`
4. **Enter health metrics**: Fill the prediction form with your health data
5. **Get prediction**: Receive instant risk assessment with probabilities

### Sample Input
```
Pregnancies: 2
Glucose: 110
Blood Pressure: 75
Skin Thickness: 25
Insulin: 80
BMI: 28.5
Diabetes Pedigree: 0.5
Age: 35
```

### Sample Output
```json
{
  "risk": "borderline",
  "message": "Borderline/Pre-diabetic - Moderate Risk of Diabetes",
  "probabilities": {
    "normal": 0.014,
    "borderline": 0.809,
    "high": 0.178
  },
  "model_accuracy": 86.4
}
```

## 📁 Project Structure

```
glucopredict/
├── backend/                 # Flask API server
│   ├── main.py             # Main API application
│   ├── diabetes_model.h5   # Trained ML model
│   ├── scaler.pkl          # Data preprocessing scaler
│   └── requirements.txt    # Python dependencies
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   └── main.tsx           # App entry point
├── public/                 # Static assets
├── package.json           # Node.js dependencies
├── tsconfig*.json         # TypeScript configurations
└── vite.config.ts         # Build configuration
```

## 🧪 Testing

### Backend API Testing
```bash
cd backend
python -c "
import requests
response = requests.post('http://localhost:8000/predict', json={
    'pregnancies': 2, 'glucose': 110, 'bloodPressure': 75,
    'skinThickness': 25, 'insulin': 80, 'bmi': 28.5,
    'diabetesPedigree': 0.5, 'age': 35
})
print(response.json())
"
```

### Frontend Testing
```bash
npm run build  # Test production build
npm run preview  # Test production build locally
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Disclaimer

This application is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

## 🙏 Acknowledgments

- **Dataset**: Pima Indians Diabetes Database (UCI Machine Learning Repository)
- **Medical Guidelines**: American Diabetes Association (ADA) standards
- **Technologies**: React, Flask, TensorFlow, Tailwind CSS

---

**Built with ❤️ for healthcare education and awareness.**