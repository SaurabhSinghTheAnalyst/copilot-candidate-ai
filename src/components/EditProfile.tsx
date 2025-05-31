
import { useState } from 'react';
import { User, Save, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ResumeParser from './ResumeParser';
import CandidateScoreCard from './CandidateScoreCard';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  summary: string;
  experience: string;
  skills: string;
  education: string;
  certifications: string;
}

interface ScoreData {
  overall: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
}

const EditProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    summary: '',
    experience: '',
    skills: '',
    education: '',
    certifications: ''
  });
  
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleResumeDataParsed = (parsedData: any) => {
    const { personalInfo, professionalInfo, score } = parsedData;
    
    setProfileData(prev => ({
      ...prev,
      firstName: personalInfo.firstName || prev.firstName,
      lastName: personalInfo.lastName || prev.lastName,
      email: personalInfo.email || prev.email,
      phone: personalInfo.phone || prev.phone,
      address: personalInfo.address || prev.address,
      city: personalInfo.city || prev.city,
      state: personalInfo.state || prev.state,
      summary: professionalInfo.summary || prev.summary,
      experience: professionalInfo.experience || prev.experience,
      skills: professionalInfo.skills?.join(', ') || prev.skills,
      education: professionalInfo.education || prev.education,
      certifications: professionalInfo.certifications?.join(', ') || prev.certifications
    }));

    setScoreData(score);
  };

  const handleSaveProfile = () => {
    // Basic validation
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your first name, last name, and email",
        variant: "destructive"
      });
      return;
    }

    // Simulate saving profile
    toast({
      title: "Profile saved successfully!",
      description: "Your profile information has been updated",
    });
  };

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
        <div className="lg:col-span-2">
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

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>

              {/* Professional Information */}
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
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    placeholder="e.g., 5 years"
                    value={profileData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
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

                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    placeholder="e.g., Bachelor's in Computer Science"
                    value={profileData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Input
                    id="certifications"
                    placeholder="e.g., AWS Certified, PMP, etc."
                    value={profileData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleSaveProfile}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
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
