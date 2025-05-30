
import { useState } from 'react';
import { FileText, Bookmark, Send, Eye, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const CandidateDashboard = () => {
  const [profileCompleteness] = useState(75);

  const stats = [
    {
      title: "Profile Views",
      value: "24",
      change: "+12%",
      icon: Eye,
      color: "text-blue-600"
    },
    {
      title: "Applications Sent",
      value: "8",
      change: "+3",
      icon: Send,
      color: "text-green-600"
    },
    {
      title: "Saved Jobs",
      value: "15",
      change: "+5",
      icon: Bookmark,
      color: "text-purple-600"
    },
    {
      title: "Interview Invites",
      value: "3",
      change: "+2",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  const recentApplications = [
    {
      id: 1,
      position: "Senior React Developer",
      company: "TechCorp Inc.",
      status: "Under Review",
      appliedDate: "2 days ago",
      statusColor: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 2,
      position: "Full Stack Engineer",
      company: "StartupXYZ",
      status: "Interview Scheduled",
      appliedDate: "1 week ago",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      position: "Frontend Developer",
      company: "Design Agency",
      status: "Applied",
      appliedDate: "3 days ago",
      statusColor: "bg-blue-100 text-blue-800"
    }
  ];

  const savedJobs = [
    {
      id: 1,
      title: "Product Manager",
      company: "Innovation Labs",
      location: "Remote",
      postedDate: "1 day ago"
    },
    {
      id: 2,
      title: "UX Designer",
      company: "Creative Studio",
      location: "San Francisco, CA",
      postedDate: "3 days ago"
    },
    {
      id: 3,
      title: "Software Engineer",
      company: "Tech Solutions",
      location: "New York, NY",
      postedDate: "5 days ago"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">My Profile Dashboard</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track your job search progress and manage your applications
        </p>
      </div>

      {/* Profile Completeness */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Profile Completeness</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profile Progress</span>
            <span className="text-sm text-gray-500">{profileCompleteness}% Complete</span>
          </div>
          <Progress value={profileCompleteness} className="w-full" />
          <div className="text-sm text-gray-600">
            {profileCompleteness < 100 && (
              <p>Complete your profile to increase visibility to recruiters!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Recent Applications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplications.map((application) => (
              <div key={application.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{application.position}</h4>
                    <p className="text-sm text-gray-600">{application.company}</p>
                    <p className="text-xs text-gray-500">Applied {application.appliedDate}</p>
                  </div>
                  <Badge className={application.statusColor}>{application.status}</Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Applications
            </Button>
          </CardContent>
        </Card>

        {/* Saved Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5" />
              <span>Saved Jobs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {savedJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <p className="text-xs text-gray-500">{job.location} • Posted {job.postedDate}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Saved Jobs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Documents */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>My Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <h4 className="font-medium">Resume.pdf</h4>
                  <p className="text-sm text-gray-500">Uploaded 2 days ago</p>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-green-500" />
                <div>
                  <h4 className="font-medium">Cover Letter.pdf</h4>
                  <p className="text-sm text-gray-500">Uploaded 1 week ago</p>
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Upload New Document
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateDashboard;
