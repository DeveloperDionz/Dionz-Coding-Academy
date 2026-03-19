import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, CheckCircle, Circle, Clock } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LessonContent from '@/components/LessonContent';

interface Course {
  id: string;
  course_id?: string;
  title: string;
  description: string;
  icon: string;
  total_lessons: number;
}

interface Lesson {
  id: number;
  title: string;
  content: string;
  completed: boolean;
  isHeading?: boolean;
}

interface CourseProgress {
  id: string;
  course_id: string;
  completed_lessons: number;
  progress_percentage: number;
  status: string;
  last_accessed: string;
}

// Helper component to render course icons
const CourseIcon = ({ icon, title, size = "text-2xl" }: { icon: string; title: string; size?: string }) => {
  const [imageError, setImageError] = useState(false);
  
  // Check if icon is a URL or emoji
  const isUrl = icon && (icon.startsWith('http') || icon.startsWith('/'));
  
  if (isUrl && !imageError) {
    return (
      <img 
        src={icon} 
        alt={`${title} icon`}
        className="w-8 h-8 object-contain"
        onError={() => {
          console.log(`Failed to load image: ${icon}`);
          setImageError(true);
        }}
      />
    );
  }
  
  // Fallback to emoji or default icon
  return (
    <span className={size}>
      {icon && !isUrl ? icon : ''}
    </span>
  );
};

const Course = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [loading, setLoading] = useState(true);

  const goToNextLesson = () => {
  let next = currentLesson + 1;
  while (next < lessons.length && lessons[next].title.startsWith("###")) {
    next++;
  }
  if (next < lessons.length) setCurrentLesson(next);
};

const goToPrevLesson = () => {
  let prev = currentLesson - 1;
  while (prev >= 0 && lessons[prev].title.startsWith("###")) {
    prev--;
  }
  if (prev >= 0) setCurrentLesson(prev);
};

