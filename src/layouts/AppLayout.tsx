import { ReactNode, useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // Close sidebar by default on mobile, open on desktop
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle redirect in useEffect to avoid setState during render
  useEffect(() => {
    if (!loading && !user && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/login");
    }
  }, [loading, user, router, isRedirecting]);

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center p-8">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show redirecting state if user is not authenticated
  if (!loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center p-8">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <AppSidebar 
          open={sidebarOpen} 
          expanded={sidebarExpanded}
          onClose={() => setSidebarOpen(false)}
          onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          isMobile={false}
        />
      )}
      
      {/* Mobile Sidebar */}
      <AppSidebar 
        open={sidebarOpen && isMobile} 
        expanded={false}
        onClose={() => setSidebarOpen(false)}
        onToggleExpanded={() => {}}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        isMobile={true}
      />
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
        sidebarExpanded && !isMobile ? 'blur-sm' : ''
      }`}>
        <AppHeader 
          sidebarOpen={sidebarOpen} 
          sidebarExpanded={sidebarExpanded}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}