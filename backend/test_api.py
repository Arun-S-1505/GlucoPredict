import requests
import json

url = 'http://127.0.0.1:8000/predict'
data = {
    'pregnancies': 2,
    'glucose': 120,
    'bloodPressure': 70,
    'skinThickness': 25,
    'insulin': 80,
    'bmi': 25.0,
    'diabetesPedigree': 0.5,
    'age': 30
}

try:
    response = requests.post(url, json=data)
    print('Status Code:', response.status_code)
    print('Response:', response.json())
except Exception as e:
    print('Error:', e)