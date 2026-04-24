"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MarketingLayout from "@/layouts/MarketingLayout";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { useError } from "@/contexts/ErrorContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showError } = useError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err: any) {
      showError(err.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-3xl font-bold gradient-text mb-2">Forgot Password</h1>
              <p className="text-muted-foreground">
                Enter your email to receive a password reset link
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="pl-10 pr-4 py-3 input-focus"
              />
              <Button type="submit" className="w-full py-3 text-lg" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
            {message && <p className="text-green-600 text-center mt-4">{message}</p>}
            <div className="text-center mt-8">
              <Button variant="link" onClick={() => router.push("/login")}>Back to Login</Button>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
} 