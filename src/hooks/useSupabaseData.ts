
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

// Define types for the tables we're working with
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type CreatorRow = Database['public']['Tables']['creators']['Row'];
type WorkflowRow = Database['public']['Tables']['workflows']['Row'];
type ChatRow = Database['public']['Tables']['chats']['Row'];
type UserPurchaseRow = Database['public']['Tables']['user_purchases']['Row'];

export function useSupabaseData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Fetch user profile data
  const fetchProfile = async (): Promise<ProfileRow | null> => {
    if (!user) {
      console.log('No user found, cannot fetch profile');
      return null;
    }
    
    setLoading(true);
    try {
      console.log('Fetching profile for user ID:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error in fetchProfile query:', error);
        
        // Check if the error is because the profile doesn't exist
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating a new profile');
          
          // If profile doesn't exist, create one
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              first_name: null,
              last_name: null
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating profile:', createError);
            throw createError;
          }
          
          return newProfile as ProfileRow;
        }
        
        throw error;
      }
      
      console.log('Profile fetched successfully:', data);
      return data as ProfileRow;
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error fetching profile",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is a creator
  const fetchCreatorProfile = async (): Promise<CreatorRow | null> => {
    if (!user) {
      console.log('No user found, cannot fetch creator profile');
      return null;
    }
    
    setLoading(true);
    try {
      console.log('Fetching creator profile for user ID:', user.id);
      
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching creator profile:', error);
        throw error;
      }
      
      console.log('Creator profile fetched:', data);
      return data as CreatorRow;
    } catch (error) {
      console.error('Error fetching creator profile:', error);
      if (error instanceof Error && error.message !== 'No rows found') {
        toast({
          title: "Error fetching creator profile",
          description: error.message,
          variant: "destructive",
        });
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Register as creator
  const registerAsCreator = async (companyName: string, description: string, website?: string): Promise<CreatorRow | null> => {
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
      
      toast({
        title: "Creator profile created",
        description: "You are now registered as a creator",
      });
      
      return data as CreatorRow;
    } catch (error) {
      console.error('Error registering as creator:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's purchased workflows
  const fetchPurchasedWorkflows = async (): Promise<(UserPurchaseRow & { workflow: WorkflowRow })[]> => {
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
      return data as unknown as (UserPurchaseRow & { workflow: WorkflowRow })[];
    } catch (error) {
      console.error('Error fetching purchased workflows:', error);
      toast({
        title: "Error fetching purchased workflows",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's projects (chats)
  const fetchUserProjects = async (): Promise<(ChatRow & { workflow: WorkflowRow })[]> => {
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
      return data as unknown as (ChatRow & { workflow: WorkflowRow })[];
    } catch (error) {
      console.error('Error fetching user projects:', error);
      toast({
        title: "Error fetching projects",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new project
  const createProject = async (workflowId: string, projectName: string): Promise<ChatRow | null> => {
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
      
      toast({
        title: "Project created",
        description: "Your new project has been created successfully",
      });
      
      return data as ChatRow;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error creating project",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
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
