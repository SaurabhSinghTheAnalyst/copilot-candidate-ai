
import { useState } from 'react';
import { Filter, SortDesc, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CandidateCard from './CandidateCard';

interface SearchResultsProps {
  query: string;
}

const SearchResults = ({ query }: SearchResultsProps) => {
  const [sortBy, setSortBy] = useState('score');
  const [filterBy, setFilterBy] = useState('all');

  // Mock candidate data
  const mockCandidates = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Senior AI Engineer',
      location: 'London, UK',
      email: 'sarah.chen@example.com',
      phone: '+44 20 1234 5678',
      score: 95,
      skills: ['Python', 'LangChain', 'RAG', 'Vector Databases', 'OpenAI', 'PyTorch', 'MLOps'],
      experience: '6 years',
      availability: 'Available' as const,
      workPreference: 'Remote' as const,
      summary: 'Senior AI engineer with 6 years of experience building production ML systems. Led implementation of RAG-based chatbots using LangChain and vector databases. Strong background in NLP and generative AI.',
      match_reasons: [
        'Extensive experience with LangChain and RAG implementations',
        'Located in Europe (London) as requested',
        'Open to contract work according to profile',
        'Strong background in generative AI and vector databases'
      ]
    },
    {
      id: '2',
      name: 'Marcus Schmidt',
      title: 'Machine Learning Engineer',
      location: 'Berlin, Germany',
      email: 'marcus.schmidt@example.com',
      phone: '+49 30 1234 5678',
      score: 88,
      skills: ['Python', 'TensorFlow', 'LangChain', 'FastAPI', 'Docker', 'Kubernetes'],
      experience: '4 years',
      availability: 'Open to opportunities' as const,
      workPreference: 'Hybrid' as const,
      summary: 'ML engineer specializing in NLP and conversational AI. Built several RAG-based applications using LangChain. Experience with production deployment and MLOps practices.',
      match_reasons: [
        'Solid experience with LangChain framework',
        'Located in Germany (Europe)',
        'Background in conversational AI and RAG systems',
        'Available for new opportunities'
      ]
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      title: 'Lead Data Scientist',
      location: 'Madrid, Spain',
      email: 'elena.rodriguez@example.com',
      phone: '+34 91 1234 567',
      score: 82,
      skills: ['Python', 'Hugging Face', 'LangChain', 'AWS', 'Embeddings', 'Vector Search'],
      experience: '7 years',
      availability: 'Available' as const,
      workPreference: 'Remote' as const,
      summary: 'Lead data scientist with expertise in NLP and information retrieval. Built enterprise RAG solutions using LangChain and vector databases. Strong research background.',
      match_reasons: [
        'Leadership experience in AI/ML teams',
        'Based in Spain (European timezone)',
        'Experience with RAG and vector search systems',
        'Available for immediate start'
      ]
    }
  ];

  const filteredCandidates = mockCandidates.filter(candidate => {
    if (filterBy === 'available') return candidate.availability === 'Available';
    if (filterBy === 'remote') return candidate.workPreference === 'Remote';
    return true;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

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
        {sortedCandidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
