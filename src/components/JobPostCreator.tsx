import { useState } from 'react';
import { Plus, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface JobData {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
}

interface PublishingOptions {
  hiringCopilot: boolean;
  linkedin: boolean;
  seek: boolean;
  indeed: boolean;
  createLinkedinPost: boolean;
}

const JobPostCreator = () => {
  const [jobData, setJobData] = useState<JobData>({
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    requirements: ''
  });
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { toast } = useToast();
  const [publishingOptions, setPublishingOptions] = useState<PublishingOptions>({
    hiringCopilot: true,
    linkedin: false,
    seek: false,
    indeed: false,
    createLinkedinPost: false
  });

  const handleInputChange = (field: keyof JobData, value: string) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const handleVoiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoiceInput(e.target.value);
  };

  const handleAddVoiceInput = () => {
    if (voiceInput.trim()) {
      setJobData(prev => ({ ...prev, description: prev.description + ' ' + voiceInput }));
      setVoiceInput('');
    }
  };

  const handleRemoveVoiceInput = () => {
    setVoiceInput('');
  };

  const handlePublish = () => {
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.type || !jobData.description || !jobData.requirements) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all the job details before publishing",
        variant: "destructive"
      });
      return;
    }

    setIsPublishing(true);
    // Simulate API call
    setTimeout(() => {
      setIsPublishing(false);
      setShowSuccessModal(true);
      toast({
        title: "Job published successfully!",
        description: `Your job posting for ${jobData.title} at ${jobData.company} has been published`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Create a Job Post</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Attract top talent by creating a compelling job posting with detailed requirements and company information
        </p>
      </div>

      {/* Voice Input Section */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Voice Input</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsVoiceInput(!isVoiceInput)}>
            {isVoiceInput ? 'Disable Voice Input' : 'Enable Voice Input'}
          </Button>
        </CardHeader>
        <CardContent>
          {isVoiceInput ? (
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder="Describe the job details..."
                value={voiceInput}
                onChange={handleVoiceInputChange}
              />
              <Button onClick={handleAddVoiceInput}><Plus className="w-4 h-4 mr-2" /> Add</Button>
              <Button variant="destructive" onClick={handleRemoveVoiceInput}><X className="w-4 h-4 mr-2" /> Clear</Button>
            </div>
          ) : (
            <p className="text-gray-500">Voice input is disabled. Enable to add job details using voice.</p>
          )}
        </CardContent>
      </Card>

      {/* Job Details Form */}
      {jobData.title && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Software Engineer"
                  value={jobData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="e.g., TechCorp Inc."
                  value={jobData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={jobData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select job type" defaultValue={jobData.type} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the job role and responsibilities..."
                value={jobData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Job Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List the required skills, experience, and qualifications..."
                value={jobData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={4}
              />
            </div>
          
          {/* Publishing Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Publishing Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hiringCopilot"
                  checked={publishingOptions.hiringCopilot}
                  onCheckedChange={(checked) => 
                    setPublishingOptions(prev => ({ 
                      ...prev, 
                      hiringCopilot: checked === true 
                    }))
                  }
                />
                <Label htmlFor="hiringCopilot">Post on Hiring Copilot</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="linkedin"
                  checked={publishingOptions.linkedin}
                  onCheckedChange={(checked) => 
                    setPublishingOptions(prev => ({ 
                      ...prev, 
                      linkedin: checked === true 
                    }))
                  }
                />
                <Label htmlFor="linkedin">Post on LinkedIn Jobs</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="seek"
                  checked={publishingOptions.seek}
                  onCheckedChange={(checked) => 
                    setPublishingOptions(prev => ({ 
                      ...prev, 
                      seek: checked === true 
                    }))
                  }
                />
                <Label htmlFor="seek">Post on Seek</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="indeed"
                  checked={publishingOptions.indeed}
                  onCheckedChange={(checked) => 
                    setPublishingOptions(prev => ({ 
                      ...prev, 
                      indeed: checked === true 
                    }))
                  }
                />
                <Label htmlFor="indeed">Post on Indeed</Label>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createLinkedinPost"
                  checked={publishingOptions.createLinkedinPost}
                  onCheckedChange={(checked) => 
                    setPublishingOptions(prev => ({ 
                      ...prev, 
                      createLinkedinPost: checked === true 
                    }))
                  }
                />
                <Label htmlFor="createLinkedinPost">Create LinkedIn post to share job opening</Label>
              </div>
              <p className="text-sm text-gray-500 mt-1 ml-6">
                Generate a social media post to announce this job opening on your LinkedIn profile
              </p>
            </div>
          </div>

            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isPublishing ? 'Publishing...' : 'Publish Job'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Card className="max-w-md p-6">
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <h3 className="text-2xl font-semibold text-gray-900">Job Published!</h3>
              <p className="text-gray-600">
                Your job posting for <strong>{jobData.title}</strong> at <strong>{jobData.company}</strong> has been successfully published.
              </p>
              <Button onClick={() => setShowSuccessModal(false)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default JobPostCreator;
