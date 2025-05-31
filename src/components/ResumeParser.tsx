
import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ParsedResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  professionalInfo: {
    summary: string;
    experience: string;
    skills: string[];
    education: string;
    certifications: string[];
  };
  score: {
    overall: number;
    skillMatch: number;
    experienceMatch: number;
    educationMatch: number;
  };
}

interface ResumeParserProps {
  onDataParsed: (data: ParsedResumeData) => void;
  requirements?: string;
}

const ResumeParser = ({ onDataParsed, requirements }: ResumeParserProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Convert file to base64
      const fileBuffer = await file.arrayBuffer();
      const base64File = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

      // Call the resume parsing edge function
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: {
          fileContent: base64File,
          fileName: file.name,
          requirements: requirements || ''
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        throw new Error(error.message);
      }

      setUploadedFile(file.name);
      onDataParsed(data);

      toast({
        title: "Resume parsed successfully!",
        description: "Your profile has been auto-filled with extracted data",
      });

    } catch (error) {
      console.error('Resume parsing error:', error);
      toast({
        title: "Failed to parse resume",
        description: "Please try again or fill the form manually",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>AI Resume Parser</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload your resume for AI parsing
          </h3>
          <p className="text-gray-600 mb-6">
            Our AI will extract your information, skills, and calculate a profile score
          </p>
          
          {uploadedFile ? (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{uploadedFile}</span>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
                disabled={isUploading}
              />
              <label htmlFor="resume-upload">
                <Button 
                  asChild 
                  disabled={isUploading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <span className="cursor-pointer flex items-center space-x-2">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing... {uploadProgress}%</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Choose Resume</span>
                      </>
                    )}
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
  );
};

export default ResumeParser;
