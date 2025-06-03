import { useState, useEffect } from 'react';
import { Plus, Search, Users, Briefcase, TrendingUp, Award, ChevronRight, Filter, MoreVertical, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import JobPostingModal from '@/components/JobPostingModal';
import DashboardStats from '@/components/DashboardStats';
import CandidateCarousel from '@/components/CandidateCarousel';

const Index = () => {
  const [showJobModal, setShowJobModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  // Mock data for recent activities
  const recentActivities = [
    { id: 1, type: 'application', candidate: 'Sarah Chen', position: 'Senior React Developer', time: '2 hours ago', status: 'new' },
    { id: 2, type: 'interview', candidate: 'Marcus Johnson', position: 'UX Designer', time: '4 hours ago', status: 'scheduled' },
    { id: 3, type: 'hire', candidate: 'Emily Rodriguez', position: 'Product Manager', time: '1 day ago', status: 'hired' },
  ];

  const quickStats = [
    { label: 'Active Jobs', value: '24', change: '+12%', color: 'blue' },
    { label: 'Applications', value: '156', change: '+8%', color: 'green' },
    { label: 'Interviews', value: '18', change: '+4%', color: 'purple' },
    { label: 'Hired', value: '7', change: '+2%', color: 'orange' },
  ];

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (role !== 'recruiter') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-bold bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        Access denied: You are not a recruiter. (Role: {role || 'none'})
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
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Recruiter Dashboard</h1>
                <p className="text-sm text-gray-600 font-medium">Manage your talent pipeline</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowJobModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
              <Badge variant="secondary" className="bg-blue-100/80 text-blue-700 border-blue-200 px-4 py-2 font-medium">
                Welcome, {user?.email?.split('@')[0]}
              </Badge>
              <Button variant="ghost" size="icon" onClick={signOut} className="hover:bg-red-50 hover:text-red-600">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, idx) => (
            <Card key={idx} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="secondary" className="text-green-700 bg-green-100">
                      {stat.change}
                    </Badge>
                    <TrendingUp className="w-5 h-5 text-green-600 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              <span>Candidates</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <Award className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Search and Filter Bar */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search candidates, positions, or companies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 bg-white/80 border-gray-200 focus:border-blue-400"
                    />
                  </div>
                  <Button variant="outline" className="h-12 px-6 border-gray-200 hover:bg-blue-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Activity</span>
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === 'new' ? 'bg-green-500' :
                        activity.status === 'scheduled' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{activity.candidate}</p>
                        <p className="text-sm text-gray-600">{activity.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={
                        activity.status === 'new' ? 'bg-green-100 text-green-700' :
                        activity.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }>
                        {activity.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <DashboardStats />
          </TabsContent>

          <TabsContent value="candidates">
            <CandidateCarousel />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-500">Advanced analytics and insights will be available here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showJobModal && (
        <JobPostingModal 
          isOpen={showJobModal}
          onClose={() => setShowJobModal(false)} 
        />
      )}
    </div>
  );
};

export default Index;
