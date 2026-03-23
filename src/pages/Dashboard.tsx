import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Code, Users, Trophy, LogOut, User, Calendar, Award } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Cropper from 'react-easy-crop';   // npm install react-easy-crop
import { jsPDF } from 'jspdf';          // npm install jspdf
import { getCroppedImg } from '@/utils/cropImage'; // utility we'll add (circle crop)
import { slugify } from '@/utils/slugify'; // utility to create URL-friendly slugs


interface UserProfile {
  id: number;
  user_id: string;
  full_name: string;
  email: string;
  created_at: string;
  avatar_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  total_lessons: number;
}

interface CourseProgress {
  id: string;
  course_id: string;
  completed_lessons: number;
  progress_percentage: number;
  status: string;
  last_accessed: string;
}

interface CourseWithProgress extends Course {
  course_id: string;
  progress?: CourseProgress;
}

// Helper component to render course icons
const CourseIcon = ({ icon, title }: { icon: string; title: string }) => {
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
        onLoad={() => console.log(`Successfully loaded image: ${icon}`)}
      />
    );
  }
  
  // Fallback to emoji or default icon
  return (
    <span className="text-3xl">
      {icon && !isUrl ? icon : '📚'}
    </span>
  );
};

const Dashboard = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const comingSoonCourses = ["Python Programming", "React Programming", "PHP Programming",];

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (!event.target.files || !event.target.files[0] || !user) return;

  const file = event.target.files[0];
  const imageUrl = URL.createObjectURL(file);

  try {
    // Crop the image (circle)
    const croppedBlob = await getCroppedImg(imageUrl);

    // Upload to Supabase Storage
    const filePath = `avatars/${user.id}-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, croppedBlob, { upsert: true });

    if (uploadError) {
      console.error('Upload failed:', uploadError);
      toast({
        title: 'Upload Failed',
        description: 'Could not upload profile picture.',
        variant: 'destructive',
      });
      return;
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    // Update Supabase profile
    const { error: updateError } = await (supabase as any)
  .from('profiles')  // <-- tell Supabase what type to expect
  .update({ avatar_url: avatarUrl as string }) // cast for safety
  .eq('user_id', user.id);


    if (updateError) {
      console.error('Error saving avatar to profile:', updateError);
      toast({
        title: 'Error',
        description: 'Failed to save avatar to profile.',
        variant: 'destructive',
      });
      return;
    }

    // Update local state
    setAvatar(avatarUrl);
    setProfile(prev => (prev ? { ...prev, avatar_url: avatarUrl } : prev));

    toast({
      title: 'Success',
      description: 'Profile picture updated!',
    });
  } catch (error) {
    console.error('Error cropping/uploading avatar:', error);
  }
};



  useEffect(() => {
    if (user) {
      fetchOrCreateProfile();
      fetchCoursesWithProgress();
    }
  }, [user]);

  const fetchOrCreateProfile = async () => {
    if (!user) return;
    
    try {
      // First try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

        

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive"
        });
        return;
      }

      if (existingProfile) {
        console.log('Profile found:', existingProfile);
        setProfile(existingProfile);
        setAvatar((existingProfile as UserProfile).avatar_url || null);


      } else {
        // Create new profile if it doesn't exist
        console.log('No profile found, creating new profile');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || 'Student',
            email: user.email || ''
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          toast({
            title: "Error",
            description: "Failed to create profile",
            variant: "destructive"
          });
        } else {
          console.log('Profile created:', newProfile);
          setProfile(newProfile);
          toast({
            title: "Welcome!",
            description: "Your profile has been created successfully."
          });
        }
      }
    } catch (err) {
      console.error('Error in fetchOrCreateProfile:', err);
      toast({
        title: "Error",
        description: "Something went wrong while setting up your profile",
        variant: "destructive"
      });
    }
  };

  const fetchCoursesWithProgress = async () => {
    if (!user) return;

    try {
      // Fetch all courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at');

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        return;
      }

      console.log('Courses data:', coursesData); // Debug log to see icon values

      // Fetch user's progress for all courses
      const { data: progressData, error: progressError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) {
        console.error('Error fetching progress:', progressError);
      }

      // Combine courses with progress data
      const coursesWithProgress = (coursesData as any []).map(course => {
        const progress = progressData?.find(p => p.course_id === course.course_id);
        return {
          ...course,
          progress
        };
      });

      setCourses(coursesWithProgress as any as CourseWithProgress[]);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseAction = async (course: CourseWithProgress) => {
    if (!user) return;
    // 🚧 Coming soon check
  if (comingSoonCourses.includes(course.title)) {
    toast({
      title: "Coming Soon!",
      description: `${course.title} will be available very soon. Stay tuned!`,
    });
    return;
  }

    try {
      if (!course.progress) {
        // Create initial progress record
        const { error } = await supabase
          .from('course_progress')
          .insert({
            user_id: user.id,
            course_id: course.course_id,
            completed_lessons: 0,
            last_accessed: new Date().toISOString(),
            status: 'in_progress',
            progress_percentage: 0
          });

        if (error) {
          console.error('Error creating progress:', error);
          toast({
            title: "Error",
            description: "Failed to start course. Please try again.",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Course Started!",
          description: `You've started ${course.title}. Good luck!`
        });
      } else if (course.progress.status !== 'completed') {
        // Update last accessed time
        const { error } = await supabase
          .from('course_progress')
          .update({
            last_accessed: new Date().toISOString()
          })
          .eq('id', course.progress.id);

        if (error) {
          console.error('Error updating progress:', error);
        }

        toast({
          title: "Continuing Course",
          description: `Welcome back to ${course.title}!`
        });
      }

      // Navigate to course page
      navigate(`/course/${slugify(course.title)}`);
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  const getButtonText = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'Review Course';
      case 'in_progress':
        return 'Continue Learning';
      default:
        return 'Start Course';
    }
  };

  const completedCourses = courses.filter(c => c.progress?.status === 'completed').length;
  const inProgressCourses = courses.filter(c => c.progress?.status === 'in_progress').length;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/100 to-black/100">
      {/* Header */}
      <header className="bg-black/100 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-20 h-20 bg-gradient-to-br from-black/90 to-black/90 rounded-lg flex items-center justify-center">
              <img src="./images/DCAlogo1.png" alt="Logo" className="w-20 h-20" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white/100 to-white/100 bg-clip-text text-transparent">
              Dionz Coding Academy
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white/100">
              Welcome, {profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Student'}!
            </span>
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-1 bg-yellow-50">
            <CardHeader className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4 group">
  <img
    src={
      avatar ||
      profile?.avatar_url ||
      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
    }
    alt="Profile Avatar"
    className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 cursor-pointer transition-opacity duration-300 group-hover:opacity-80"
  />

  {/* Hidden input */}
  <input
    type="file"
    accept="image/*"
    id="avatarUpload"
    className="hidden"
    onChange={handleAvatarUpload}
  />

  {/* Overlay + Label as clickable trigger */}
  <label
    htmlFor="avatarUpload"
    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity duration-300"
  >
    Change
  </label>
</div>

              <CardTitle>{profile?.full_name || user?.user_metadata?.full_name || 'Student'}</CardTitle>
              <CardDescription>{profile?.email || user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-slate-600">
                  Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-slate-600">{completedCourses} Certificate{completedCourses !== 1 ? 's' : ''} Earned</span>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Total Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length}</div>
                <Badge className="mt-2 bg-green-100 text-green-800">Available</Badge>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressCourses}</div>
                <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCourses}</div>
                <Badge className="mt-2 bg-green-100 text-green-800">Finished</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Progress */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white/100">My Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-all duration-300 bg-yellow-50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CourseIcon icon={course.icon} title={course.title} />
                    <Badge className={getStatusColor(course.progress?.status)}>
                      {getStatusText(course.progress?.status)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span>Progress</span>
                      <span>{course.progress?.progress_percentage || 0}%</span>
                    </div>
                    <Progress value={course.progress?.progress_percentage || 0} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{course.progress?.completed_lessons || 0}/{course.total_lessons} lessons</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700"
                    onClick={() => handleCourseAction(course)}
                  >
                    {getButtonText(course.progress?.status)}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;