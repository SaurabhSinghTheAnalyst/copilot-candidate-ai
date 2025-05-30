
import { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  interestedIn: string;
  requiresVisa: boolean;
  visaExpiry?: string;
  summary: string;
  experience: string;
  skills: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
}

const CandidateUploadArea = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    location: '',
    interestedIn: '',
    requiresVisa: false,
    visaExpiry: undefined,
    summary: '',
    experience: '',
    skills: ''
  });
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processFile = (file: File) => {
    const fileId = Math.random().toString(36);
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0
    };

    setFiles(prev => [...prev, newFile]);

    // Simulate file upload and processing
    const uploadInterval = setInterval(() => {
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, progress: Math.min(f.progress + 10, 100) }
          : f
      ));
    }, 200);

    setTimeout(() => {
      clearInterval(uploadInterval);
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'processing', progress: 100 }
          : f
      ));

      // Simulate AI processing
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'complete' }
            : f
        ));
        
        toast({
          title: "Resume uploaded successfully!",
          description: `Your resume ${file.name} has been processed and added to your profile`,
        });
      }, 2000);
    }, 2000);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!isFormValid()) {
      toast({
        title: "Please complete your profile",
        description: "Fill out your personal information before uploading your resume",
        variant: "destructive"
      });
      return;
    }
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(processFile);
  }, [personalInfo]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isFormValid()) {
      toast({
        title: "Please complete your profile",
        description: "Fill out your personal information before uploading your resume",
        variant: "destructive"
      });
      return;
    }
    
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(processFile);
  };

  const isFormValid = () => {
    return personalInfo.name && 
           personalInfo.email && 
           personalInfo.phone && 
           personalInfo.location && 
           personalInfo.interestedIn &&
           (!personalInfo.requiresVisa || personalInfo.visaExpiry);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <File className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusText = (file: UploadedFile) => {
    switch (file.status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'complete':
        return 'Complete';
      case 'error':
        return 'Error';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Build Your Profile</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Complete your profile and upload your resume to get discovered by top recruiters and companies.
        </p>
      </div>

      {/* Personal Information Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="City, Country"
                value={personalInfo.location}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Interested In *</Label>
            <RadioGroup 
              value={personalInfo.interestedIn} 
              onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, interestedIn: value }))}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contract" id="contract" />
                <Label htmlFor="contract">Contract</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full-time" id="full-time" />
                <Label htmlFor="full-time">Full-time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="part-time" id="part-time" />
                <Label htmlFor="part-time">Part-time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="casual" id="casual" />
                <Label htmlFor="casual">Casual</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresVisa"
                checked={personalInfo.requiresVisa}
                onCheckedChange={(checked) => 
                  setPersonalInfo(prev => ({ 
                    ...prev, 
                    requiresVisa: checked as boolean,
                    visaExpiry: checked ? prev.visaExpiry : undefined
                  }))
                }
              />
              <Label htmlFor="requiresVisa">Do you require a visa to work?</Label>
            </div>

            {personalInfo.requiresVisa && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="visaExpiry">Visa Expiry Date *</Label>
                <Input
                  id="visaExpiry"
                  type="date"
                  value={personalInfo.visaExpiry || ''}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, visaExpiry: e.target.value }))}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              placeholder="Brief description of your professional background and career goals..."
              value={personalInfo.summary}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, summary: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              placeholder="e.g., 5 years in software development"
              value={personalInfo.experience}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, experience: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Key Skills</Label>
            <Input
              id="skills"
              placeholder="e.g., React, Node.js, Python, Project Management"
              value={personalInfo.skills}
              onChange={(e) => setPersonalInfo(prev => ({ ...prev, skills: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Upload Resume</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
              isDragOver 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
            } ${
              !isFormValid() ? 'opacity-50 pointer-events-none' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop your resume here
            </h3>
            <p className="text-gray-600 mb-6">
              Support for PDF, DOC, and DOCX files up to 10MB
            </p>
            {!isFormValid() && (
              <p className="text-red-500 text-sm mb-4">
                Please complete your personal information above before uploading your resume
              </p>
            )}
            <div className="space-y-3">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={!isFormValid()}
              />
              <label htmlFor="file-upload">
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  disabled={!isFormValid()}
                >
                  <span className="cursor-pointer">Choose Files</span>
                </Button>
              </label>
              <p className="text-sm text-gray-500">
                or drag and drop files here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Uploaded Files</h3>
          <div className="space-y-3">
            {files.map((file) => (
              <Card key={file.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {getStatusIcon(file.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{file.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(file.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{getStatusText(file)}</span>
                      </div>
                      {(file.status === 'uploading' || file.status === 'processing') && (
                        <Progress value={file.progress} className="mt-2" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateUploadArea;
