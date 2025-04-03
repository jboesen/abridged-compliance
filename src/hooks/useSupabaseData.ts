
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export function useSupabaseData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Fetch user profile data
  const fetchProfile = async () => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is a creator
  const fetchCreatorProfile = async () => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found" error
      return data;
    } catch (error) {
      console.error('Error fetching creator profile:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Register as creator
  const registerAsCreator = async (companyName: string, description: string, website?: string) => {
    if (!user) throw new Error('Must be logged in');
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('creators')
        .insert({
          id: user.id,
          company_name: companyName,
          description,
          website
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error registering as creator:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's purchased workflows
  const fetchPurchasedWorkflows = async () => {
    if (!user) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          *,
          workflow:workflows(*)
        `)
        .eq('user_id', user.id);
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching purchased workflows:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's projects (chats)
  const fetchUserProjects = async () => {
    if (!user) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          workflow:workflows(*)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user projects:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new project
  const createProject = async (workflowId: string, projectName: string) => {
    if (!user) throw new Error('Must be logged in');
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          workflow_id: workflowId,
          project_name: projectName
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchProfile,
    fetchCreatorProfile,
    registerAsCreator,
    fetchPurchasedWorkflows,
    fetchUserProjects,
    createProject
  };
}
