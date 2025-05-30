
import { useState } from 'react';
import { User, Upload, Save, MapPin, Mail, Phone, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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
    skills: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
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

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOC file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate file upload and processing
    setTimeout(() => {
      setUploadedResume(file.name);
      setIsUploading(false);
      
      // Simulate auto-filling profile data from resume
      setProfileData(prev => ({
        ...prev,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
        city: 'San Francisco',
        state: 'CA',
        summary: 'Experienced software developer with 5+ years in web development...',
        experience: '5 years',
        skills: 'React, TypeScript, Node.js, Python, AWS'
      }));

      toast({
        title: "Resume uploaded successfully!",
        description: "Your profile has been auto-filled with resume data",
      });
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Edit Your Profile</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Keep your profile up to date to attract the best job opportunities
        </p>
      </div>

      {/* Resume Upload Section */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Fill Details with Resume</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload your resume to auto-fill profile
            </h3>
            <p className="text-gray-600 mb-6">
              We'll extract your information and fill the form below automatically
            </p>
            
            {uploadedResume ? (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <FileText className="w-5 h-5" />
                <span className="font-medium">{uploadedResume}</span>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button 
                    asChild 
                    disabled={isUploading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <span className="cursor-pointer">
                      {isUploading ? 'Processing...' : 'Choose Resume'}
                    </span>
                  </Button>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  PDF, DOC, or DOCX up to 10MB
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card className="max-w-2xl mx-auto">
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
  );
};

export default EditProfile;
