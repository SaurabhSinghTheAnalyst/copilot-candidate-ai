
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Briefcase, Users, Shield, Globe, Star, CheckCircle, TrendingUp, Zap, Heart, Award } from 'lucide-react';

const categories = [
  { name: 'Technology', icon: '💻', count: '2.5k jobs', color: 'blue' },
  { name: 'Engineering', icon: '🛠️', count: '1.8k jobs', color: 'green' },
  { name: 'Design', icon: '🎨', count: '950 jobs', color: 'purple' },
  { name: 'Marketing', icon: '📣', count: '1.2k jobs', color: 'pink' },
  { name: 'Finance', icon: '💰', count: '800 jobs', color: 'yellow' },
  { name: 'Healthcare', icon: '🏥', count: '1.5k jobs', color: 'red' },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Find your perfect match in seconds with our AI-powered job recommendations.',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your data is protected with enterprise-grade security and privacy controls.',
    gradient: 'from-green-400 to-blue-500'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    desc: 'Connect with opportunities and talent from around the world.',
    gradient: 'from-blue-400 to-purple-500'
  },
  {
    icon: Heart,
    title: 'Perfect Matches',
    desc: 'Our smart algorithm ensures the best fit for both candidates and companies.',
    gradient: 'from-pink-400 to-red-500'
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'TechCorp',
    content: 'Found my dream job in just 2 weeks! The platform made it so easy to connect with the right opportunities.',
    avatar: 'SC'
  },
  {
    name: 'Michael Rodriguez',
    role: 'HR Director',
    company: 'InnovateInc',
    content: 'We hired 5 amazing developers through this platform. The quality of candidates is exceptional.',
    avatar: 'MR'
  },
  {
    name: 'Emma Thompson',
    role: 'Product Designer',
    company: 'CreativeStudio',
    content: 'The AI matching is incredible. It understood exactly what I was looking for in my next role.',
    avatar: 'ET'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role, loading } = useUserRole();

  useEffect(() => {
    if (user && !loading) {
      if (role === 'recruiter') navigate('/dashboard');
      else if (role === 'candidate') navigate('/candidate');
    }
  }, [user, role, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TalentHub</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Categories</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Reviews</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Pricing</a>
            </div>

            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <Badge className="mb-6 bg-blue-100/80 text-blue-700 border-blue-200 px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            #1 Job Platform of 2024
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Dream Career
            </span>
            Today
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect with top companies worldwide. Whether you're seeking talent or your next opportunity, 
            we make professional connections effortless.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 border-2 border-gray-300 hover:border-blue-400 bg-white/80 backdrop-blur-sm text-lg font-semibold"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100K+</div>
              <div className="text-gray-600">Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
              <div className="text-gray-600">Companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore opportunities across diverse industries and find your perfect match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => (
              <Card key={idx} className="group bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.count}</p>
                  <Badge variant="secondary" className="bg-blue-100/80 text-blue-700">
                    View Jobs
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TalentHub?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powered by cutting-edge technology to deliver the best hiring experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="group bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied professionals and companies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex text-yellow-400 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join over 100,000 professionals who've found their perfect match through TalentHub
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="px-10 py-4 bg-white text-blue-600 hover:bg-blue-50 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">TalentHub</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Connecting talent with opportunity. Building the future of work, one connection at a time.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">For Job Seekers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Career Advice</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Resume Builder</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">For Employers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Post Jobs</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Find Talent</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Recruiting Tools</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 TalentHub. All rights reserved. Built with ❤️ for the future of work.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
