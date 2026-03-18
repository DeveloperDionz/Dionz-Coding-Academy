import { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, Users, Trophy, ArrowRight, Play, Star, LogOut } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { url } from "inspector";
import { Dialog, DialogContent } from "@/components/ui/dialog";


const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [openVideo, setOpenVideo] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const handleFooterClick = (path: string) => {
    navigate(path);
  }

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const courses = [
    {
      title: "HTML Fundamentals",
      description: "Learn the building blocks of web development",
      icon: <img src="./images/hlogo.png" alt="HTML Logo" style={{ width: "40px", height: "40px" }} />,
      level: "Beginner",
      duration: "17+ hours",
      lessons: 34,
      color: "bg-yellow-600 text-black"
    },
    {
      title: "CSS Styling",
      description: "Master styling and layout techniques",
      icon: <img src="./images/clogo.png" alt="HTML Logo" style={{ width: "40px", height: "40px" }} />,
      level: "Beginner",
      duration: "15+ hours",
      lessons: 58,
      color: "bg-yellow-600 text-black"
    },
    {
      title: "JavaScript Programming",
      description: "Dynamic programming and interactivity",
      icon: <img src="./images/jlogo.png" alt="HTML Logo" style={{ width: "40px", height: "40px" }} />,
      level: "Beginner-Intermediate-Advanced",
      duration: "24+ hours",
      lessons: 70,
      color: "bg-yellow-600 text-black"
    },
    {
      title: "Python Development",
      description: "Versatile programming language mastery",
      icon: <img src="./images/plogo.png" alt="HTML Logo" style={{ width: "40px", height: "40px" }} />,
      level: "Intermediate",
      duration: "15 hours",
      lessons: 30,
      color: "bg-yellow-600 text-black"
    },
    {
      title: "React Framework",
      description: "Modern frontend development with React",
      icon: <img src="./images/rlogo.png" alt="HTML Logo" style={{ width: "40px", height: "40px" }} />,
      level: "Advanced",
      duration: "20 hours",
      lessons: 35,
      color: "bg-yellow-600 text-black"
    },
    {
      title: "Git Version Control",
      description: "Master version control and collaboration tools",
      icon: <img src="	https://ryvpndnkailzmuajceug.supabase.co/storage/v1/object/public/icons/glogo.png" alt="git logo" style={{ width: "40px", height: "40px" }} />,
      level: "Intermediate",
      duration: "10 hours",
      lessons: 20,
      color: "bg-yellow-600 text-black"
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "Structured learning paths from beginner to advanced levels"
    },
    {
      icon: Code,
      title: "Hands-on Practice",
      description: "Interactive coding exercises and real-world projects"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow learners and experienced mentors"
    },
    {
      icon: Trophy,
      title: "Certificates",
      description: "Earn certificates upon successful course completion"
    }
  ];

  const handleAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const carouselImages = [
  "./images/DCAlogo1.png",
  "./images/noPrior.png",
  "./images/global.png",
  "./images/cert.png",
  "./images/self.png"
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false,
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-black">
      {/* Header */}
      <header className="bg-black/100 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-20 h-20 bg-black/90 rounded-lg flex items-center justify-center img hover:scale-105 transition-transform ">
              <img src="./images/DCAlogo1.png" alt="DCA Logo" className="w-20 h-20" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-br from-white to-white bg-clip-text text-transparent">
              Dionz Coding Academy
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-slate-600">Welcome back!</span>
                <Button 
                  onClick={handleSignOut}
                  variant="ghost" 
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => handleAuth('login')}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-500 hover:to-yellow-500 text-black px-6 py-3 mr-2"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => handleAuth('register')}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-500 hover:to-yellow-500 text-black px-6 py-3"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
{/* Hero Section */}
<section className="container mx-auto px-4 py-16">
  <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-12">
    {/* Left Side: Text, Value Points & CTA */}
    <div className="flex-1 text-center md:text-left">
      <Badge className="mb-6 bg-yellow-600 text-white px-4 py-2">
        Start Your Coding Journey Today
      </Badge>
      <h2 className="text-5xl font-bold mb-6 leading-tight text-white">
        Master Programming with{" "}
        <span className="bg-gradient-to-r from-yellow-600 to-yellow-600 bg-clip-text text-transparent">
          Expert-Led Courses
        </span>
      </h2>
      <p className="text-xl text-white/90 mb-6 leading-relaxed">
        Join thousands of students learning HTML, CSS, JavaScript, Python, and React
        through our hands-on curriculum designed by industry experts.
      </p>

      {/* Value Highlights */}
      <div className="flex flex-col gap-3 mb-6 text-white/90">
        <div className="flex items-center gap-2"><BookOpen className="w-5 h-5" />No prior experience needed</div>
        <div className="flex items-center gap-2"><Users className="w-5 h-5" />Join global community</div>
        <div className="flex items-center gap-2"><Trophy className="w-5 h-5" />Earn certificate on completion</div>
        <div className="flex items-center gap-2"><Code className="w-5 h-5" />Self-paced & flexible</div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
        <Button
          size="lg"
          onClick={() => handleAuth('register')}
          className="bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700 px-8 py-6 text-lg text-black"
        >
          Start Learning Free <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="px-8 py-6 text-lg border-2 hover:bg-slate-50"
          onClick={() => setOpenVideo(true)}
        >
          <Play className="mr-2 w-5 h-5" />
          About Us
        </Button>
      </div>

      {/* Social Proof */}
      <div className="flex items-center gap-6 mt-8 justify-center md:justify-start text-sm text-white/80">
        <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" />4.9/5 Rating</div>
        <div>50,000+ Students</div>
        <div>100+ Hours Content</div>
      </div>
    </div>

    {/* Right Side: Hero Carousel */}
