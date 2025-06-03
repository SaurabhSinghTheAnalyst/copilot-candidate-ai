import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Linkedin, Github, Star, MapPin, Calendar, Award, Briefcase, GraduationCap, MessageCircle, ArrowLeft, Users } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';

const CandidateProfile: React.FC<{ parsedResumeData?: any }> = ({ parsedResumeData }) => {
  const { candidateId } = useParams();
  if (!candidateId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center text-red-500 py-12">Invalid candidate profile link.</div>
      </div>
    );
  }
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { role } = useUserRole();
  // Recruiter message modal state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('candidates')
        .select('*')
        .eq('id', candidateId)
        .single();
      if (!error && data) {
        setCandidate(data);
      }
      setLoading(false);
    };
    fetchCandidate();
  }, [candidateId]);

  // Use parsedResumeData to populate the candidate state if available
  useEffect(() => {
    if (parsedResumeData) {
      setCandidate(parsedResumeData);
    }
  }, [parsedResumeData]);

  // Function to save candidate data to Supabase
  const saveCandidateData = async () => {
    if (!candidate) return;
    const { error } = await (supabase as any)
      .from('candidates')
      .upsert(candidate, { on_conflict: 'id' });
    if (error) {
      console.error('Error saving candidate data:', error);
    } else {
      console.log('Candidate data saved successfully');
    }
  };

  // Helper to get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Helper functions to safely extract first and last names
  const getFirstName = (name: string) => {
    if (!name) return '';
    return name.split(' ')[0];
  };
  const getLastName = (first: string, last: string) => {
    if (!last && first && first.split(' ').length > 1) {
      // If last_name is missing but first_name has multiple words, use the rest as last name
      return first.split(' ').slice(1).join(' ');
    }
    return last || '';
  };

  const openMessageModal = async () => {
    setShowMessageModal(true);
    setAiLoading(true);
    // Fetch AI summary and Q&A from backend
    try {
      const res = await fetch('/api/candidate-background-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate }),
      });
      const data = await res.json();
      setAiSummary(data.summary);
      setAiQuestions(data.questions);
    } catch (e) {
      setAiSummary('Could not load AI background check.');
      setAiQuestions([]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!user?.id || !candidate) return;
    await supabase.from('messages').insert([
      {
        sender_id: user.id,
        receiver_id: candidate.user_id,
        message,
      }
    ]);
    setShowMessageModal(false);
    setMessage('');
    setAiSummary('');
    setAiQuestions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Candidate Profile</h1>
                <p className="text-sm text-gray-600">Professional overview</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : !candidate ? (
          <div className="text-center text-gray-500 py-20">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Candidate Not Found</h3>
            <p>The candidate profile you're looking for doesn't exist.</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <Card className="mb-8 bg-white/90 backdrop-blur-sm border-white/20 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 h-32"></div>
              <CardContent className="relative px-8 pb-8">
                <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-3xl bg-white shadow-xl flex items-center justify-center border-4 border-white">
                      <span className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {getInitials(candidate.first_name)}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {getFirstName(candidate.first_name)}
                      {getLastName(candidate.first_name, candidate.last_name) ? ` ${getLastName(candidate.first_name, candidate.last_name)}` : ''}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">{candidate.email}</p>
                    
                    {/* Social Links */}
                    <div className="flex items-center space-x-3 mb-6">
                      {candidate.linkedin_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {candidate.github_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={candidate.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {candidate.email && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={`mailto:${candidate.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </a>
                        </Button>
                      )}
                    </div>

                    {role === 'recruiter' && (
                      <Button 
                        onClick={openMessageModal}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Candidate
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Experience */}
                <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {candidate.job_experience?.length > 0 ? candidate.job_experience.map((exp: any, idx: number) => (
                        <div key={idx} className="relative pl-8 pb-6 border-l-2 border-blue-200 last:border-l-0">
                          <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                          <div className="bg-blue-50/80 rounded-2xl p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                                <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                              </div>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                <Calendar className="w-3 h-3 mr-1" />
                                {exp.start_date} - {exp.end_date || 'Present'}
                              </Badge>
                            </div>
                            {exp.responsibilities?.length > 0 && (
                              <ul className="space-y-2">
                                {exp.responsibilities.map((resp: string, i: number) => (
                                  <li key={i} className="flex items-start space-x-2 text-gray-700">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-12 text-gray-500">
                          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p>No work experience listed</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {candidate.education_history?.length > 0 ? candidate.education_history.map((edu: any, idx: number) => (
                        <div key={idx} className="bg-purple-50/80 rounded-2xl p-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                              <p className="text-lg text-purple-600 font-medium">{edu.institution}</p>
                            </div>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              {edu.start_date} - {edu.end_date || 'Present'}
                            </Badge>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-12 text-gray-500">
                          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p>No education history listed</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Skills */}
                <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Award className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-bold text-gray-900">Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills?.length > 0 ? candidate.skills.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="bg-green-100/80 text-green-700 border-green-200">
                          {skill}
                        </Badge>
                      )) : (
                        <p className="text-gray-500 text-sm">No skills listed</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Certifications */}
                {candidate.certifications && candidate.certifications.length > 0 && (
                  <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Award className="w-5 h-5 text-orange-600" />
                        <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
                      </div>
                      <ul className="space-y-2">
                        {candidate.certifications.map((cert: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                            <Star className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg bg-white shadow-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Contact Candidate</h2>
                {aiLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading AI insights...</span>
                  </div>
                ) : (
                  <>
                    {aiSummary && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-700 mb-2">AI Background Check:</h3>
                        <p className="text-gray-700 text-sm">{aiSummary}</p>
                      </div>
                    )}
                    {aiQuestions.length > 0 && (
                      <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                        <h3 className="font-semibold text-purple-700 mb-2">Suggested Questions:</h3>
                        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                          {aiQuestions.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                  </>
                )}
                <textarea
                  className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  rows={4}
                  placeholder="Write your message to the candidate..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
