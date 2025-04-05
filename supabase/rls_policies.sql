-- Enable Row Level Security on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to select their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy for service role to manage all profiles (optional, for admin purposes)
CREATE POLICY "Service role can manage all profiles"
ON public.profiles
USING (auth.role() = 'service_role');