<div className="flex-1 flex justify-center md:justify-end w-full max-w-md">
  <Slider {...sliderSettings} className="w-full rounded-xl shadow-2xl overflow-hidden">
    {carouselImages.map((src, index) => (
      <div key={index} className="relative">
        <img
          src={src}
          alt={`Hero ${index + 1}`}
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>
    ))}
  </Slider>
</div>
</div>
</section>

{/* VIDEO MODAL */}
      <Dialog open={openVideo} onOpenChange={setOpenVideo}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          <video
            src="/video/DCA.mp4"
            controls
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
        </DialogContent>
      </Dialog>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-white">Why Choose Dionz Coding Academy?</h3>
          <p className="text-white/80 max-w-2xl mx-auto">
            Our platform is designed to provide the best learning experience with proven methodologies
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-yellow-50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-yellow-700" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black/80 text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">Our Popular Courses</h3>
          <p className="text-white/80 max-w-2xl mx-auto">
            Structured learning paths designed to take you from beginner to professional
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-yellow-50 backdrop-blur-sm group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{course.icon}</span>
                  <Badge className={course.color}>{course.level}</Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-yellow-600 transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-black/80">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span>{course.lessons} lessons</span>
                  <span>{course.duration}</span>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700 text-black"
                  onClick={() => handleAuth('register')}
                >
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-yellow-700 to-yellow-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Your Coding Journey?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join our community of learners and start building your future today
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => handleAuth('register')}
            className="px-8 py-6 text-lg bg-white text-yellow-800 hover:bg-slate-100"
          >
            Create Free Account <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/100 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-20 h-20 bg-black/100 rounded-lg flex items-center justify-center">
                  <img src="./images/DCAlogo1.png" alt="Dionz Logo" className="w-20 h-20" />
                </div>
                <h4 className="text-xl font-bold">Dionz Coding Academy</h4>
              </div>
              <p className="text-white/50">
                Empowering the next generation of developers through quality education.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Courses</h5>
              <ul className="space-y-2 text-white/50" onClick={() => handleAuth('login')}>
                <li className="hover:text-white cursor-pointer">HTML & CSS</li>
                <li className="hover:text-white cursor-pointer">JavaScript</li>
                <li className="hover:text-white cursor-pointer">Python</li>
                <li className="hover:text-white cursor-pointer">React</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-white/50">
                <li className="hover:text-white cursor-pointer" onClick={() => handleFooterClick('/community')}>Community</li>
                <li className="hover:text-white cursor-pointer" onClick={() => handleFooterClick('/contact')}>Contact Us</li>
                <li className="hover:text-white cursor-pointer" onClick={() => handleFooterClick('/faq')}>FAQ</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-white/50">
                <li className="hover:text-white cursor-pointer" onClick={() => handleFooterClick('/about')}>About Us</li>
                <li className="hover:text-white cursor-pointer" onClick={() => handleFooterClick('/privacy')}>Privacy Policy</li>
                <li className="hover:text-white cursor-pointer" onClick={() => handleFooterClick('/terms')}>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/50 mt-8 pt-8 text-center  text-white/50">
            <p>In Partnership with <img src="./images/CyberSenseiLogo.jpg" className="h-12 inline-block ml-2" /></p>
            <p>&copy; 2026 Dionz Coding Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
};

export default Index;
