import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2, Activity, ArrowLeft, Sparkles } from 'lucide-react';
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
  const [result, setResult] = useState<PredictionResult | null>(null);

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
    setResult(null);

    try {
      const requestData = {
        pregnancies: parseFloat(formData.pregnancies),
        glucose: parseFloat(formData.glucose),
        bloodPressure: parseFloat(formData.bloodPressure),
        skinThickness: parseFloat(formData.skinThickness),
        insulin: parseFloat(formData.insulin),
        bmi: parseFloat(formData.bmi),
        diabetesPedigree: parseFloat(formData.diabetesPedigree),
        age: parseFloat(formData.age),
      };

      const response = await fetch('YOUR_RENDER_BACKEND_URL/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const prediction: PredictionResult = await response.json();
      setResult(prediction);
      toast.success('Prediction completed!');
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Backend not available. Please deploy the Flask backend to Render/Railway to enable predictions.');
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

          {result && (
            <div className="mt-10 animate-scale-in">
              <div className={`relative overflow-hidden p-8 rounded-2xl border-2 ${
                result.risk === 'high'
                  ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
                  : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
              }`}>
                <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                  <Activity className="w-full h-full" />
                </div>

                <div className="relative">
                  <div className="flex items-start space-x-6">
                    <div className={`flex-shrink-0 p-4 rounded-2xl ${
                      result.risk === 'high' ? 'bg-red-100' :
                      result.risk === 'borderline' ? 'bg-yellow-100' : 'bg-green-100'
                    } shadow-lg`}>
                      {result.risk === 'high' ? (
                        <AlertCircle className="w-12 h-12 text-red-600" />
                      ) : result.risk === 'borderline' ? (
                        <Activity className="w-12 h-12 text-yellow-600" />
                      ) : (
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className={`text-3xl font-bold mb-2 ${
                        result.risk === 'high' ? 'text-red-800' :
                        result.risk === 'borderline' ? 'text-yellow-800' : 'text-green-800'
                      }`}>
                        {result.message}
                      </h3>
                      <p className={`text-lg mb-4 ${
                        result.risk === 'high' ? 'text-red-700' :
                        result.risk === 'borderline' ? 'text-yellow-700' : 'text-green-700'
                      }`}>
                        {result.risk === 'high'
                          ? 'Our analysis indicates elevated diabetes risk factors. Please consult with a healthcare professional for proper diagnosis and treatment.'
                          : result.risk === 'borderline'
                          ? 'Your results suggest pre-diabetic or borderline conditions. Consider lifestyle changes and regular monitoring with a healthcare professional.'
                          : 'Great news! Your current health metrics show a low diabetes risk. Continue maintaining a healthy lifestyle with proper diet and exercise.'}
                      </p>

                      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                        result.risk === 'high' ? 'bg-red-100' :
                        result.risk === 'borderline' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        <Activity className={`w-4 h-4 ${
                          result.risk === 'high' ? 'text-red-600' :
                          result.risk === 'borderline' ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                        <span className={`font-semibold ${
                          result.risk === 'high' ? 'text-red-700' :
                          result.risk === 'borderline' ? 'text-yellow-700' : 'text-green-700'
                        }`}>
                          Model Accuracy: {result.model_accuracy}% | Response Time: {result.response_time_ms}ms
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Probability breakdown */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Prediction Probabilities:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Normal:</span>
                        <span className="font-mono">{(result.probabilities.normal * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Borderline:</span>
                        <span className="font-mono">{(result.probabilities.borderline * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>High Risk:</span>
                        <span className="font-mono">{(result.probabilities.high * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Recommended Next Steps:</h4>
                    <ul className="space-y-2">
                      {result.risk === 'high' ? (
                        <>
                          <li className="flex items-center space-x-2 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-red-500" />
                            <span>Schedule an appointment with your healthcare provider</span>
                          </li>
                          <li className="flex items-center space-x-2 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-red-500" />
                            <span>Monitor your blood glucose levels regularly</span>
                          </li>
                          <li className="flex items-center space-x-2 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-red-500" />
                            <span>Consider lifestyle modifications and dietary changes</span>
                          </li>
                        </>
                      ) : result.risk === 'borderline' ? (
                        <>
                          <li className="flex items-center space-x-2 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                            <span>Consult with a healthcare professional for proper assessment</span>
                          </li>
                          <li className="flex items-center space-x-2 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                            <span>Consider lifestyle changes: diet, exercise, and weight management</span>
                          </li>
                          <li className="flex items-center space-x-2 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                            <span>Regular monitoring of blood glucose levels</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center space-x-2 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span>Continue regular health checkups and screenings</span>
                          </li>
                          <li className="flex items-center space-x-2 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span>Maintain a balanced diet and regular exercise routine</span>
                          </li>
                          <li className="flex items-center space-x-2 text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span>Keep tracking your health metrics over time</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This is a risk assessment tool and should not replace professional medical advice.
            Always consult with a healthcare provider for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
}
