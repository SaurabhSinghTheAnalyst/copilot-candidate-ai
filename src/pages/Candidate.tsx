import { useState } from 'react';
import { Search, Briefcase, Users, MapPin, Mail, Phone, FileText, Zap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import JobSearchResults from '@/components/JobSearchResults';
import CandidateDashboard from '@/components/CandidateDashboard';

const Candidate = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Career Portal</h1>
                <p className="text-xs text-gray-500">Find Your Dream Job</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Welcome, {user?.email}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Find Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>My Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-8">
            {/* Search Section */}
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-gray-900">
                  Find Your Next Opportunity
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Search for jobs, companies, or recruiters that match your skills and career goals
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g., Software Engineer at tech startups in San Francisco, Remote React developer positions"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 pr-32 py-6 text-lg border-2 border-gray-200 focus:border-green-500 rounded-2xl shadow-lg"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isSearching ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Searching...</span>
                      </div>
                    ) : (
                      'Search'
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick Search Examples */}
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  'Remote software jobs',
                  'Marketing roles in NYC',
                  'Startup opportunities',
                  'Senior developer positions'
                ].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(example)}
                    className="text-sm hover:bg-green-50 hover:border-green-300"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>

            {/* Featured Jobs Section */}
            {!showResults && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Opportunities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Senior React Developer",
                      company: "TechCorp Inc.",
                      location: "San Francisco, CA",
                      type: "Full-time",
                      salary: "$120k - $150k",
                      skills: ["React", "TypeScript", "Node.js"]
                    },
                    {
                      title: "Product Manager",
                      company: "Innovation Labs",
                      location: "Remote",
                      type: "Full-time",
                      salary: "$90k - $120k",
                      skills: ["Product Strategy", "Analytics", "Leadership"]
                    },
                    {
                      title: "UX Designer",
                      company: "Design Studio",
                      location: "New York, NY",
                      type: "Contract",
                      salary: "$80k - $100k",
                      skills: ["Figma", "User Research", "Prototyping"]
                    }
                  ].map((job, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <p className="text-gray-600">{job.company}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex justify-between text-sm">
                          <Badge variant="secondary">{job.type}</Badge>
                          <span className="font-semibold text-green-600">{job.salary}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {showResults && <JobSearchResults query={searchQuery} />}
          </TabsContent>

          <TabsContent value="dashboard">
            <CandidateDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Candidate;
