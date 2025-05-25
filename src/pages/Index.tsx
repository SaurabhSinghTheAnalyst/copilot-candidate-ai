
import { useState } from 'react';
import { Search, Upload, Users, TrendingUp, Star, MapPin, Mail, Phone, ExternalLink, Copy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import CandidateCard from '@/components/CandidateCard';
import UploadArea from '@/components/UploadArea';
import SearchResults from '@/components/SearchResults';
import DashboardStats from '@/components/DashboardStats';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter a search query",
        description: "Please describe the candidate you're looking for",
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
        description: `Found candidates matching "${searchQuery}"`,
      });
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hiring Copilot</h1>
                <p className="text-xs text-gray-500">AI-Powered Recruitment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Live Demo
              </Badge>
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Search Candidates</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload Resumes</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-8">
            {/* Search Section */}
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-gray-900">
                  Find Your Perfect Candidate
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Describe your ideal candidate in plain English and let AI find the best matches from your database
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g., Senior Gen-AI engineer with LangChain + RAG experience in Europe, open to contract work"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 pr-32 py-6 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-2xl shadow-lg"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
                  'React developers in London',
                  'Senior Python engineers',
                  'Remote ML specialists',
                  'Full-stack developers with 5+ years'
                ].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(example)}
                    className="text-sm hover:bg-blue-50 hover:border-blue-300"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>

            {/* Search Results */}
            {showResults && <SearchResults query={searchQuery} />}
          </TabsContent>

          <TabsContent value="upload">
            <UploadArea />
          </TabsContent>

          <TabsContent value="dashboard">
            <DashboardStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
