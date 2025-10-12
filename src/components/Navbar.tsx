import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    navigate('/');
    setTimeout(() => scrollToTop(), 100);
  };

  const handlePredictionClick = () => {
    navigate('/prediction');
    setTimeout(() => scrollToTop(), 100);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={handleHomeClick}
            className="flex items-center space-x-2 group"
          >
            <Activity className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Diabetes Predictor</span>
          </button>

          <div className="hidden md:flex space-x-8">
            <button
              onClick={handleHomeClick}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={handlePredictionClick}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium relative group"
            >
              Prediction
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
