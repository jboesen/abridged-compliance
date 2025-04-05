-- RLS policies for the profiles table
-- Enable RLS on the profiles table
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own profile
CREATE POLICY "Users can read their own profile" 
ON "public"."profiles"
FOR SELECT
USING (auth.uid() = id);

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON "public"."profiles"
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON "public"."profiles"
FOR UPDATE
USING (auth.uid() = id);

-- Give anon and authenticated roles access to the profiles table
GRANT SELECT, INSERT, UPDATE ON "public"."profiles" TO anon, authenticated;
