"use client";

import MarketingLayout from "@/layouts/MarketingLayout";
import { FiCopy, FiFolder, FiSearch, FiShare2, FiZap, FiLock, FiUsers, FiTrendingUp, FiGlobe, FiTag, FiSmartphone, FiCheckCircle, FiCode, FiHeart, FiStar, FiDownload, FiEdit, FiEye, FiArrowRight, FiPlay, FiShield, FiClock, FiAward } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // Real features based on actual app functionality
  const features = [
    {
      icon: <FiCode className="h-8 w-8" />, 
      title: "Snippets & Content", 
      desc: "Save any type of content - code snippets, social media posts, email templates, notes, and more with smart categorization.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiFolder className="h-8 w-8" />, 
      title: "Smart Folders", 
      desc: "Organize your content with custom folders, color-coded categories, and intuitive navigation for easy access.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FiTag className="h-8 w-8" />, 
      title: "Smart Tags", 
      desc: "Auto-tag your content and create custom tags with colors. Find anything instantly with powerful search and filtering.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <FiShare2 className="h-8 w-8" />, 
      title: "Public Sharing", 
      desc: "Share your best snippets publicly with the community. Discover amazing content from other creators.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <FiSearch className="h-8 w-8" />, 
      title: "Lightning Fast Search", 
      desc: "Find any snippet in seconds. Search by title, content, tags, or category with real-time results.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <FiSmartphone className="h-8 w-8" />, 
      title: "Cross-Platform", 
      desc: "Access your content anywhere - desktop, tablet, or mobile. Your data syncs automatically across all devices.",
      gradient: "from-teal-500 to-blue-500"
    },
  ];

  // How it works steps based on real workflow
  const steps = [
    { 
      icon: <FiCopy className="h-7 w-7 text-blue-600" />, 
      title: "Create", 
      desc: "Add your code, text, or content as a snippet with title, category, and tags.",
      delay: "0s"
    },
    { 
      icon: <FiFolder className="h-7 w-7 text-purple-600" />, 
      title: "Organize", 
      desc: "Group snippets in folders, add custom tags with colors, and categorize for easy management.",
      delay: "0.2s"
    },
    { 
      icon: <FiSearch className="h-7 w-7 text-green-600" />, 
      title: "Discover", 
      desc: "Find any snippet instantly with smart search, filters, and browse the community library.",
      delay: "0.4s"
    },
    { 
      icon: <FiShare2 className="h-7 w-7 text-orange-600" />, 
      title: "Share", 
      desc: "Share snippets publicly or keep them private. Like and discover content from other creators.",
      delay: "0.6s"
    },
  ];

  // Content types supported by the app
  const contentTypes = [
    { name: "Code Snippets", icon: <FiCode className="h-5 w-5" />, color: "bg-blue-100 text-blue-600" },
    { name: "Social Media Posts", icon: <FiShare2 className="h-5 w-5" />, color: "bg-purple-100 text-purple-600" },
    { name: "Email Templates", icon: <FiEdit className="h-5 w-5" />, color: "bg-green-100 text-green-600" },
    { name: "Notes & Ideas", icon: <FiTag className="h-5 w-5" />, color: "bg-orange-100 text-orange-600" },
    { name: "Blog Content", icon: <FiGlobe className="h-5 w-5" />, color: "bg-pink-100 text-pink-600" },
    
  ];

  // Stats data
  const stats = [
    { number: "10K+", label: "Active Users", icon: <FiUsers className="h-6 w-6" /> },
    { number: "50K+", label: "Snippets Created", icon: <FiCode className="h-6 w-6" /> },
    { number: "5K+", label: "Public Shares", icon: <FiShare2 className="h-6 w-6" /> },
    { number: "100%", label: "Free Forever", icon: <FiShield className="h-6 w-6" /> },
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          
          
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 gradient-text animate-fade-in">
            SnippifyX
          </h1>
          
          {/* Subtitle */}
          <p className="text-3xl md:text-4xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Your content manager for code, text, and everything in between
          </p>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Save, organize, search, and share your best content—completely free. Join thousands of creators who trust SnippifyX for their content management needs.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              className="text-xl px-10 py-6 btn-animate hover-lift bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/25 group"
              onClick={() => router.push('/signup')}
            >
              <FiZap className="mr-3 h-6 w-6" />
              Start Creating
              <FiArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-xl px-10 py-6 btn-animate hover-lift border-2 backdrop-blur-sm bg-white/10 group"
              onClick={() => router.push('/public')}
            >
              <FiGlobe className="mr-3 h-6 w-6" />
              Explore Community
            </Button>
          </div>

          {/* Content Types Preview */}
          <div className="flex flex-wrap justify-center gap-4 mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            {contentTypes.map((type, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-3 px-6 py-3 rounded-full ${type.color} text-sm font-medium backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg`}
                style={{ animationDelay: `${1 + idx * 0.1}s` }}
              >
                {type.icon}
                {type.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <AnimatedSection className="py-24 bg-white relative overflow-hidden" animationType="fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-text">
              Everything You Need to Manage Content
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              SnippifyX is built for creators who want to save time and stay organized. Every feature is designed to make your workflow faster and more efficient.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer card-hover"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient.replace('from-', 'from-').replace('to-', 'to-')}/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-6 gradient-text group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works Section */}
      <AnimatedSection className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden" animationType="fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-text">
              How SnippifyX Works
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Get started in seconds. SnippifyX fits seamlessly into your existing workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className="group relative p-8 rounded-3xl bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center relative card-hover"
                style={{ animationDelay: step.delay }}
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center animate-glow">
                  {idx + 1}
                </div>
                
                {/* Hover Background Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-6 gradient-text">{step.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Community & Sharing Section */}
      <AnimatedSection className="py-24 bg-white relative overflow-hidden" animationType="fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-text">
              Join the Community
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Share your best content and discover amazing snippets from other creators. Build your personal library while contributing to the community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="group relative flex items-start gap-6 hover:scale-105 transition-transform duration-300 p-6 rounded-2xl hover:bg-white/50">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <FiShare2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 gradient-text">Public Sharing</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">Share your best snippets publicly and get discovered by other creators. Control what you share and what stays private.</p>
                  </div>
                </div>
              </div>
              
              <div className="group relative flex items-start gap-6 hover:scale-105 transition-transform duration-300 p-6 rounded-2xl hover:bg-white/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <FiHeart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 gradient-text">Like & Discover</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">Like snippets you find useful and build your collection. Discover trending content and popular creators.</p>
                  </div>
                </div>
              </div>
              
              <div className="group relative flex items-start gap-6 hover:scale-105 transition-transform duration-300 p-6 rounded-2xl hover:bg-white/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <FiUsers className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 gradient-text">Community Library</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">Browse thousands of snippets shared by the community. Find inspiration and ready-to-use content.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-sm hover:scale-105 transition-transform duration-300 card-hover">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"></div>
                    <div>
                      <h4 className="font-bold text-lg">Instagram Bio</h4>
                      <p className="text-sm text-gray-600">by @SnippifyX</p>
                    </div>
                    <FiHeart className="h-6 w-6 text-red-500 ml-auto animate-pulse" />
                  </div>
                  <div className="bg-white/70 rounded-2xl p-4 backdrop-blur-sm">
                    <p className="text-sm text-gray-700 font-mono">
                    👨‍💻 CS student | 💡 Problem solver in progress  <br />
                    🔐 Cybersecurity enthusiast | 📚 Lifetime learner  <br />
                    ☕ Coffee Sleep | 💭 Dreaming in code  <br />
                    🚀 Building small things that solve big problems  <br />
                    📬 Open to collabs — lets grow together  <br />

                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600 font-medium">#instagram</span>
                    <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600 font-medium">#bio</span>
                    <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-600 font-medium">#cybersecurity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden" animationType="fade-in">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Trusted by Creators Worldwide
            </h2>
            <p className="text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
              Join thousands of developers, writers, and creators who use SnippifyX to stay organized and productive.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="group hover:scale-110 transition-transform duration-300">
                <div className="text-5xl font-bold mb-4 group-hover:text-yellow-300 transition-colors">{stat.number}</div>
                <div className="text-blue-100 text-lg font-medium flex items-center justify-center gap-2">
                  {stat.icon}
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-24 bg-white relative overflow-hidden" animationType="fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-text">
              Ready to Get Started?
            </h2>
            <p className="text-2xl mb-12 text-muted-foreground leading-relaxed">
              Join thousands of creators who are already saving time and staying organized with SnippifyX. 
              Start creating, organizing, and sharing your content today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button 
                size="lg" 
                className="text-xl px-12 py-6 btn-animate hover-lift bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/25 group"
                onClick={() => router.push('/signup')}
              >
                <FiZap className="mr-3 h-6 w-6" />
                Start Creating
                <FiArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-xl px-12 py-6 btn-animate hover-lift border-2 backdrop-blur-sm bg-white/10 group"
                onClick={() => router.push('/public')}
              >
                <FiGlobe className="mr-3 h-6 w-6" />
                Explore Community
              </Button>
            </div>
            
          </div>
        </div>
      </AnimatedSection>
    </MarketingLayout>
  );
}