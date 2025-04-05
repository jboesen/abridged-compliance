import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Configuration constant to toggle email verification requirement
export const REQUIRE_EMAIL_VERIFICATION = true;

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { first_name?: string, last_name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('DEBUG: AuthProvider initialized');
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileChecked, setProfileChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('DEBUG: AuthProvider useEffect running');
    // First set up auth state listener
    console.log('DEBUG: Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("DEBUG: Auth state changed:", event);
      console.log("DEBUG: Session in auth change:", session ? 'Session exists' : 'No session');
      console.log("DEBUG: User in session:", session?.user ? `User ID: ${session.user.id}` : 'No user');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in",
        });
      }
      
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You've been signed out successfully",
        });
        navigate('/login');
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log("Auth token refreshed");
      }
    });

    // Then check for existing session
    console.log('DEBUG: Checking for existing session');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("DEBUG: Initial session check:", session ? "Found session" : "No session");
      console.log("DEBUG: Initial user:", session?.user ? `User ID: ${session.user.id}` : 'No user');
      console.log("DEBUG: User metadata:", session?.user?.user_metadata ? JSON.stringify(session.user.user_metadata) : 'No metadata');
      setSession(session);
      setUser(session?.user ?? null);
      console.log('DEBUG: Setting loading state to false');
      setLoading(false);
    }).catch(error => {
      console.error('DEBUG: Error getting session:', error);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    console.log('DEBUG: signIn called with email:', email);
    try {
      console.log('DEBUG: Calling supabase.auth.signInWithPassword');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('DEBUG: Sign in response received');
      console.log('DEBUG: Sign in result - data:', data ? 'Data exists' : 'No data', 'error:', error ? `Error: ${error.message}` : 'No error');
      console.log('DEBUG: User after sign in:', data?.user ? `User ID: ${data.user.id}` : 'No user');
      
      if (error) {
        console.log('DEBUG: Sign in error:', error.message);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log('DEBUG: Sign in successful');
    } catch (error) {
      console.error('DEBUG: Unexpected error in signIn:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: { first_name?: string, last_name?: string }) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        // Only apply email verification if the flag is turned on
        ...(REQUIRE_EMAIL_VERIFICATION ? {} : { emailConfirm: false })
      }
    });
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    if (REQUIRE_EMAIL_VERIFICATION) {
      toast({
        title: "Account created",
        description: "Please check your email to verify your account",
      });
      navigate('/verify');
    } else {
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      });
      // When verification is disabled, we don't redirect to verify page
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  console.log('DEBUG: Current auth state - session:', session ? 'Session exists' : 'No session');
  console.log('DEBUG: Current auth state - user:', user ? `User ID: ${user.id}` : 'No user');
  console.log('DEBUG: Current auth state - loading:', loading);
  
  // We removed the profile management from AuthContext to avoid circular dependencies

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
