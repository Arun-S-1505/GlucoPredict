import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Activity, ArrowLeft, Heart, Shield, Utensils, Dumbbell, Stethoscope, Calendar, Users, AlertTriangle, Info, Target, TrendingUp, Clock, BookOpen } from 'lucide-react';

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

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { result } = location.state as { result: PredictionResult } || {};

  if (!result) {
    navigate('/prediction');
    return null;
  }

  const getPrecautionaryMeasures = () => {
    switch (result.risk) {
      case 'normal':
        return {
          title: 'Maintain Your Healthy Lifestyle',
          subtitle: 'Keep up the good work! Here\'s how to stay healthy:',
          icon: <CheckCircle2 className="w-8 h-8 text-green-600" />,
          color: 'green',
          sections: [
            {
              title: 'Dietary Guidelines',
              icon: <Utensils className="w-6 h-6" />,
              measures: [
                'Follow a balanced Mediterranean-style diet rich in fruits, vegetables, and whole grains',
                'Limit processed foods, sugary drinks, and excessive refined carbohydrates',
                'Include lean proteins like fish, poultry, legumes, and nuts in your meals',
                'Practice portion control and mindful eating habits',
                'Stay hydrated with 8-10 glasses of water daily',
                'Limit alcohol consumption to moderate levels (1 drink/day for women, 2 for men)',
                'Include fiber-rich foods (25-35g daily) to help maintain stable blood sugar',
                'Choose healthy fats like olive oil, avocados, and omega-3 rich fish'
              ]
            },
            {
              title: 'Physical Activity',
              icon: <Dumbbell className="w-6 h-6" />,
              measures: [
                'Engage in at least 150 minutes of moderate-intensity aerobic activity weekly',
                'Include 2-3 strength training sessions per week targeting major muscle groups',
                'Incorporate flexibility and balance exercises like yoga or tai chi',
                'Take regular walks, especially after meals to help with glucose metabolism',
                'Find activities you enjoy to maintain long-term consistency',
                'Use stairs instead of elevators when possible',
                'Try to reduce sedentary time and take movement breaks every hour',
                'Consider high-intensity interval training (HIIT) 1-2 times per week'
              ]
            },
            {
              title: 'Health Monitoring',
              icon: <Stethoscope className="w-6 h-6" />,
              measures: [
                'Get annual comprehensive health checkups including diabetes screening',
                'Monitor blood pressure regularly (aim for <120/80 mmHg)',
                'Maintain a healthy BMI between 18.5-24.9',
                'Get regular lipid profile tests to monitor cholesterol levels',
                'Schedule eye exams annually to check for any early signs of complications',
                'Practice good dental hygiene and regular dental checkups',
                'Track your weight and waist circumference monthly',
                'Consider wearing a fitness tracker to monitor daily activity levels'
              ]
            },
            {
              title: 'Lifestyle Optimization',
              icon: <Heart className="w-6 h-6" />,
              measures: [
                'Prioritize 7-9 hours of quality sleep each night',
                'Manage stress through meditation, deep breathing, or hobbies',
                'Maintain social connections and engage in community activities',
                'Avoid smoking and limit exposure to secondhand smoke',
                'Practice good hygiene and preventive health measures',
                'Stay up-to-date with vaccinations and preventive screenings',
                'Learn about your family medical history and share with healthcare providers',
                'Consider joining wellness programs or health-focused groups'
              ]
            }
          ]
        };

      case 'borderline':
        return {
          title: 'Pre-Diabetes Management Plan',
          subtitle: 'Take action now to prevent progression to diabetes:',
          icon: <Activity className="w-8 h-8 text-yellow-600" />,
          color: 'yellow',
          sections: [
            {
              title: 'Immediate Dietary Changes',
              icon: <Utensils className="w-6 h-6" />,
              measures: [
                'Adopt a low-glycemic index diet focusing on complex carbohydrates',
                'Eliminate sugary beverages, candy, and processed snacks completely',
                'Use the plate method: 1/2 non-starchy vegetables, 1/4 lean protein, 1/4 complex carbs',
                'Eat smaller, more frequent meals (every 3-4 hours) to stabilize blood sugar',
                'Count carbohydrates and aim for 45-60g per meal for women, 60-75g for men',
                'Include chromium-rich foods like broccoli, grape juice, and whole grains',
                'Add cinnamon to foods as it may help with glucose metabolism',
                'Consider working with a registered dietitian for personalized meal planning'
              ]
            },
            {
              title: 'Enhanced Physical Activity',
              icon: <Dumbbell className="w-6 h-6" />,
              measures: [
                'Increase to 200-300 minutes of moderate aerobic activity per week',
                'Include resistance training 3 times per week to improve insulin sensitivity',
                'Take a 10-15 minute walk after each meal to help glucose uptake',
                'Try interval training which can be particularly effective for glucose control',
                'Include activities that build muscle mass as muscle tissue uses glucose effectively',
                'Consider swimming, cycling, or dancing for variety and sustainability',
                'Use a pedometer and aim for 10,000+ steps daily',
                'Schedule exercise at consistent times to help regulate blood sugar patterns'
              ]
            },
            {
              title: 'Regular Health Monitoring',
              icon: <Calendar className="w-6 h-6" />,
              measures: [
                'Check blood glucose levels as recommended by your healthcare provider',
                'Schedule follow-up appointments every 3-6 months for monitoring',
                'Get HbA1c tests every 3-6 months to track average blood sugar control',
                'Monitor blood pressure weekly as hypertension often accompanies pre-diabetes',
                'Track weight loss progress with a goal of 5-10% body weight reduction',
                'Keep a food and activity diary to identify patterns and triggers',
                'Monitor for symptoms like excessive thirst, frequent urination, or fatigue',
                'Get regular kidney function tests as pre-diabetes can affect kidneys'
              ]
            },
            {
              title: 'Medical Intervention & Support',
              icon: <Stethoscope className="w-6 h-6" />,
              measures: [
                'Consult with an endocrinologist or diabetes educator for specialized care',
                'Discuss metformin therapy with your doctor if lifestyle changes aren\'t enough',
                'Consider participating in a diabetes prevention program (DPP)',
                'Get regular screening for cardiovascular risk factors',
                'Discuss family planning considerations with healthcare provider if applicable',
                'Ask about continuous glucose monitoring if recommended',
                'Ensure all healthcare providers know about your pre-diabetes status',
                'Consider joining a pre-diabetes support group for motivation and tips'
              ]
            },
            {
              title: 'Stress & Sleep Management',
              icon: <Shield className="w-6 h-6" />,
              measures: [
                'Implement stress reduction techniques as stress hormones affect blood sugar',
                'Practice mindfulness meditation or progressive muscle relaxation daily',
                'Establish a consistent sleep schedule with 7-9 hours nightly',
                'Avoid screens 1 hour before bedtime to improve sleep quality',
                'Consider yoga or tai chi which combine physical activity with stress relief',
                'Learn to recognize and manage emotional eating triggers',
                'Seek counseling if dealing with anxiety or depression',
                'Create a relaxing bedtime routine to promote quality sleep'
              ]
            }
          ]
        };

      case 'high':
        return {
          title: 'Diabetes Risk Management Plan',
          subtitle: 'Immediate action required - consult healthcare provider urgently:',
          icon: <AlertCircle className="w-8 h-8 text-red-600" />,
          color: 'red',
          sections: [
            {
              title: 'Urgent Medical Action',
              icon: <AlertTriangle className="w-6 h-6" />,
              measures: [
                'Schedule an appointment with your primary care physician within 1-2 weeks',
                'Request comprehensive diabetes screening tests (fasting glucose, HbA1c, OGTT)',
                'Ask for referral to an endocrinologist for specialized diabetes care',
                'Get immediate cardiovascular risk assessment including lipid profile and EKG',
                'Request kidney function tests (creatinine, BUN, microalbumin)',
                'Schedule comprehensive eye exam with ophthalmologist for diabetic retinopathy screening',
                'Discuss immediate medication options if diabetes is confirmed',
                'Consider continuous glucose monitoring for real-time blood sugar tracking'
              ]
            },
            {
              title: 'Intensive Dietary Management',
              icon: <Utensils className="w-6 h-6" />,
              measures: [
                'Immediately eliminate all sugary foods, drinks, and high-glycemic index foods',
                'Work with a certified diabetes educator or registered dietitian',
                'Follow a strict carbohydrate counting regimen (30-45g per meal initially)',
                'Focus on low-carb, high-fiber foods to minimize blood sugar spikes',
                'Eat at consistent times daily to help regulate blood sugar patterns',
                'Consider a therapeutic lifestyle change (TLC) or DASH diet protocol',
                'Monitor portion sizes carefully using measuring tools and food scales',
                'Learn to read nutrition labels and identify hidden sugars in processed foods'
              ]
            },
            {
              title: 'Immediate Lifestyle Modifications',
              icon: <Target className="w-6 h-6" />,
              measures: [
                'Begin moderate exercise immediately with medical clearance (start with 10-15 minutes)',
                'Check blood glucose before and after exercise to understand your body\'s response',
                'Prioritize weight loss if overweight - even 5% reduction can significantly help',
                'Quit smoking immediately as it dramatically worsens diabetes complications',
                'Limit alcohol consumption strictly or eliminate completely',
                'Establish strict sleep hygiene for consistent 7-9 hours of quality sleep',
                'Begin stress management techniques as stress significantly affects blood sugar',
                'Start taking prescribed medications exactly as directed by healthcare provider'
              ]
            },
            {
              title: 'Comprehensive Health Monitoring',
              icon: <TrendingUp className="w-6 h-6" />,
              measures: [
                'Monitor blood glucose levels multiple times daily as directed by physician',
                'Track all meals, exercise, medications, and glucose readings in a log',
                'Check blood pressure daily as diabetes increases cardiovascular risk',
                'Weigh yourself weekly at the same time to monitor weight changes',
                'Perform daily foot inspections for cuts, sores, or changes in sensation',
                'Monitor for diabetes symptoms: excessive thirst, urination, fatigue, blurred vision',
                'Schedule regular follow-up appointments every 2-3 months initially',
                'Keep emergency glucose tablets or glucagon kit if prescribed'
              ]
            },
            {
              title: 'Complication Prevention',
              icon: <Shield className="w-6 h-6" />,
              measures: [
                'Begin taking aspirin daily if recommended by doctor for cardiovascular protection',
                'Start aggressive cholesterol management with statin therapy if prescribed',
                'Implement strict blood pressure control measures (target <140/90 mmHg)',
                'Begin ACE inhibitor or ARB medication if prescribed for kidney protection',
                'Schedule immediate dental examination as diabetes increases infection risk',
                'Learn proper foot care techniques and inspect feet daily',
                'Carry medical identification indicating diabetes risk or diagnosis',
                'Educate family members about diabetes management and emergency procedures'
              ]
            },
            {
              title: 'Education & Support Systems',
              icon: <BookOpen className="w-6 h-6" />,
              measures: [
                'Enroll in a comprehensive diabetes education program immediately',
                'Join a diabetes support group for emotional and practical support',
                'Learn to recognize and treat hypoglycemia (low blood sugar episodes)',
                'Understand when to seek emergency medical care',
                'Keep emergency contact information readily available',
                'Inform workplace, school, or caregivers about your condition and needs',
                'Research and understand your health insurance coverage for diabetes care',
                'Consider downloading diabetes management apps for tracking and reminders'
              ]
            }
          ]
        };

      default:
        return null;
    }
  };

  const precautions = getPrecautionaryMeasures();
  if (!precautions) return null;

  const getRiskLevel = () => {
    const maxProb = Math.max(result.probabilities.normal, result.probabilities.borderline, result.probabilities.high);
    if (maxProb === result.probabilities.high) return 'High Risk';
    if (maxProb === result.probabilities.borderline) return 'Moderate Risk';
    return 'Low Risk';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/prediction')}
          className="group inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Prediction</span>
        </button>

        {/* Results Summary */}
        <div className={`relative overflow-hidden p-8 rounded-3xl border-2 mb-8 ${
          result.risk === 'high'
            ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
            : result.risk === 'borderline'
            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
        } animate-fade-in-up shadow-xl`}>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <Activity className="w-full h-full" />
          </div>

          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-6 lg:space-y-0">
              <div className={`flex-shrink-0 p-4 rounded-2xl ${
                result.risk === 'high' ? 'bg-red-100' :
                result.risk === 'borderline' ? 'bg-yellow-100' : 'bg-green-100'
              } shadow-lg mx-auto lg:mx-0`}>
                {precautions.icon}
              </div>

              <div className="flex-1 text-center lg:text-left">
                <h1 className={`text-3xl lg:text-4xl font-bold mb-3 ${
                  result.risk === 'high' ? 'text-red-800' :
                  result.risk === 'borderline' ? 'text-yellow-800' : 'text-green-800'
                }`}>
                  {result.message}
                </h1>
                <p className={`text-lg mb-6 ${
                  result.risk === 'high' ? 'text-red-700' :
                  result.risk === 'borderline' ? 'text-yellow-700' : 'text-green-700'
                }`}>
                  {precautions.subtitle}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/70 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">
                      {getRiskLevel()}
                    </div>
                    <div className="text-sm text-gray-600">Overall Assessment</div>
                  </div>
                  <div className="bg-white/70 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">
                      {result.model_accuracy}%
                    </div>
                    <div className="text-sm text-gray-600">Model Accuracy</div>
                  </div>
                  <div className="bg-white/70 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">
                      {result.response_time_ms}ms
                    </div>
                    <div className="text-sm text-gray-600">Analysis Time</div>
                  </div>
                </div>

                {/* Probability breakdown */}
                <div className="bg-white/70 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Risk Probabilities</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg font-mono text-sm">
                        {(result.probabilities.normal * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Normal</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg font-mono text-sm">
                        {(result.probabilities.borderline * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Borderline</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg font-mono text-sm">
                        {(result.probabilities.high * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 mt-1">High Risk</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Precautionary Measures */}
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {precautions.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Based on your assessment results, here are comprehensive recommendations to help you maintain or improve your health.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {precautions.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-3 rounded-xl ${
                    precautions.color === 'green' ? 'bg-green-100 text-green-600' :
                    precautions.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                </div>

                <ul className="space-y-3">
                  {section.measures.map((measure, measureIndex) => (
                    <li key={measureIndex} className="flex items-start space-x-3 text-gray-700">
                      <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        precautions.color === 'green' ? 'text-green-500' :
                        precautions.color === 'yellow' ? 'text-yellow-500' :
                        'text-red-500'
                      }`} />
                      <span className="text-sm leading-relaxed">{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Information */}
        {result.risk === 'high' && (
          <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-2xl p-6 animate-fade-in-up">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Emergency Warning Signs</h3>
                <p className="text-red-700 mb-4">
                  Seek immediate medical attention if you experience any of these symptoms:
                </p>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Severe thirst and frequent urination</li>
                  <li>• Unexplained weight loss</li>
                  <li>• Persistent fatigue or weakness</li>
                  <li>• Blurred vision or vision changes</li>
                  <li>• Slow-healing wounds or frequent infections</li>
                  <li>• Nausea, vomiting, or abdominal pain</li>
                  <li>• Difficulty breathing or fruity breath odor</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Plan Summary */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-8 h-8 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Your Action Plan Summary</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Immediate Actions</h4>
              <p className="text-sm text-gray-600">
                {result.risk === 'high' 
                  ? 'Schedule medical appointment within 1-2 weeks'
                  : result.risk === 'borderline'
                  ? 'Start dietary changes and increase physical activity'
                  : 'Continue current healthy lifestyle habits'
                }
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl">
              <Calendar className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Ongoing Monitoring</h4>
              <p className="text-sm text-gray-600">
                {result.risk === 'high' 
                  ? 'Daily glucose monitoring and regular medical follow-ups'
                  : result.risk === 'borderline'
                  ? 'Regular health checkups every 3-6 months'
                  : 'Annual health screenings and preventive care'
                }
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Support System</h4>
              <p className="text-sm text-gray-600">
                {result.risk === 'high' 
                  ? 'Diabetes education programs and support groups'
                  : result.risk === 'borderline'
                  ? 'Diabetes prevention programs and nutritionist'
                  : 'Maintain healthy social connections and activities'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-600 px-4 py-3 rounded-full">
            <Info className="w-5 h-5" />
            <span className="text-sm font-medium">
              This assessment is for informational purposes only and does not replace professional medical advice.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}