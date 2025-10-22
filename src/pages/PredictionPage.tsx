import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface FormData {
  pregnancies: string;
  glucose: string;
  bloodPressure: string;
  skinThickness: string;
  insulin: string;
  bmi: string;
  diabetesPedigree: string;
  age: string;
}

interface PredictionResult {
  risk: 'normal' | 'borderline' | 'high';
  message: string;
  probabilities: {
    normal: number;
    borderline: number;
    high: number;
  };
  predicted_class: number;
  model_accuracy: number;
  response_time_ms: number;
}

export default function PredictionPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    pregnancies: '',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    diabetesPedigree: '',
    age: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const values = Object.values(formData);

    if (values.some(val => val === '')) {
      toast.error('Please fill all fields');
      return false;
    }

    const numericValues = values.map(val => parseFloat(val));
    if (numericValues.some(val => isNaN(val) || val < 0)) {
      toast.error('Please enter valid positive numbers');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const requestData = {
        pregnancies: parseFloat(formData.pregnancies),
        glucose: parseFloat(formData.glucose),
        blood_pressure: parseFloat(formData.bloodPressure),
        skin_thickness: parseFloat(formData.skinThickness),
        insulin: parseFloat(formData.insulin),
        bmi: parseFloat(formData.bmi),
        diabetes_pedigree: parseFloat(formData.diabetesPedigree),
        age: parseFloat(formData.age),
      };

      // Try configured API URL first, fallback to localhost for development
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const endpoint = `${apiUrl}/predict/public`;

      let prediction: PredictionResult | null = null;
      let predictionId: string | undefined = undefined;

      try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });

          if (response.ok) {
            const data = await response.json();
            
            // Handle new backend response format
            if (data.prediction !== undefined) {
              prediction = {
                risk: data.prediction === 1 ? 'high' : (data.probability > 0.5 ? 'borderline' : 'normal'),
                message: data.prediction === 1 
                  ? 'High risk of diabetes detected' 
                  : 'Low risk of diabetes',
                probabilities: {
                  normal: data.prediction === 0 ? (1 - data.probability) : data.probability,
                  borderline: 0.1,
                  high: data.prediction === 1 ? data.probability : (1 - data.probability)
                },
                predicted_class: data.prediction,
                model_accuracy: data.model_accuracy || 86.4,
                response_time_ms: data.response_time_ms || 0
              };
              predictionId = data.prediction_id;
            } else {
              // Fallback to old format
              prediction = data;
            }
          } else {
            throw new Error('Prediction request failed');
          }

          toast.success('Prediction completed!');
          
          // Navigate to results page with the prediction data
          navigate('/results', { 
            state: { 
              result: prediction,
              formData: formData,
              predictionId: predictionId
            } 
          });
      } catch (error) {
        console.error('Prediction error:', error);
        toast.error('Unable to connect to prediction service. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

  const inputFields = [
    { name: 'pregnancies', label: 'Pregnancies', placeholder: 'Number of pregnancies', step: '1' },
    { name: 'glucose', label: 'Glucose Level (mg/dL)', placeholder: 'Plasma glucose concentration', step: '1' },
    { name: 'bloodPressure', label: 'Blood Pressure (mm Hg)', placeholder: 'Diastolic blood pressure', step: '1' },
    { name: 'skinThickness', label: 'Skin Thickness (mm)', placeholder: 'Triceps skin fold thickness', step: '1' },
    { name: 'insulin', label: 'Insulin (mu U/ml)', placeholder: '2-Hour serum insulin', step: '1' },
    { name: 'bmi', label: 'BMI', placeholder: 'Body mass index', step: '0.1' },
    { name: 'diabetesPedigree', label: 'Diabetes Pedigree Function', placeholder: 'Diabetes pedigree function', step: '0.001' },
    { name: 'age', label: 'Age', placeholder: 'Age in years', step: '1' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="group inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Health Risk Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your health information below for an accurate diabetes risk prediction
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 animate-fade-in-up animation-delay-300">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputFields.map((field, index) => (
                <div
                  key={field.name}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50 + 400}ms` }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    name={field.name}
                    value={formData[field.name as keyof FormData]}
                    onChange={handleChange}
                    step={field.step}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                    placeholder={field.placeholder}
                    min="0"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-gradient-x"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Analyzing Your Health Data...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Prediction</span>
                </span>
              )}
            </button>
          </form>


        </div>

        <div className="mt-8 text-center px-4">
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            This is a risk assessment tool and should not replace professional medical advice.
            Always consult with a healthcare provider for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
}
