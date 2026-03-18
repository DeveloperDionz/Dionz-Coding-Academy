"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onSwitchMode: (mode: "login" | "register") => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onSwitchMode }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const { toast } = useToast();

  // ---- Animated Avatar States ----
  const [isPwdFocused, setIsPwdFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const eyesClosed = isPwdFocused || isTyping;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTyping) {
      timer = setTimeout(() => setIsTyping(false), 700);
    }
    return () => clearTimeout(timer);
  }, [isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (mode === "register") {
      if (!formData.fullName) {
        setError("Please enter your full name");
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) setError(error.message);
        else {
          toast({ title: "Welcome back!", description: "Logged in successfully." });
          onClose();
          resetForm();
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: formData.fullName } }
        });

        if (error) setError(error.message);
        else {
          toast({ title: "Registration successful!", description: "Check your email to verify your account." });
          onClose();
          resetForm();
        }
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!forgotPasswordEmail) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) setError(error.message);
      else {
        setSuccess("Password reset email sent!");
        toast({ title: "Reset email sent", description: "Check your email for instructions." });
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "", confirmPassword: "", fullName: "" });
    setError("");
    setSuccess("");
    setForgotPasswordEmail("");
    setShowForgotPassword(false);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setError("");
    setSuccess("");
    setForgotPasswordEmail("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/5 backdrop-blur-lg rounded-xl shadow-xl border border-white/80">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white/100">
            {showForgotPassword ? "Reset Password" : mode === "login" ? "Welcome Back!" : "Join Dionz Coding Academy"}
          </DialogTitle>
          <DialogDescription className="text-center text-white/80">
            {showForgotPassword
              ? "Enter your email to receive a password reset link"
              : mode === "login"
              ? "Sign in to continue your learning journey"
              : "Create your account to start learning today"}
          </DialogDescription>
        </DialogHeader>

        {/* --- AVATAR --- */}
        <div className="flex justify-center mb-4">
          <Avatar eyesClosed={eyesClosed} />
        </div>

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Email"}
            </Button>

            <Button type="button" variant="ghost" onClick={handleBackToLogin} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setIsTyping(true);
                  }}
                  onFocus={() => setIsPwdFocused(true)}
                  onBlur={() => setIsPwdFocused(false)}
                  className="pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>

            {mode === "login" && (
              <div className="text-center">
                <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-yellow-600 hover:text-yellow-700 underline">
                  Forgot your password?
                </button>
              </div>
            )}

            <div className="text-center text-sm">
              <span className="text-white/100">{mode === "login" ? "Don't have an account? " : "Already have an account? "}</span>
              <button type="button" onClick={() => onSwitchMode(mode === "login" ? "register" : "login")} className="text-yellow-600 hover:text-yellow-700 font-medium">
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

// --------------------------
// Animated Avatar Component
// --------------------------
interface AvatarProps {
  eyesClosed: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ eyesClosed }) => {
  return (
    <motion.svg width="110" height="110" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r="60" fill="#FFCB92" />
      <path d="M20 55 C40 20, 100 20, 120 55" fill="#2B2F78" />
      <motion.g
        animate={eyesClosed ? { scaleY: 0.1, translateY: 6 } : { scaleY: 1, translateY: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        style={{ originX: "50%", originY: "50%" }}
      >
        <ellipse cx="45" cy="70" rx="10" ry="6" fill="#111" />
        <ellipse cx="95" cy="70" rx="10" ry="6" fill="#111" />
      </motion.g>
      <motion.path d="M55 95 q15 12 30 0" stroke="#6B2E1A" strokeWidth="3" fill="none" animate={{ scaleY: [1, 0.95, 1] }} transition={{ repeat: Infinity, duration: 2.5 }} />
    </motion.svg>
  );
};
