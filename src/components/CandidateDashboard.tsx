
import { useState } from 'react';
import { User, FileText, Briefcase, Settings, Edit, Calendar, MapPin, Mail, Phone, Plus, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditProfile from './EditProfile';
import ProfileCompletenessCard from './ProfileCompletenessCard';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { profile, loading } = useCandidateProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  const displayName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Your Name'
    : 'Your Name';

  // Calculate real stats from profile data
  const totalExperience = profile?.job_experience?.length || 0;
  const totalEducation = profile?.education_history?.length || 0;
  const totalCertifications = profile?.certification_history?.length || 0;

  // Mock application data (these would come from job applications in a real app)
  const mockStats = {
    applications: 12,
    interviews: 3,
    profileViews: 45
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{displayName}</h1>
                  <p className="text-gray-600 mt-1">
                    {profile?.professional_summary || 'Add a professional summary to showcase your expertise'}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab('edit')}
                className="shrink-0"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{profile?.email || 'Add email'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{profile?.phone || 'Add phone'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>
                  {profile?.city && profile?.state 
                    ? `${profile.city}, ${profile.state}`
                    : 'Add location'
                  }
                </span>
              </div>
            </div>

            {/* Professional Links */}
            {(profile?.github_url || profile?.linkedin_url) && (
              <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                {profile?.github_url && (
                  <a 
                    href={profile.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a 
                    href={profile.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Skills</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveTab('edit')}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Add your skills to attract relevant opportunities</p>
              )}
            </div>
          </div>

          {/* Profile Completeness */}
          <ProfileCompletenessCard profile={profile} />

          {/* Professional Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-gray-100">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">{totalExperience}</div>
                <div className="text-sm text-gray-600">Work Experience</div>
              </CardContent>
            </Card>

            <Card className="border-gray-100">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">{totalEducation}</div>
                <div className="text-sm text-gray-600">Education</div>
              </CardContent>
            </Card>

            <Card className="border-gray-100">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">{totalCertifications}</div>
                <div className="text-sm text-gray-600">Certifications</div>
              </CardContent>
            </Card>
          </div>

          {/* Application Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-gray-100">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">{mockStats.applications}</div>
                <div className="text-sm text-gray-600">Applications</div>
              </CardContent>
            </Card>

            <Card className="border-gray-100">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">{mockStats.interviews}</div>
                <div className="text-sm text-gray-600">Interviews</div>
              </CardContent>
            </Card>

            <Card className="border-gray-100">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">{mockStats.profileViews}</div>
                <div className="text-sm text-gray-600">Profile Views</div>
              </CardContent>
            </Card>
          </div>

          {/* Experience Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Experience</h3>
            <div className="space-y-3">
              {profile?.job_experience && profile.job_experience.length > 0 ? (
                profile.job_experience.slice(0, 3).map((job, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                    <div>
                      <div className="font-medium text-gray-900">{job.jobTitle || 'Job Title'}</div>
                      <div className="text-sm text-gray-600">{job.company || 'Company'}</div>
                      {job.responsibilities && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {job.responsibilities.substring(0, 100)}...
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      <div>
                        {job.startDate ? new Date(job.startDate).getFullYear() : 'Year'} - 
                        {job.isCurrentJob ? ' Present' : (job.endDate ? ` ${new Date(job.endDate).getFullYear()}` : ' Present')}
                      </div>
                      {job.isCurrentJob && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 mt-1">
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No work experience added yet</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setActiveTab('edit')}
                  >
                    Add Experience
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Education Summary */}
          {profile?.education_history && profile.education_history.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
              <div className="space-y-3">
                {profile.education_history.slice(0, 2).map((edu, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                    <div>
                      <div className="font-medium text-gray-900">{edu.degree || 'Degree'}</div>
                      <div className="text-sm text-gray-600">{edu.institution || 'Institution'}</div>
                      {edu.fieldOfStudy && (
                        <div className="text-xs text-gray-500">{edu.fieldOfStudy}</div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {edu.startDate ? new Date(edu.startDate).getFullYear() : 'Year'} - 
                      {edu.isCurrentlyStudying ? ' Present' : (edu.endDate ? ` ${new Date(edu.endDate).getFullYear()}` : ' Present')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="edit">
          <EditProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidateDashboard;
