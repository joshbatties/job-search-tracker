/*
  # Job Search Tracker Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text, nullable)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamp)
    - `jobs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles.id)
      - `company` (text)
      - `position` (text)
      - `location` (text)
      - `job_type` (text)
      - `salary_range` (text)
      - `application_date` (date)
      - `status` (text)
      - `notes` (text, nullable)
      - `url` (text, nullable)
      - `created_at` (timestamp)
    - `interviews`
      - `id` (uuid, primary key)
      - `job_id` (uuid, foreign key to jobs.id)
      - `interview_date` (date)
      - `interview_type` (text)
      - `interviewer` (text, nullable)
      - `notes` (text, nullable)
      - `result` (text)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company text NOT NULL,
  position text NOT NULL,
  location text NOT NULL,
  job_type text NOT NULL,
  salary_range text NOT NULL,
  application_date date NOT NULL,
  status text NOT NULL,
  notes text,
  url text,
  created_at timestamptz DEFAULT now()
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  interview_date date NOT NULL,
  interview_type text NOT NULL,
  interviewer text,
  notes text,
  result text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for jobs
CREATE POLICY "Users can view own jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs"
  ON jobs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for interviews
CREATE POLICY "Users can view own interviews"
  ON interviews
  FOR SELECT
  TO authenticated
  USING ((SELECT user_id FROM jobs WHERE jobs.id = interviews.job_id) = auth.uid());

CREATE POLICY "Users can create own interviews"
  ON interviews
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT user_id FROM jobs WHERE jobs.id = interviews.job_id) = auth.uid());

CREATE POLICY "Users can update own interviews"
  ON interviews
  FOR UPDATE
  TO authenticated
  USING ((SELECT user_id FROM jobs WHERE jobs.id = interviews.job_id) = auth.uid());

CREATE POLICY "Users can delete own interviews"
  ON interviews
  FOR DELETE
  TO authenticated
  USING ((SELECT user_id FROM jobs WHERE jobs.id = interviews.job_id) = auth.uid());

-- Create trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();