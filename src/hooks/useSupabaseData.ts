import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

// Define types for the tables we're working with
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type CreatorRow = Database['public']['Tables']['creators']['Row'];
type WorkflowRow = Database['public']['Tables']['workflows']['Row'];
type ChatRow = Database['public']['Tables']['chats']['Row'];
type UserPurchaseRow = Database['public']['Tables']['user_purchases']['Row'];

export function useSupabaseData() {
  // Get the current user from Supabase directly instead of from AuthContext
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Initialize the current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);
    };
    
    getCurrentUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setCurrentUser(session?.user ?? null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data
  const fetchProfile = useCallback(async (): Promise<ProfileRow | null> => {
    if (!currentUser) {
      console.log('No user found, cannot fetch profile');
      return null;
    }
    
    setLoading(true);
    
    // Create a timeout promise to prevent infinite loading
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Profile fetch timed out after 10 seconds'));
      }, 10000);
    });
    
    try {
      console.log('Fetching profile for user ID:', currentUser.id);
      
      // Race the fetch against the timeout
      const profilePromise = (async () => {
        // Don't use .single() which causes 406 errors when no profile exists
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
        console.log(data, error)
        if (error) {
          console.error('Error in fetchProfile query:', error);
          throw error;
        }
        
        // Check if we got any results
        if (!data || data.length === 0) {
          console.log('Profile not found for user:', currentUser.id);
          // Return null to indicate no profile was found, but don't throw an error
          return null;
        }
        
        console.log('Profile fetched successfully:', data[0]);
        return data[0] as ProfileRow;
      })();
      
      // Race the profile fetch against the timeout
      const result = await Promise.race([profilePromise, timeoutPromise]);
      
      // If no profile was found, return a default profile structure
      // This is our fallback mechanism
      if (result === null) {
        const defaultProfile: ProfileRow = {
          id: currentUser.id,
          first_name: currentUser.user_metadata?.first_name || null,
          last_name: currentUser.user_metadata?.last_name || null,
          avatar_url: null,
          role: 'user', // Add default role
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log('Returning default profile for user:', currentUser.id);
        return defaultProfile;
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error fetching profile",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      
      // Return a fallback profile when there's an error
      const fallbackProfile: ProfileRow = {
        id: currentUser.id,
        first_name: currentUser.user_metadata?.first_name || null,
        last_name: currentUser.user_metadata?.last_name || null,
        avatar_url: null,
        role: 'user', // Add default role
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Returning fallback profile due to error');
      return fallbackProfile;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Check if user is a creator
  const fetchCreatorProfile = useCallback(async (): Promise<CreatorRow | null> => {
    if (!currentUser) {
      console.log('No user found, cannot fetch creator profile');
      return null;
    }
    
    setLoading(true);
    try {
      console.log('Fetching creator profile for user ID:', currentUser.id);
      
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', currentUser.id)
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
  }, [currentUser]);

  // Register as creator
  const registerAsCreator = useCallback(async (companyName: string, description: string, website?: string): Promise<CreatorRow | null> => {
    if (!currentUser) throw new Error('Must be logged in');
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('creators')
        .insert({
          id: currentUser.id,
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
  }, [currentUser]);

  // Fetch user's purchased workflows
  const fetchPurchasedWorkflows = useCallback(async (): Promise<(UserPurchaseRow & { workflow: WorkflowRow })[]> => {
    if (!currentUser) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          *,
          workflow:workflows(*)
        `)
        .eq('user_id', currentUser.id);
        
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
  }, [currentUser]);

  // Fetch user's projects (chats)
  const fetchUserProjects = useCallback(async (): Promise<(ChatRow & { workflow: WorkflowRow })[]> => {
    if (!currentUser) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          workflow:workflows(*)
        `)
        .eq('user_id', currentUser.id)
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
  }, [currentUser]);

  // Create a new project
  const createProject = useCallback(async (workflowId: string, projectName: string): Promise<ChatRow | null> => {
    if (!currentUser) throw new Error('Must be logged in');
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: currentUser.id,
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
  }, [currentUser]);

  // Create a user profile explicitly
  const createProfile = useCallback(async (firstName?: string, lastName?: string): Promise<ProfileRow | null> => {
    if (!currentUser) {
      console.log('No user found, cannot create profile');
      throw new Error('Must be logged in to create a profile');
    }
    
    setLoading(true);
    try {
      console.log('Creating profile for user ID:', currentUser.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: currentUser.id,
          first_name: firstName || currentUser.user_metadata?.first_name || null,
          last_name: lastName || currentUser.user_metadata?.last_name || null
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }
      
      console.log('Profile created successfully:', data);
      toast({
        title: "Profile created",
        description: "Your profile has been created successfully",
      });
      
      return data as ProfileRow;
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error creating profile",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Helper function to ensure a user has a profile
  const ensureUserProfile = useCallback(async (): Promise<ProfileRow | null> => {
    if (!currentUser) return null;
    
    try {
      // First try to fetch the profile
      const profile = await fetchProfile();
      
      // If profile exists, return it
      if (profile) return profile;
      
      // If no profile, create one
      console.log('No profile found, creating one');
      return await createProfile(
        currentUser.user_metadata?.first_name,
        currentUser.user_metadata?.last_name
      );
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      toast({
        title: "Profile Error",
        description: "There was an issue with your profile. Please try again later.",
        variant: "destructive",
      });
      return null;
    }
  }, [currentUser]);
  
  return {
    loading,
    currentUser,
    fetchProfile,
    createProfile,
    ensureUserProfile,
    fetchCreatorProfile,
    registerAsCreator,
    fetchPurchasedWorkflows,
    fetchUserProjects,
    createProject
  };
}