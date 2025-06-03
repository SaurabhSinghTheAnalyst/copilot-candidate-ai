
import { useState, useEffect } from 'react';
import { Search, Briefcase, Users, MapPin, Mail, Phone, FileText, Zap, LogOut, Star, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import JobSearchResults from '@/components/JobSearchResults';
import UploadArea from '@/components/UploadArea';
import JobList from '@/components/JobList';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';

const Candidate = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string | null>(null);

  // Helper to capitalize first letter and lowercase the rest
  const formatName = (name: string | null | undefined) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('candidates')
        .select('first_name')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data && data.first_name) {
        setFirstName(data.first_name);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter a search query",
        description: "Please describe the job or recruiter you're looking for",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
      toast({
        title: "Search complete!",
        description: `Found opportunities matching "${searchQuery}"`,
      });
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  // Debug UI and fallback
  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (role !== 'candidate') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-bold bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        Access denied: You are not a candidate. (Role: {role || 'none'})
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <header className="border-b border-white/20 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Career Portal</h1>
                <p className="text-sm text-gray-600 font-medium">Find Your Dream Job</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Online</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100/80 text-blue-700 border-blue-200 px-4 py-2 font-medium">
                Welcome, {firstName ? formatName(firstName) : user?.email?.split('@')[0]}
              </Badge>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="hover:bg-red-50 hover:text-red-600 transition-colors">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <TabsTrigger 
              value="search" 
              className="flex items-center space-x-3 py-3 px-6 text-base font-medium hover:bg-blue-50 hover:text-blue-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span>Find Jobs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center space-x-3 py-3 px-6 text-base font-medium hover:bg-blue-50 hover:text-blue-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Users className="w-5 h-5" />
              <span>My Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-8">
            {/* Enhanced Hero Section */}
            <div className="text-center space-y-8 py-12">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                  Find Your Next
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> Dream Job</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Discover thousands of opportunities from top companies worldwide. Let AI match you with the perfect role.
                </p>
              </div>

              {/* Enhanced Search Bar */}
              <div className="max-w-4xl mx-auto">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative bg-white rounded-3xl border border-white/20 shadow-2xl p-2">
                    <div className="flex items-center">
                      <div className="flex-1 flex items-center">
                        <Search className="absolute left-6 text-gray-400 w-6 h-6 z-10" />
                        <Input
                          type="text"
                          placeholder="Search for software engineer roles, remote positions, or specific companies..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="pl-16 pr-4 py-6 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent rounded-3xl placeholder:text-gray-400"
                        />
                      </div>
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="px-8 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold"
                      >
                        {isSearching ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Searching...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Search Jobs</span>
                            <TrendingUp className="w-5 h-5" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Quick Search Examples */}
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {[
                  { text: 'Remote Software Jobs', icon: '💻' },
                  { text: 'Marketing in NYC', icon: '🗽' },
                  { text: 'Startup Opportunities', icon: '🚀' },
                  { text: 'Senior Developer Roles', icon: '⭐' }
                ].map((example) => (
                  <Button
                    key={example.text}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(example.text)}
                    className="text-sm hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm border-white/30"
                  >
                    <span className="mr-2">{example.icon}</span>
                    {example.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Statistics Cards */}
            {!showResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">10,000+</h3>
                    <p className="text-gray-600">Active Job Listings</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">50,000+</h3>
                    <p className="text-gray-600">Successful Placements</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
                    <p className="text-gray-600">Partner Companies</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Show JobList for candidates instead of featured jobs */}
            {!showResults && (
              <div className="mt-12">
                <JobList />
              </div>
            )}

            {/* Search Results */}
            {showResults && <JobSearchResults query={searchQuery} />}
          </TabsContent>

          <TabsContent value="dashboard">
            <UploadArea />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Candidate;
