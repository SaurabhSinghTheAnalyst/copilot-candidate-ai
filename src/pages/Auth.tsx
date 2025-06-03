
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, Users, ArrowRight, CheckCircle, Sparkles, Shield, Globe } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (isSignUp: boolean) => {
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, role);
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      } else {
        await signIn(email, password);
        navigate(role === 'recruiter' ? '/dashboard' : '/candidate');
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Briefcase, title: "Smart Job Matching", desc: "AI-powered job recommendations" },
    { icon: Users, title: "Global Talent Pool", desc: "Access to 50,000+ professionals" },
    { icon: Shield, title: "Secure Platform", desc: "Enterprise-grade security" },
    { icon: Globe, title: "Remote-First", desc: "Connect from anywhere" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center px-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">TalentHub</h1>
                <p className="text-blue-100">Professional Career Platform</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold leading-tight mb-4">
                  Connect Talent with
                  <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">Opportunity</span>
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Join thousands of professionals and companies building the future of work together.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <feature.icon className="w-8 h-8 text-blue-200 mb-3" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-blue-100">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4 pt-8">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold">50,000+ Active Users</p>
                  <p className="text-sm text-blue-100">Join our growing community</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Header */}
            <div className="lg:hidden text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">TalentHub</span>
              </div>
              <p className="text-gray-600">Connect with your next opportunity</p>
            </div>

            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </CardTitle>
                <p className="text-gray-600">Choose your path to get started</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">I am a:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setRole('candidate')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        role === 'candidate'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Users className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Job Seeker</div>
                    </button>
                    <button
                      onClick={() => setRole('recruiter')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        role === 'recruiter'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Briefcase className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Recruiter</div>
                    </button>
                  </div>
                </div>

                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100/80">
                    <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                    <Button
                      onClick={() => handleAuth(false)}
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                      <Input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                    <Button
                      onClick={() => handleAuth(true)}
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Create Account</span>
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>

                <div className="text-center">
                  <Badge variant="secondary" className="bg-green-100/80 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Free to join
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