const realLessons = lessons.filter(l => !l.isHeading);
const currentIndex = realLessons.findIndex(l => l.id === lessons[currentLesson].id);

  useEffect(() => {
    if (slug && user) {
      fetchCourseData();
    }
  }, [slug, user]);

  const fetchCourseData = async () => {
    if (!slug || !user) return;

    try {
      // Fetch course details
      setLoading(true);
      const formattedTitle = slug.replace(/-/g, ' '); // Convert slug back to title format
      const { data: rawData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .ilike('title', formattedTitle) // Use ILIKE for case-insensitive search
        .single();

      if (courseError || !rawData) {
        console.error('Error fetching course:', courseError);
        toast({
          title: "Error",
          description: "Failed to load course",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }

      const currentCourse = rawData as any as Course;
      setCourse(currentCourse);

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', currentCourse.course_id)
        .maybeSingle();

      if (progressError && progressError.code !== 'PGRST116') {
        console.error('Error fetching progress:', progressError);
      } else if (progressData) {
        setProgress(progressData);
      }

      // Generate lessons based on course
      generateLessons(currentCourse);
      
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateLessons = (courseData: Course) => {
    const lessonTemplates: { [key: string]: string[] } = {
      'HTML Fundamentals': [
        'Introduction to HTML',
        'HTML Text Editors',
        'Building Blocks of HTML',
        'HTML Attributes',
        'HTML Elements',
        'HTML Formatting',
        'HTML Headings',
        'HTML Paragraphs',
        'HTML Phrase tags',
        'HTML Anchor',
        'HTML Images',
        'HTML Lists',
        'HTML Ordered List',
        'HTML Unordered List',
        'HTML Description List',
        'HTML Form',
        'HTML Form Input types',
        'HTML Form attribute',
        'HTML style using CSS',
        'HTML Classes',
        'HTML Id attribute',
        'HTML iframes',
        'HTML JavaScript',
        'HTML Comments',
        'HTML File Paths',
        'HTML Head',
        'HTML Layouts',
        'HTML Layout Techniques',
        'HTML Responsive',
        'HTML Computer Code',
        'HTML Entities',
        'HTML Symbols',
        'HTML Charset',
        'HTML URL Encode'
      ],
      'CSS Styling': [
        '### CSS Basics',
        'CSS Tutorial',
        'Introduction to CSS',
        'CSS-Syntax',
        'CSS id and class',
        'CSS Text',
        'CSS Fonts',
        'CSS Links',
        'CSS Tables',
        'CSS Border',
        'CSS Padding',
        'CSS Margin',
        'CSS Color Names',
        'CSS Gradients',
        '### CSS Guide',
        'The Ultimate Guide to Flexbox',
        'CSS3 Properties',
        '### CSS Selectors',
        'CSS * Selector',
        'CSS :active Pseudo Class',
        'CSS ::after Pseudo element',
        'CSS ::before Pseudo Element',
        'CSS :checked Pseudo Class',
        'CSS :default Pseudo Class',
        'CSS :dir() Pseudo Class',
        'CSS :disabled Pseudo Class',
        'CSS :empty Pseudo Class',
        'CSS :enabled Pseudo Class',
        'CSS :first-child Pseudo Class',
        'CSS ::first-letter Pseudo element',
        'CSS ::first-line Pseudo element',
        'CSS ::first-of-type Pseudo Class',
        'CSS :focus Pseudo Class',
        'CSS :fullscreen Pseudo Class',
        'CSS :hover Pseudo Class',
        'CSS :in-range Pseudo Class',
        'CSS :indeterminate Pseudo Class',
        'CSS :invalid Pseudo Class',
        'CSS :lang() Pseudo Class',
        'CSS :last-child pseudo Class',
        'CSS :last-of-type Pseudo class',
        'CSS :link Pseudo Class',
        'CSS :not() Pseudo Class',
        'CSS :nth-child() Pseudo Class',
        'CSS :nth-last-child Pseudo Class',
        'CSS :nth-last-of-type() Pseudo Class',
        'CSS :nth-of-type() Pseudo Class',
        'CSS :only-child Pseudo Class',
        'CSS :only-of-type Pseudo class',
        'CSS :optional Pseudo Class',
        'CSS :out-of-range Pseudo Class',
        'CSS ::placeholder Pseudo element',
        'CSS :read-only Pseudo Class',
        'CSS :read-write Pseudo Class',
        'CSS :required Pseudo Class',
        'CSS :root Pseudo Class',
        'CSS :scope Pseudo Class',
        'CSS ::selection Pseudo Element',
        'CSS :target Pseudo Class',
        'CSS :valid Pseudo Class',
        'CSS :visited pseudo Class',
      ],
      'JavaScript Programming': [
        '###Javascript Basic',
        'Introduction to JavaScript',
        'Start Using Javascript',
        'Javascript comments',
        'Javascript with DOM',
        'Javascript Use Strict',
        'Javascript variables',
        'Javascript Data Types',
        'Javascript Simple Actions alert, prompt, confirm',
        'Javascript Operators',
        'Comparison Operators',
        'Javascript Logical Operators',
        'Javascript Conditional Operators: if, "?"',
        'Javascript Switch',
        'Javascript Loops: while and for',
        'Javascript Functions',
        'Javascript Function Expressions',
        'Javascript Arrow Functions',
        '###Objects: the basics',
        'Javascript Objects',
        'Javascript Object Methods, "this"',
        'Javascript Garbage Collection',
        'Javascript Symbol Types',
        'JavaScript Object to Primitive Conversion',
        'Javascript Constructor, operator "new"',
        '###Data types',
        'Javascript Methods of Primitives',
        'JavaScript Numbers',
        'JavaScript Math',
        'JavaScript Strings',
        'JavaScript Arrays',
        'JavaScript Array Methods',
        'JavaScript Iterables',
        'JavaScript Map and Set',
        'JavaScript WeakMap and weakSet',
        'JavaScript Object.keys, Values, Entries',
        'JavaScript Destructuring Assignment',
        'JavaScript Date and Time',
        'JavaScript JSON methods, toJSON',
        '###Advanced Working With functions',
        'JavaScript Recursion and Stack',
        'JavaScript Rest Parameters and Spread Syntax',
        'JavaScript Variable Scope',
        'JavaScript The Old "var"',
        'JavaScript Global Object',
        'JavaScript Function object, NFE',
        'JavaScript The "new function" Syntax',
        'JavaScript setTimeout and setInterval',
        'JavaScript Decorators and Forwarding, Call/Apply',
        'JavaScript Function Binding',
        'JavaScript Arrow Functions Revisted',
        '###Object properties configuration',
        'JavaScript Property Flags and Descriptors',
        'JavaScript Property Getters and setters',
        '###Prototypes, inheritance',
        'JavaScript Prototypal inheritance',
        'JavaScript F .prototype',
        'JavaScript Native Prototypes',
        'JavaScript Prototype Methods, Objects Without __proto__',
        '###Classes',
        'JavaScript Class Basic Syntax',
        'JavaScript Class Inheritance',
        'JavaScript Static Properties and Methods',
        'JavaScript Private & Protected Properties & Methods',
        'JavaScript Extending Built-in Classes',
        'JavaScript Class Checking: "instanceof"',
        'JavaScript Mixins',
        '###Error handling',
        'JavaScript Error handling, "try..catch"',
        'JavaScript Custom Errors, Extending error',
        '###Promises, async/await',
        'JavaScript Introduction: callbacks',
        'JavaScript Promise',
        'JavaScript Promise Chaining',
        'JavaScript error Handling with Promises',
        'JavaScript Promise API',
        'JavaScript Promisification',
        'JavaScript Microtasks',
        'JavaScript async/await',
      ],
      'Python Programming':[],
      'React Programming':[],
      'Git Version Control':[],
      'PHP Programming':[],
      'Java Programming':[]
    };

    const courseLessons = lessonTemplates[courseData.title] || [];
    const generatedLessons = courseLessons.map((title, index) => ({
      id: index + 1,
      title,
      content: title.startsWith("###") ? null : `Content for ${title}...`,
      completed: false, // logic for progress here
      isHeading: title.startsWith("###")
    }));

    setLessons(generatedLessons);

    //Find the first index that is NOT a heading
    const firstRealLessonIndex = generatedLessons.findIndex(l => !l.isHeading);
    if (firstRealLessonIndex !== -1) {
      setCurrentLesson(firstRealLessonIndex);
    }
  };

  const markLessonComplete = async (lessonIndex: number) => {
    if (!user || !slug || !progress) return;

    const realLessons = lessons.filter(l => !l.isHeading);
    const realIndex = realLessons.findIndex(l => l.id === lessons[lessonIndex].id);
    const newCompletedLessons = Math.max(progress.completed_lessons, realIndex + 1);

    try {
      const { error } = await supabase
        .from('course_progress')
        .update({
          completed_lessons: newCompletedLessons,
          progress_percentage: Math.round((newCompletedLessons / realLessons.length) * 100),
          status: newCompletedLessons === realLessons.length ? 'completed' : 'in_progress',
          last_accessed: new Date().toISOString()
        })
        .eq('id', progress.id);

      if (error) {
        console.error('Error updating progress:', error);
        toast({
          title: "Error",
          description: "Failed to update progress",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setProgress(prev => prev ? {
        ...prev,
        completed_lessons: newCompletedLessons,
        progress_percentage: Math.round((newCompletedLessons / realLessons.length) * 100),
        status: newCompletedLessons === realLessons.length ? 'completed' : 'in_progress'
      } : null);

      setLessons(prev => prev.map((lesson) => {
        if (lesson.isHeading) return lesson;
        const realIndex = realLessons.findIndex(l => l.id === lesson.id);
        return {
        ...lesson,
        completed: realIndex < newCompletedLessons
      };
    })
    );

      toast({
        title: "Lesson Completed!",
        description: `Great job completing: ${lessons[lessonIndex]?.title}`,
      });

      // Move to next lesson
      let next = lessonIndex + 1;
      while (next < lessons.length && lessons[next].isHeading) {
        next++;
      }
      if(next < lessons.length){
        setCurrentLesson(next);
      }
      
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
  <div className="relative h-32 w-32 flex items-center justify-center">

    {/* Spinner ring */}
    <div className="absolute inset-0 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>

    {/* Favicon center */}
    <img 
      src="/favicon.ico" 
      alt="Loading" 
      className="h-16 w-16 object-contain"
    />
  </div>
</div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/100 to-black/100">
      {/* Header */}
      <header className="bg-black/100 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-white/100 hover:text-black/100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <CourseIcon icon={course.icon} title={course.title} />
              <h1 className="text-2xl font-bold text-white">{course.title}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-3 py-1 text-white/100">
              {progress?.completed_lessons || 0}/{course.total_lessons} lessons
            </Badge>
            <div className="w-32 text-white">
              <Progress value={progress?.progress_percentage || 0} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Lessons Sidebar */}
<div className="lg:col-span-1">
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Course Content</CardTitle>
      <CardDescription>
        Track your progress through each lesson
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-2 max-h-96 overflow-y-auto">
  {lessons.map((lesson, index) => {
    const isHeading = lesson.title.startsWith("###");

    // If it's a heading, render a non-clickable label
    if (isHeading) {
      return (
        <div
          key={lesson.id}
          className="mt-4 mb-1 px-2 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 pb-1 select-none"
        >
          {lesson.title.replace("###", "").trim()}
        </div>
      );
    }

    // Otherwise, render the clickable lesson
    return (
      <div
        key={lesson.id}
        className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
          currentLesson === index 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'hover:bg-slate-100'
        }`}
        onClick={() => setCurrentLesson(index)}
      >
        {lesson.completed ? (
          <CheckCircle className="w-4 h-4 text-yellow-600" />
        ) : currentLesson === index ? (
          <Play className="w-4 h-4 text-blue-600" />
        ) : (
          <Circle className="w-4 h-4 text-slate-400" />
        )}
        <span className="text-sm font-medium truncate">
          {lesson.title}
        </span>
      </div>
    );
  })}
</CardContent>
  </Card>
</div>


          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
  <div className="flex items-center justify-between">
    <div>
      <CardTitle className="text-2xl">
        {lessons[currentLesson]?.title.replace("###", "").trim()}
      </CardTitle>

      {!lessons[currentLesson]?.isHeading && (
        <CardDescription className="flex items-center space-x-2 mt-2">
  <Clock className="w-4 h-4" />
  <span>
    Lesson {currentIndex + 1} of {realLessons.length}
  </span>
</CardDescription>

      )}
    </div>

    {!lessons[currentLesson]?.isHeading && !lessons[currentLesson]?.completed && (
      <Button 
        onClick={() => markLessonComplete(currentLesson)}
        className="bg-yellow-600 hover:bg-yellow-700"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Mark Complete
      </Button>
    )}
  </div>
</CardHeader>

              <CardContent>
                <LessonContent 
                  lesson={lessons[currentLesson]} 
                  courseTitle={course.title}
                />
                

                <div className="flex justify-between pt-6 border-t mt-8">
                  <Button 
  variant="outline" 
  onClick={goToPrevLesson}
  disabled={currentLesson === 0}
>   
  Previous Lesson
</Button>

<Button 
  onClick={goToNextLesson}
  disabled={currentLesson === lessons.length - 1}
>
  Next Lesson
</Button>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;