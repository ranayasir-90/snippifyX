"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff, FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import MarketingLayout from "@/layouts/MarketingLayout";
import { useError } from "@/contexts/ErrorContext";

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const { signIn, signInWithGoogle, user } = useAuth();
  const { showError } = useError();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirectProgress, setRedirectProgress] = useState(0);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        showError(error.message || "An error occurred during login");
        return;
      }
      router.push("/dashboard");
    } catch (err: any) {
      showError(err.message || "An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        showError(error.message || "An error occurred during Google sign-in");
        return;
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : "An error occurred during Google sign-in");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Redirect authenticated users to dashboard with delay
  useEffect(() => {
    if (user) {
      const startTime = Date.now();
      const duration = 2000; // 2 seconds
      
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        setRedirectProgress(progress);
      }, 50); // Update every 50ms for smooth animation

      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, duration);

      return () => {
        clearTimeout(redirectTimer);
        clearInterval(progressInterval);
      };
    }
  }, [user, router]);

  // Show loading state while checking authentication or during redirect
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center p-8">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
          
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${redirectProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {Math.round(redirectProgress)}% complete
          </p>
        </div>
      </div>
    );
  }

  return (
    <MarketingLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-md">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform rotate-3 scale-105 rounded-3xl opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform -rotate-3 scale-105 rounded-3xl opacity-10"></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 animate-scale-in">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
                  <img 
                    src="/logo.png" 
                    alt="CopyGenie Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold gradient-text">SnippifyX</h2>
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Welcome back</h1>
              <p className="text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className={`pl-10 pr-4 py-3 input-focus ${errors.email ? "border-destructive" : ""}`}
                  />
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive mt-2 animate-fade-in">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`pl-10 pr-10 py-3 input-focus ${errors.password ? "border-destructive" : ""}`}
                  />
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-2 animate-fade-in">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 text-lg btn-animate hover-lift" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl font-semibold text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-all duration-300 mb-4"
                disabled={isGoogleLoading}
              >
                <FcGoogle className="w-5 h-5" />
                <span>Sign in with Google</span>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}