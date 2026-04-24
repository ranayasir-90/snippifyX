'use client';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);

  // Debug logging
  console.log('AdminRouteGuard:', { user, isAdmin, loading, adminCheckComplete });

  useEffect(() => {
    // Wait for loading to complete and user to be set
    if (!loading && user !== null) {
      setAdminCheckComplete(true);
    }
  }, [loading, user]);

  useEffect(() => {
    // Only redirect after admin check is complete and user is not admin
    if (adminCheckComplete && !isAdmin) {
      console.log('Redirecting to dashboard - user is not admin');
      router.replace("/dashboard");
    }
  }, [adminCheckComplete, isAdmin, router]);

  // Show loading while checking admin status
  if (loading || !adminCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not admin (will redirect)
  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
} 