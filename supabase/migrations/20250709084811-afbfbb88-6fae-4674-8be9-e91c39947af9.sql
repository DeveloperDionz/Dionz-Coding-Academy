
-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  total_lessons INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course progress table to track student progress
CREATE TABLE public.course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  completed_lessons INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for courses (readable by all authenticated users)
CREATE POLICY "Authenticated users can view courses" 
ON public.courses FOR SELECT 
TO authenticated
USING (true);

-- RLS policies for course_progress (users can only see their own progress)
CREATE POLICY "Users can view their own progress" 
ON public.course_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.course_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.course_progress FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Insert sample courses
INSERT INTO public.courses (title, description, icon, total_lessons) VALUES
('HTML Fundamentals', 'Learn the building blocks of web development', '', 12),
('CSS Styling', 'Master styling and layout techniques', '🎨', 18),
('JavaScript Programming', 'Dynamic programming and interactivity', '⚡', 25);

-- Function to update progress percentage automatically
CREATE OR REPLACE FUNCTION public.update_progress_percentage()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons INTEGER;
BEGIN
  -- Get total lessons for the course
  SELECT courses.total_lessons INTO total_lessons
  FROM public.courses
  WHERE courses.id = NEW.course_id;
  
  -- Calculate progress percentage
  NEW.progress_percentage = CASE 
    WHEN total_lessons > 0 THEN ROUND((NEW.completed_lessons::DECIMAL / total_lessons) * 100)
    ELSE 0
  END;
  
  -- Update status based on progress
  NEW.status = CASE 
    WHEN NEW.progress_percentage = 0 THEN 'not_started'
    WHEN NEW.progress_percentage = 100 THEN 'completed'
    ELSE 'in_progress'
  END;
  
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update progress
CREATE TRIGGER update_progress_trigger
  BEFORE INSERT OR UPDATE ON public.course_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_progress_percentage();
