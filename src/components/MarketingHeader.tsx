"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  FiMenu, 
  FiX, 
  FiZap, 
  FiCode, 
  FiUsers, 
  FiTrendingUp,
  FiGlobe,
  FiStar,
  FiArrowRight,
  FiBook
} from "react-icons/fi";

export default function MarketingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "/features", label: "Features", icon: FiZap },
    { href: "/public", label: "Community", icon: FiUsers },
    { href: "/docs", label: "Docs", icon: FiBook },
    { href: "/about", label: "About", icon: FiGlobe },
    { href: "/contact", label: "Contact", icon: FiStar },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-xl' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <img src="/logo.png" alt="SnippetX Logo" className="w-12 h-12" />
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  SnippifyX
                </span>
                <div className="text-xs text-gray-500 -mt-1 font-medium">
                Save. Organize. Reuse.
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 backdrop-blur-sm
                    text-gray-700 hover:text-gray-900
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                    <span>{item.label}</span>
                  </div>
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ${
                    isActive ? 'w-4/5' : 'w-0 group-hover:w-4/5'
                  }`}></div>
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <Link href="/login" className="flex items-center space-x-2">
                <span>Get Started</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 rounded-2xl text-gray-700 hover:bg-white/50 backdrop-blur-sm transition-all duration-300"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 backdrop-blur-md rounded-3xl mt-3 shadow-2xl border border-gray-200/50">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 backdrop-blur-sm ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50/80 shadow-md' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="border-t border-gray-200/50 pt-4 mt-4 space-y-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-4 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-2xl hover:bg-white/50 backdrop-blur-sm"
                >
                  Sign In
                </Link>
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center space-x-2">
                    <span>Get Started Free</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}