
import { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ResumeParser from './ResumeParser';
import CandidateScoreCard from './CandidateScoreCard';
import JobExperienceSection from './profile/JobExperienceSection';
import EducationSection from './profile/EducationSection';
import CertificationSection from './profile/CertificationSection';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  summary: string;
  skills: string;
  githubPortfolio: string;
  linkedinId: string;
}

interface ScoreData {
  overall: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
}

const EditProfile = () => {
  const { profile, loading, saveProfile } = useCandidateProfile();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    summary: '',
    skills: '',
    githubPortfolio: '',
    linkedinId: ''
  });
  
  const [jobExperience, setJobExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load existing profile data when component mounts or profile changes
  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zip_code || '',
        summary: profile.professional_summary || '',
        skills: profile.skills?.join(', ') || '',
        githubPortfolio: '',
        linkedinId: ''
      });

      // Load structured data
      setJobExperience(profile.job_experience || []);
      setEducation(profile.education_history || []);
      setCertifications(profile.certification_history || []);

      // Set score data if available
      if (profile.overall_score) {
        setScoreData({
          overall: profile.overall_score,
          skillMatch: profile.skill_match_score || 0,
          experienceMatch: profile.experience_match_score || 0,
          educationMatch: profile.education_match_score || 0
        });
      }
    }
  }, [profile]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleResumeDataParsed = async (parsedData: any) => {
    const { personalInfo, professionalInfo, score } = parsedData;
    
    const updatedProfileData = {
      firstName: personalInfo.firstName || profileData.firstName,
      lastName: personalInfo.lastName || profileData.lastName,
      email: personalInfo.email || profileData.email,
      phone: personalInfo.phone || profileData.phone,
      address: personalInfo.address || profileData.address,
      city: personalInfo.city || profileData.city,
      state: personalInfo.state || profileData.state,
      summary: professionalInfo.summary || profileData.summary,
      skills: professionalInfo.skills?.join(', ') || profileData.skills,
      zipCode: profileData.zipCode,
      githubPortfolio: personalInfo.githubPortfolio || profileData.githubPortfolio,
      linkedinId: personalInfo.linkedinId || profileData.linkedinId
    };

    setProfileData(updatedProfileData);
    setScoreData(score);

    // Convert employment details to job experience format
    if (professionalInfo.employmentDetails && Array.isArray(professionalInfo.employmentDetails)) {
      const jobExperienceData = professionalInfo.employmentDetails.map((job: any, index: number) => ({
        id: (Date.now() + index).toString(),
        jobTitle: job.jobTitle || job.position || 'Position',
        company: job.company || 'Company Name',
        startDate: job.startDate || '',
        endDate: job.endDate || '',
        responsibilities: job.responsibilities || job.description || '',
        isCurrentJob: index === 0
      }));
      setJobExperience(jobExperienceData);
    }

    // Automatically save the parsed data to Supabase
    const candidateData = {
      first_name: personalInfo.firstName,
      last_name: personalInfo.lastName,
      email: personalInfo.email,
      phone: personalInfo.phone,
      address: personalInfo.address,
      city: personalInfo.city,
      state: personalInfo.state,
      zip_code: profileData.zipCode,
      professional_summary: professionalInfo.summary,
      skills: professionalInfo.skills || [],
      job_experience: jobExperience,
      education_history: education,
      certification_history: certifications,
      overall_score: score.overall,
      skill_match_score: score.skillMatch,
      experience_match_score: score.experienceMatch,
      education_match_score: score.educationMatch,
      resume_file_name: 'parsed_resume.pdf'
    };

    await saveProfile(candidateData);
  };

  const handleSaveProfile = async () => {
    // Basic validation
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your first name, last name, and email",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    const candidateData = {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address,
      city: profileData.city,
      state: profileData.state,
      zip_code: profileData.zipCode,
      professional_summary: profileData.summary,
      skills: profileData.skills ? profileData.skills.split(',').map(s => s.trim()) : [],
      job_experience: jobExperience,
      education_history: education,
      certification_history: certifications,
      overall_score: scoreData?.overall,
      skill_match_score: scoreData?.skillMatch,
      experience_match_score: scoreData?.experienceMatch,
      education_match_score: scoreData?.educationMatch
    };

    await saveProfile(candidateData);
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Edit Your Profile</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Keep your profile up to date to attract the best job opportunities
        </p>
      </div>

      {/* AI Resume Parser */}
      <ResumeParser 
        onDataParsed={handleResumeDataParsed}
        requirements="Software development position with React, Node.js, and cloud technologies"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              {/* Professional Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="githubPortfolio">GitHub Portfolio</Label>
                  <Input
                    id="githubPortfolio"
                    placeholder="https://github.com/username"
                    value={profileData.githubPortfolio}
                    onChange={(e) => handleInputChange('githubPortfolio', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinId">LinkedIn Profile</Label>
                  <Input
                    id="linkedinId"
                    placeholder="https://linkedin.com/in/username"
                    value={profileData.linkedinId}
                    onChange={(e) => handleInputChange('linkedinId', e.target.value)}
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your street address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={profileData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={profileData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="ZIP"
                      value={profileData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary and Skills */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    placeholder="Brief description of your professional background and career goals..."
                    value={profileData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Key Skills</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., React, Node.js, Python, Project Management"
                    value={profileData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card>
            <CardContent className="pt-6">
              <JobExperienceSection 
                jobExperience={jobExperience}
                onChange={setJobExperience}
              />
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardContent className="pt-6">
              <EducationSection 
                education={education}
                onChange={setEducation}
              />
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardContent className="pt-6">
              <CertificationSection 
                certifications={certifications}
                onChange={setCertifications}
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="pt-4">
            <Button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>

        {/* Score Card */}
        <div className="lg:col-span-1">
          {scoreData && (
            <CandidateScoreCard score={scoreData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
