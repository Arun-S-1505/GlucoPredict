import { Heart, Stethoscope, TrendingUp } from 'lucide-react';

export default function Insights() {
  const insights = [
    {
      icon: Heart,
      title: 'Risk Factors',
      description: 'High glucose levels, BMI over 30, family history, and age are key factors that increase diabetes risk.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Stethoscope,
      title: 'Regular Checkups',
      description: 'Early detection through regular health screenings can prevent complications and enable timely intervention.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Lifestyle Changes',
      description: 'A balanced diet, regular exercise, weight management, and stress reduction can significantly lower your risk.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section id="insights" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Understanding Your Result
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn more about diabetes prevention and management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${insight.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <insight.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {insight.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
