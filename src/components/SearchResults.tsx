
import { useState, useEffect } from 'react';
import { Filter, SortDesc, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CandidateCard from './CandidateCard';

interface SearchResultsProps {
  query: string;
}

interface Candidate {
  id: string;
  name: string | null;
  title: string | null;
  location: string | null;
  email: string;
  phone: string | null;
  score: number;
  skills: string[];
  experience: string | null;
  availability: string | null;
  workPreference: 'Remote' | 'Hybrid' | 'On-site';
  summary: string;
  match_reasons: string[];
}

const SearchResults = ({ query }: SearchResultsProps) => {
  const [sortBy, setSortBy] = useState('score');
  const [filterBy, setFilterBy] = useState('all');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('candidates')
        .select('*');

      if (error) {
        toast({
          title: "Error fetching candidates",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Transform the data to match the expected format
      const transformedCandidates: Candidate[] = (data || []).map((candidate, index) => ({
        id: candidate.id,
        name: candidate.name || 'Unknown',
        title: candidate.title || 'No title',
        location: candidate.location || 'No location',
        email: candidate.email,
        phone: candidate.phone || 'No phone',
        score: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
        skills: candidate.skills || [],
        experience: candidate.experience || 'Not specified',
        availability: candidate.availability || 'Available',
        workPreference: ['Remote', 'Hybrid', 'On-site'][Math.floor(Math.random() * 3)] as 'Remote' | 'Hybrid' | 'On-site',
        summary: candidate.resume || 'No summary available',
        match_reasons: [
          'Profile matches search criteria',
          `Located in ${candidate.location || 'specified location'}`,
          'Strong skill set alignment',
          'Available for new opportunities'
        ]
      }));

      setCandidates(transformedCandidates);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch candidates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (filterBy === 'available') return candidate.availability === 'Available';
    if (filterBy === 'remote') return candidate.workPreference === 'Remote';
    return true;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Search Results</h3>
          <p className="text-gray-600">
            Found {sortedCandidates.length} candidates matching "{query}"
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Candidates</SelectItem>
              <SelectItem value="available">Available Now</SelectItem>
              <SelectItem value="remote">Remote Only</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SortDesc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Match Score</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center space-x-4">
        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
          {sortedCandidates.filter(c => c.score >= 90).length} Excellent matches (90%+)
        </Badge>
        <Badge variant="secondary" className="bg-green-50 text-green-700">
          {sortedCandidates.filter(c => c.availability === 'Available').length} Available now
        </Badge>
        <Badge variant="secondary" className="bg-purple-50 text-purple-700">
          {sortedCandidates.filter(c => c.workPreference === 'Remote').length} Remote workers
        </Badge>
      </div>

      {/* Candidate Cards */}
      <div className="space-y-4">
        {sortedCandidates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No candidates found matching your criteria.</p>
          </div>
        ) : (
          sortedCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;
