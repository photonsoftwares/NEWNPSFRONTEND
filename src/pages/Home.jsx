import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Users, BarChart3, MessageSquare, ArrowRight, CheckCircle, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Smart Feedback Collection",
      description: "Capture customer feedback through multiple channels - QR codes, mobile apps, and web interfaces."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Real-time NPS scoring, sentiment analysis, and comprehensive reporting dashboards."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Segmentation",
      description: "Automatically categorize customers as Promoters, Passives, or Detractors for targeted insights."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Processing",
      description: "Instant feedback processing and notification system for immediate action on customer concerns."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "OAuth2 authentication, role-based access control, and secure data handling."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-language Support",
      description: "Support for multiple languages and regions with localized feedback forms."
    }
  ];

  const stats = [
    { number: "98%", label: "Response Rate" },
    { number: "2.5s", label: "Avg Response Time" },
    { number: "150+", label: "Enterprise Clients" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FeedbackHub</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/customer" className="text-gray-300 hover:text-white transition-colors">
              Customer Portal
            </Link>
            <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
              Admin Dashboard
            </Link>
            <Link to="/analytics" className="text-gray-300 hover:text-white transition-colors">
              Analytics
            </Link>
            <Link 
              to="/admin" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Customer
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Feedback into Growth
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Advanced NPS management system designed for enterprise retail. Collect, analyze, and act on customer feedback with precision and speed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                to="/customer" 
                className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Start Feedback Survey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/admin" 
                className="bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center transform transition-all duration-1000 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features for
              <span className="block text-purple-400">Modern Businesses</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built for enterprise retail environments with advanced microservices architecture and real-time processing capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:bg-white/10"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-3xl p-12 border border-white/10">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Customer Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join leading retail brands using FeedbackHub to drive customer satisfaction and business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/customer" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Try Customer Portal
              </Link>
              <Link 
                to="/admin" 
                className="bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FeedbackHub</span>
              </div>
              <p className="text-gray-400">
                Enterprise customer feedback management system for modern retail.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/customer" className="hover:text-white transition-colors">Customer Portal</Link></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>NPS Scoring</li>
                <li>Real-time Analytics</li>
                <li>Multi-channel Collection</li>
                <li>Enterprise Security</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>24/7 Support</li>
                <li>Training</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FeedbackHub. Built for enterprise excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
