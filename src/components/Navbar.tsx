import { Activity, Menu, X, User, LogOut, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleSignup = () => {
    navigate('/signup');
    setIsMenuOpen(false);
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={handleHomeClick}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={handlePredictionClick}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium relative group"
            >
              Prediction
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </button>

            {/* Authentication Section */}
            <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
              {user ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDashboard}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLogin}
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignup}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  handleHomeClick();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => {
                  scrollToSection('features');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
              >
                Features
              </button>
              <button
                onClick={() => {
                  handlePredictionClick();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
              >
                Prediction
              </button>
              
              {/* Mobile Authentication Section */}
              <div className="border-t border-gray-200 mt-2 pt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md mb-1">
                      Welcome, {user.name}
                    </div>
                    <button
                      onClick={handleDashboard}
                      className="flex items-center space-x-2 w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleSignup}
                      className="block w-full text-left px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors duration-200 font-medium mt-1"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
