import { useState, useRef } from 'react';
import { Mic, MicOff, FileText, Send, Wand2, Loader2, CheckCircle, Globe, Briefcase, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const JobPostCreator = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJob, setGeneratedJob] = useState<{
    title: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
  } | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [createLinkedInPost, setCreateLinkedInPost] = useState(false);
  const [linkedInPostText, setLinkedInPostText] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudioInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak your job requirements...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording stopped",
        description: "Processing your audio...",
      });
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    // Convert audio to base64 for sending to API
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Audio = (reader.result as string).split(',')[1];
      await generateJobFromAudio(base64Audio);
    };
    reader.readAsDataURL(audioBlob);
  };

  const generateJobFromAudio = async (audioData: string) => {
    setIsGenerating(true);
    try {
      // This would call a Supabase Edge Function to transcribe audio and generate job
      // For now, simulating with a timeout
      setTimeout(() => {
        setTextInput("Senior Software Engineer position for React development with 5+ years experience");
        generateJobFromText("Senior Software Engineer position for React development with 5+ years experience");
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process audio",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const generateJobFromText = async (input?: string) => {
    const jobInput = input || textInput;
    if (!jobInput.trim()) {
      toast({
        title: "Please provide input",
        description: "Enter job requirements or record voice notes",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI job generation
      setTimeout(() => {
        const mockJob = {
          title: "Senior React Developer",
          description: "We are looking for an experienced React developer to join our dynamic team. You will be responsible for building and maintaining high-quality web applications using modern React technologies.",
          responsibilities: [
            "Develop and maintain React applications",
            "Collaborate with cross-functional teams",
            "Write clean, maintainable code",
            "Participate in code reviews",
            "Optimize applications for performance"
          ],
          requirements: [
            "5+ years of React development experience",
            "Strong knowledge of JavaScript/TypeScript",
            "Experience with modern build tools",
            "Understanding of RESTful APIs",
            "Bachelor's degree in Computer Science or equivalent"
          ],
          benefits: [
            "Competitive salary and benefits",
            "Remote work flexibility",
            "Professional development opportunities",
            "Health and dental insurance",
            "401(k) matching"
          ]
        };
        
        setGeneratedJob(mockJob);
        setIsGenerating(false);
        
        toast({
          title: "Job post generated!",
          description: "Review and edit the generated job posting",
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate job posting",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const publishJob = () => {
    if (!generatedJob) return;
    
    // Generate LinkedIn post template
    const linkedInTemplate = `🚀 We're hiring! 

${generatedJob.title}

${generatedJob.description.substring(0, 200)}...

Key requirements:
${generatedJob.requirements.slice(0, 3).map(req => `• ${req}`).join('\n')}

Ready to join our team? Apply now!

#hiring #jobs #career #${generatedJob.title.replace(/\s+/g, '').toLowerCase()}`;
    
    setLinkedInPostText(linkedInTemplate);
    setShowPublishModal(true);
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Simulate API calls to different platforms
      for (const platform of selectedPlatforms) {
        console.log(`Publishing to ${platform}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (createLinkedInPost) {
        console.log('Creating LinkedIn post...', linkedInPostText);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast({
        title: "Job posted successfully!",
        description: `Posted to ${selectedPlatforms.length} platform(s)${createLinkedInPost ? ' and created LinkedIn post' : ''}`,
      });
      
      // Reset form
      setGeneratedJob(null);
      setTextInput('');
      setShowPublishModal(false);
      setSelectedPlatforms([]);
      setCreateLinkedInPost(false);
      setLinkedInPostText('');
      
    } catch (error) {
      toast({
        title: "Error publishing job",
        description: "Some platforms may have failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const jobPlatforms = [
    { id: 'hiring-copilot', name: 'Hiring Copilot', icon: Briefcase, description: 'Our internal job board' },
    { id: 'linkedin', name: 'LinkedIn Jobs', icon: Linkedin, description: 'Professional network' },
    { id: 'seek', name: 'Seek', icon: Globe, description: 'Australia & Asia Pacific' },
    { id: 'indeed', name: 'Indeed', icon: Globe, description: 'Global job board' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Create a Job Posting</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Use voice notes or text to describe your job requirements. AI will help generate a comprehensive job posting.
        </p>
      </div>

      {!generatedJob ? (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Job Requirements Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Voice Input Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Notes
              </h3>
              <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  size="lg"
                  className={`w-16 h-16 rounded-full ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </Button>
                <p className="text-gray-600 text-center">
                  {isRecording 
                    ? "Recording... Click to stop" 
                    : "Click to start recording your job requirements"
                  }
                </p>
                {isRecording && (
                  <Badge variant="destructive">
                    Recording in progress
                  </Badge>
                )}
              </div>
            </div>

            {/* Text Input Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Text Input
              </h3>
              <Textarea
                placeholder="Describe the job position, requirements, responsibilities, and any other details..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-32"
              />
              <Button
                onClick={() => generateJobFromText()}
                disabled={isGenerating || !textInput.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Job Posting...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Job Posting with AI
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Generated Job Posting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title</label>
                <Input value={generatedJob.title} onChange={(e) => 
                  setGeneratedJob({...generatedJob, title: e.target.value})
                } />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Job Description</label>
                <Textarea 
                  value={generatedJob.description} 
                  onChange={(e) => 
                    setGeneratedJob({...generatedJob, description: e.target.value})
                  }
                  className="min-h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Responsibilities</label>
                <div className="space-y-2">
                  {generatedJob.responsibilities.map((resp, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-500">•</span>
                      <span className="flex-1">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Requirements</label>
                <div className="space-y-2">
                  {generatedJob.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-500">•</span>
                      <span className="flex-1">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Benefits</label>
                <div className="space-y-2">
                  {generatedJob.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-500">•</span>
                      <span className="flex-1">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button variant="outline" onClick={() => setGeneratedJob(null)}>
                Edit Requirements
              </Button>
              
              <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
                <DialogTrigger asChild>
                  <Button onClick={publishJob} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Publish Job Posting
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Publish Job Posting</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Platform Selection */}
                    <div>
                      <h3 className="font-semibold mb-4">Select Job Platforms</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {jobPlatforms.map((platform) => {
                          const Icon = platform.icon;
                          return (
                            <div
                              key={platform.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                selectedPlatforms.includes(platform.id)
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => handlePlatformToggle(platform.id)}
                            >
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  checked={selectedPlatforms.includes(platform.id)}
                                  onChange={() => handlePlatformToggle(platform.id)}
                                />
                                <Icon className="w-5 h-5" />
                                <div>
                                  <div className="font-medium">{platform.name}</div>
                                  <div className="text-sm text-gray-500">{platform.description}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* LinkedIn Post Option */}
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <Checkbox
                          checked={createLinkedInPost}
                          onCheckedChange={setCreateLinkedInPost}
                        />
                        <Linkedin className="w-5 h-5" />
                        <div>
                          <div className="font-medium">Create LinkedIn Post</div>
                          <div className="text-sm text-gray-500">Share this job opportunity on your LinkedIn profile</div>
                        </div>
                      </div>
                      
                      {createLinkedInPost && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">LinkedIn Post Content</label>
                          <Textarea
                            value={linkedInPostText}
                            onChange={(e) => setLinkedInPostText(e.target.value)}
                            placeholder="Write your LinkedIn post..."
                            className="min-h-32"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPublishModal(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePublish}
                        disabled={isPublishing || (selectedPlatforms.length === 0 && !createLinkedInPost)}
                        className="flex-1"
                      >
                        {isPublishing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Publish ({selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''})
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobPostCreator;
