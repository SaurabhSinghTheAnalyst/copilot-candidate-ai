import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const JobApplicants: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [candidateScores, setCandidateScores] = useState<{[id: string]: string}>({});
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('applications')
        .select('*, candidates(*)')
        .eq('job_id', jobId);
      if (!error && data) {
        setApplicants(data);
      }
      setLoading(false);
    };
    const fetchJob = async () => {
      const { data, error } = await (supabase as any)
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      if (!error && data) {
        setJob(data);
      }
    };
    fetchApplicants();
    fetchJob();
  }, [jobId]);

  const handleScoreCandidates = async () => {
    setScoring(true);
    setCandidateScores({});
    const candidateProfiles = applicants.map(app => app.candidates).filter(Boolean);
    const res = await fetch('http://192.168.20.19:8000/api/score-candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job,
        candidates: candidateProfiles
      })
    });
    const scores = await res.json();
    const scoreMap = {};
    scores.forEach(s => { scoreMap[s.candidate_id] = s.score; });
    setCandidateScores(scoreMap);
    setScoring(false);
  };

  const parseScoreAndReason = (scoreString: string) => {
    if (!scoreString) return { score: null, reason: null };
    const match = scoreString.match(/SCORE:\s*(\d+)/i);
    const reasonMatch = scoreString.match(/REASON:\s*(.*)/i);
    return {
      score: match ? match[1] : null,
      reason: reasonMatch ? reasonMatch[1] : null
    };
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Applicants for Job</h2>
        <Button onClick={handleScoreCandidates} disabled={applicants.length === 0 || scoring}>
          {scoring ? 'Scoring...' : 'Score Candidates'}
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : applicants.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No applicants yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((app) => {
            const scoreString = candidateScores[app.candidates?.id];
            const { score } = parseScoreAndReason(scoreString);
            return (
              <Card key={app.id} className="hover:shadow-lg transition-shadow cursor-pointer relative" onClick={() => navigate(`/candidates/${app.candidates?.id}`)}>
                {score && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-bold shadow">
                    {parseInt(score, 10) * 10}%
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{app.candidates?.first_name} {app.candidates?.last_name}</CardTitle>
                  <div className="text-gray-600 text-sm">{app.candidates?.email}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-700 mb-2">Skills: {app.candidates?.skills?.join(', ') || 'N/A'}</div>
                  <div className="text-gray-700 mb-2">Open to: {app.candidates?.work_preference || 'N/A'}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobApplicants; 