import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts';
import { Calendar, TrendingUp, Search, AlertCircle, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Navbar from '../components/Navbar';

interface Prediction {
  _id: string;
  features: {
    pregnancies: number;
    glucose: number;
    blood_pressure: number;
    skin_thickness: number;
    insulin: number;
    bmi: number;
    diabetes_pedigree: number;
    age: number;
  };
  prediction: number;
  probability: number;
  risk_level: string;
  created_at: string;
}

export function DashboardPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('glucopredict_token');
      const response = await axios.get('http://localhost:8000/predictions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPredictions(response.data.predictions || []);
    } catch (error) {
      console.error('Failed to load predictions:', error);
      toast.error('Failed to load predictions');
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'moderate':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getRiskBadgeClass = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'moderate':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const filteredPredictions = predictions.filter((pred) => {
    const matchesSearch = pred.risk_level.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterClass === 'all' || pred.risk_level.toLowerCase() === filterClass.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Past Predictions</h1>
              <p className="text-gray-600">Track your diabetes risk assessment history</p>
            </div>
            <Link to="/predict-input">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Predict Again
              </motion.button>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search predictions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="moderate">Moderate Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
          ) : filteredPredictions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-12 text-center"
            >
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No predictions yet</h3>
              <p className="text-gray-600 mb-6">Start by making your first diabetes risk prediction</p>
              <Link to="/predict-input">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Make Prediction
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredPredictions.map((prediction, index) => (
                <motion.div
                  key={prediction._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      {getRiskIcon(prediction.risk_level)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRiskBadgeClass(prediction.risk_level)}`}>
                            {prediction.risk_level}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(prediction.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">BMI</p>
                        <p className="text-lg font-semibold text-gray-900">{prediction.features.bmi.toFixed(1)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Glucose</p>
                        <p className="text-lg font-semibold text-gray-900">{prediction.features.glucose}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Age</p>
                        <p className="text-lg font-semibold text-gray-900">{prediction.features.age}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Probability</p>
                        <p className="text-lg font-semibold text-gray-900">{(prediction.probability * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
