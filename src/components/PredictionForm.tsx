import { useState } from 'react';
import { Loader2, AlertCircle, CheckCircle2, Activity } from 'lucide-react';
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
}

export default function PredictionForm() {
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

      const response = await fetch('http://127.0.0.1:8000/predict', {
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
      toast.error('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="prediction" className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Enter Your Health Information
          </h2>
          <p className="text-lg text-gray-600">
            Fill in your details accurately for the best prediction
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pregnancies
                </label>
                <input
                  type="number"
                  name="pregnancies"
                  value={formData.pregnancies}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Number of pregnancies"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Glucose Level (mg/dL)
                </label>
                <input
                  type="number"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Plasma glucose concentration"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure (mm Hg)
                </label>
                <input
                  type="number"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Diastolic blood pressure"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skin Thickness (mm)
                </label>
                <input
                  type="number"
                  name="skinThickness"
                  value={formData.skinThickness}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Triceps skin fold thickness"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insulin (mu U/ml)
                </label>
                <input
                  type="number"
                  name="insulin"
                  value={formData.insulin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="2-Hour serum insulin"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BMI
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="bmi"
                  value={formData.bmi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Body mass index"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diabetes Pedigree Function
                </label>
                <input
                  type="number"
                  step="0.001"
                  name="diabetesPedigree"
                  value={formData.diabetesPedigree}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Diabetes pedigree function"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Age in years"
                  min="0"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </span>
              ) : (
                'Predict'
              )}
            </button>
          </form>

          {result && (
            <div className={`mt-8 p-6 rounded-xl border-2 ${
              result.risk === 'high'
                ? 'bg-red-50 border-red-200'
                : result.risk === 'borderline'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-green-50 border-green-200'
            } animate-fade-in`}>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${
                  result.risk === 'high' ? 'bg-red-100' :
                  result.risk === 'borderline' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  {result.risk === 'high' ? (
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  ) : result.risk === 'borderline' ? (
                    <Activity className="w-8 h-8 text-yellow-600" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold ${
                    result.risk === 'high' ? 'text-red-800' :
                    result.risk === 'borderline' ? 'text-yellow-800' : 'text-green-800'
                  }`}>
                    {result.message}
                  </h3>
                  <p className={`mt-1 ${
                    result.risk === 'high' ? 'text-red-600' :
                    result.risk === 'borderline' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {result.risk === 'high'
                      ? 'Please consult with a healthcare professional for proper diagnosis and treatment.'
                      : result.risk === 'borderline'
                      ? 'Consider lifestyle changes and regular monitoring. Consult a healthcare professional for guidance.'
                      : 'Keep maintaining a healthy lifestyle with proper diet and exercise.'}
                  </p>

                  {/* Probability breakdown */}
                  <div className="mt-4 p-3 bg-white/50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Risk Probabilities:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Normal:</span>
                        <span className="font-mono">{(result.probabilities.normal * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Borderline/Pre-diabetic:</span>
                        <span className="font-mono">{(result.probabilities.borderline * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Diabetic:</span>
                        <span className="font-mono">{(result.probabilities.high * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Activity className={`w-12 h-12 ${
                  result.risk === 'high' ? 'text-red-400' :
                  result.risk === 'borderline' ? 'text-yellow-400' : 'text-green-400'
                } animate-pulse`} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
