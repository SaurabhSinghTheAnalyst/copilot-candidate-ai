
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CandidateProfile {
  id?: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  date_of_birth?: string;
  professional_summary?: string;
  years_of_experience?: string;
  skills?: string[];
  education?: string;
  certifications?: string[];
  overall_score?: number;
  skill_match_score?: number;
  experience_match_score?: number;
  education_match_score?: number;
  resume_file_name?: string;
}

export const useCandidateProfile = () => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: Partial<CandidateProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save your profile",
          variant: "destructive"
        });
        return false;
      }

      // Prepare data for database
      const candidateData = {
        user_id: user.id,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zip_code: profileData.zip_code,
        date_of_birth: profileData.date_of_birth,
        professional_summary: profileData.professional_summary,
        years_of_experience: profileData.years_of_experience,
        skills: profileData.skills,
        education: profileData.education,
        certifications: profileData.certifications,
        overall_score: profileData.overall_score,
        skill_match_score: profileData.skill_match_score,
        experience_match_score: profileData.experience_match_score,
        education_match_score: profileData.education_match_score,
        resume_file_name: profileData.resume_file_name,
        last_updated: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('candidates')
        .upsert(candidateData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving profile:', error);
        toast({
          title: "Error saving profile",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      setProfile(data);
      toast({
        title: "Profile saved successfully!",
        description: "Your profile information has been updated",
      });
      return true;
    } catch (error) {
      console.error('Error in saveProfile:', error);
      toast({
        title: "Error saving profile",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    saveProfile,
    refetchProfile: fetchProfile
  };
};
