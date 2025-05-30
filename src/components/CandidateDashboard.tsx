
import { useState } from 'react';
import { User, FileText, Briefcase, Settings, Edit, Calendar, MapPin, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditProfile from './EditProfile';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const candidateData = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    summary: "Experienced software developer with 5+ years in web development",
    experience: "5 years",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
    applications: 12,
    interviews: 3,
    profileViews: 45
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your profile, track applications, and update your information
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profile Overview</span>
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Profile Summary Card */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Summary</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab('edit')}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{candidateData.name}</h3>
                    <p className="text-gray-600">{candidateData.summary}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{candidateData.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{candidateData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{candidateData.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{candidateData.experience} experience</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidateData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-green-100 text-green-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{candidateData.applications}</h3>
                <p className="text-gray-600">Applications Sent</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{candidateData.interviews}</h3>
                <p className="text-gray-600">Interviews Scheduled</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{candidateData.profileViews}</h3>
                <p className="text-gray-600">Profile Views</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Applied to Senior React Developer at TechCorp", time: "2 hours ago" },
                  { action: "Profile viewed by Innovation Labs recruiter", time: "1 day ago" },
                  { action: "Interview scheduled with Design Studio", time: "2 days ago" },
                  { action: "Updated profile summary", time: "3 days ago" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-900">{activity.action}</span>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <EditProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidateDashboard;
