"use client";

import MarketingLayout from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { FiMail, FiLock, FiEye, FiEyeOff, FiTwitter, FiCheck } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useError } from "@/contexts/ErrorContext";

// Define form schema with Zod
const formSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Define TypeScript type for form values
type FormValues = z.infer<typeof formSchema>;

export default function SignUp() {
  const { signUp, signInWithGoogle, user } = useAuth();
  const { showError } = useError();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirectProgress, setRedirectProgress] = useState(0);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const password = watch("password");

  const passwordRequirements = [
    { label: "At least 6 characters", met: password?.length >= 6 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password || "") },
    { label: "One number", met: /[0-9]/.test(password || "") },
  ];

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await signUp(data.email, data.password);
      if (error) {
        showError(error.message || "An unknown error occurred during sign up");
        return;
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : "An unknown error occurred during sign up");
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
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 transform rotate-3 scale-105 rounded-3xl opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform -rotate-3 scale-105 rounded-3xl opacity-10"></div>
          
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
              <h1 className="text-3xl font-bold gradient-text mb-2">Create an account</h1>
              <p className="text-muted-foreground">
                Start organizing your content snippets today
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
                    placeholder="Create a strong password"
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
                
                {/* Password Requirements */}
                {password && (
                  <div className="mt-3 space-y-2">
                    {passwordRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                          requirement.met 
                            ? "bg-green-500 text-white" 
                            : "bg-gray-200"
                        }`}>
                          {requirement.met && <FiCheck className="h-3 w-3" />}
                        </div>
                        <span className={requirement.met ? "text-green-600" : "text-muted-foreground"}>
                          {requirement.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                    className={`pl-10 pr-10 py-3 input-focus ${errors.confirmPassword ? "border-destructive" : ""}`}
                  />
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-2 animate-fade-in">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 text-lg btn-animate hover-lift" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
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
                <span>Sign up with Google</span>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}