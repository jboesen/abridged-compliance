import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash (Supabase adds auth info to the URL hash)
        const hash = window.location.hash;
        
        // If there's no hash, something went wrong
        if (!hash) {
          console.error('No hash found in URL for auth callback');
          setStatus('error');
          toast({
            title: 'Verification Error',
            description: 'Unable to verify your email. Please try again or contact support.',
            variant: 'destructive',
          });
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        console.log('Processing auth callback with hash');
        
        // Let Supabase handle the auth state
        // This will update the auth state in the AuthContext
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error in auth callback:', error.message);
          setStatus('error');
          toast({
            title: 'Verification Error',
            description: error.message,
            variant: 'destructive',
          });
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Check if we have a session
        if (data.session) {
          console.log('User verified and authenticated successfully');
          setStatus('success');
          toast({
            title: 'Email Verified',
            description: 'Your email has been verified successfully. Welcome!',
          });
          // Redirect to dashboard after a short delay
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          // If no session, user needs to log in
          console.log('Email verified but user needs to log in');
          setStatus('success');
          toast({
            title: 'Email Verified',
            description: 'Your email has been verified. Please log in to continue.',
          });
          setTimeout(() => navigate('/login'), 1500);
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setStatus('error');
        toast({
          title: 'Verification Error',
          description: 'An unexpected error occurred. Please try again or contact support.',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F2FCE2] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-4">
            {status === 'processing' && (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4D724D]"></div>
            )}
            {status === 'success' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
            {status === 'error' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
          </div>
          <h2 className="font-serif text-2xl mb-2">
            {status === 'processing' && 'Verifying Your Email'}
            {status === 'success' && 'Email Verified'}
            {status === 'error' && 'Verification Failed'}
          </h2>
          <p className="text-gray-600">
            {status === 'processing' && 'Please wait while we verify your email address...'}
            {status === 'success' && 'Your email has been verified successfully. Redirecting you...'}
            {status === 'error' && 'We encountered an issue verifying your email. Redirecting you to login...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
