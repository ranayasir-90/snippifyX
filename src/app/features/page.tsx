"use client";

import MarketingLayout from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useRouter } from "next/navigation";
import { 
  FiCode, 
  FiSearch, 
  FiFolder, 
  FiShare2, 
  FiTag, 
  FiUsers, 
  FiHeart, 
  FiStar, 
  FiGlobe, 
  FiDownload, 
  FiEdit, 
  FiEye, 
  FiZap, 
  FiCheckCircle,
  FiPlus,
  FiFilter,
  FiGrid,
  FiList,
  FiCopy,
  FiLock,
  FiUser,
  FiTrendingUp,
  FiArrowRight,
  FiPlay,
  FiShield,
  FiAward
} from "react-icons/fi";
import { useError } from "@/contexts/ErrorContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function FeaturesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { showError } = useError();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // Real features based on actual app functionality
  const coreFeatures = [
    {
      icon: <FiCode className="w-8 h-8" />,
      title: "Smart Content Management",
      description: "Save and organize any type of content - snippets, social media posts, email templates, notes, and more.",
      features: [
        "Create snippets with title, content, and category",
        "Support for any text-based content",
        "Real-time content editing and preview",
        "Word and line count tracking",
        "Auto-save functionality",
        "Rich text formatting support"
      ],
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      demo: "Create snippets with categories like 'Text Content', 'Qoute', 'Blog Post', 'Email Templates', 'Social Media', etc."
    },
    {
      icon: <FiFolder className="w-8 h-8" />,
      title: "Smart Folder Organization",
      description: "Organize your content with custom folders and intuitive navigation for easy access.",
      features: [
        "Create custom folders with names",
        "Assign snippets to specific folders",
        "Filter snippets by folder",
        "Folder-based organization system",
        "Easy folder management",
        "Visual folder indicators"
      ],
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      demo: "Organize snippets into folders like 'Captions', 'Templates', 'Marketing', 'Personal', etc."
    },
    {
      icon: <FiTag className="w-8 h-8" />,
      title: "Smart Tagging System",
      description: "Create custom tags with colors and auto-tag your content for instant discovery.",
      features: [
        "Create custom tags with colors",
        "Auto-tagging system",
        "Filter snippets by tags",
        "Tag-based search functionality",
        "Visual tag indicators",
        "Bulk tag management"
      ],
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      demo: "Use tags like 'Text Content', 'Qoute', 'Blog Post', 'Email Templates', 'Social Media', etc. with custom colors"
    },
    {
      icon: <FiSearch className="w-8 h-8" />,
      title: "Lightning Fast Search",
      description: "Find any snippet in seconds with powerful search and filtering capabilities.",
      features: [
        "Search by title, content, and tags",
        "Real-time search results",
        "Filter by category, tags, and folders",
        "Sort by date, name, or category",
        "Advanced filtering options",
        "Search history tracking"
      ],
      color: "orange",
      gradient: "from-orange-500 to-red-500",
      demo: "Search for 'Text Content' and find all related snippets instantly"
    }
  ];

  const sharingFeatures = [
    {
      icon: <FiShare2 className="w-6 h-6" />,
      title: "Public Sharing",
      description: "Share your best snippets publicly with the community and discover amazing content from other creators.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: "Community Discovery",
      description: "Browse and discover snippets shared by creators worldwide in the public community.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiHeart className="w-6 h-6" />,
      title: "Like & Save",
      description: "Like snippets from the community and save your liked content for quick access.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "User Profiles",
      description: "View snippets by specific users and discover content from creators you follow.",
      gradient: "from-purple-500 to-indigo-500"
    }
  ];

  const userExperience = [
    {
      icon: <FiGrid className="w-6 h-6" />,
      title: "Grid & List Views",
      description: "Switch between grid and list views to browse your snippets in your preferred layout.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <FiCopy className="w-6 h-6" />,
      title: "One-Click Copy",
      description: "Copy snippet content to clipboard with a single click for instant use.",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      icon: <FiEye className="w-6 h-6" />,
      title: "Detail Modal",
      description: "View full snippet details in a beautiful modal with all information and actions.",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: <FiEdit className="w-6 h-6" />,
      title: "Inline Editing",
      description: "Edit snippets directly with real-time preview and auto-save functionality.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      title: "Likes System",
      description: "Mark important snippets as liked for quick access and organization.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <FiLock className="w-6 h-6" />,
      title: "Privacy Control",
      description: "Choose which snippets to share publicly and which to keep private.",
      gradient: "from-gray-500 to-slate-500"
    }
  ];

  const contentTypes = [
    { name: "Code Snippets", icon: <FiCode className="h-5 w-5" />, color: "bg-blue-100 text-blue-600" },
    { name: "Social Media Posts", icon: <FiShare2 className="h-5 w-5" />, color: "bg-purple-100 text-purple-600" },
    { name: "Email Templates", icon: <FiEdit className="h-5 w-5" />, color: "bg-green-100 text-green-600" },
    { name: "Notes & Ideas", icon: <FiTag className="h-5 w-5" />, color: "bg-orange-100 text-orange-600" },
    { name: "Blog Content", icon: <FiGlobe className="h-5 w-5" />, color: "bg-pink-100 text-pink-600" },
    { name: "Documentation", icon: <FiDownload className="h-5 w-5" />, color: "bg-indigo-100 text-indigo-600" },
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
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
          <h1 className="text-5xl md:text-7xl font-bold mb-8 gradient-text animate-fade-in">
            Real Features That Work
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Every feature you see here is actually implemented and working in SnippifyX. 
            No fake promises, just real functionality that helps you manage content better.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg" 
              className="text-xl px-10 py-6 btn-animate hover-lift bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/25 group"
              onClick={() => router.push('/signup')}
            >
              <FiZap className="mr-3 h-6 w-6" />
              Start Using Now
              <FiArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
          </div>
        </div>
      </section>

      {/* Content Types Supported */}
      <AnimatedSection className="py-24 bg-white relative overflow-hidden" animationType="fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
              All Types of Content Supported
            </h2>
            <p className="text-2xl text-muted-foreground leading-relaxed">
              SnippifyX isn't just for code. Save and organize any type of text-based content.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {contentTypes.map((type, idx) => (
              <div 
                key={idx} 
                className={`group relative flex items-center gap-3 px-6 py-3 rounded-full ${type.color} text-sm font-medium backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center gap-3">
                  {type.icon}
                  {type.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Core Features */}
      <AnimatedSection className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden" animationType="fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
                Core Features That Actually Work
              </h2>
              <p className="text-2xl text-muted-foreground leading-relaxed">
                Every feature listed below is fully implemented and functional in the app
              </p>
            </div>
            
            <div className="space-y-20">
              {coreFeatures.map((feature, index) => (
                <AnimatedSection
                  key={index}
                  animationType={index % 2 === 0 ? "slide-in-left" : "slide-in-right"}
                  delay={index * 0.15}
                  className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
                >
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">{feature.title}</h3>
                    <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 group hover:scale-105 transition-transform duration-300">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 backdrop-blur-sm">
                      <p className="text-sm text-blue-700">
                        <strong>Demo:</strong> {feature.demo}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`group relative bg-white rounded-3xl p-8 shadow-xl border border-gray-200 card-hover ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 text-center">
                      <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        {feature.icon}
                      </div>
                      <h4 className="text-xl font-bold mb-3 gradient-text">Fully Implemented</h4>
                      <p className="text-muted-foreground">
                        This feature is live and working in the app right now
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Sharing & Community Features */}
      <AnimatedSection className="py-24 bg-white relative overflow-hidden" animationType="fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
                Community & Sharing
              </h2>
              <p className="text-2xl text-muted-foreground leading-relaxed">
                Connect with other creators and share your best content
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {sharingFeatures.map((feature, index) => (
                <div key={index} className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 card-hover">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient.replace('from-', 'from-').replace('to-', 'to-')}/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 gradient-text">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* User Experience Features */}
      <AnimatedSection className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden" animationType="fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
                User Experience Features
              </h2>
              <p className="text-2xl text-muted-foreground leading-relaxed">
                Designed for maximum productivity and ease of use
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userExperience.map((feature, index) => (
                <div key={index} className="group relative p-8 rounded-3xl bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 card-hover">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient.replace('from-', 'from-').replace('to-', 'to-')}/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 gradient-text">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden" animationType="fade-in">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of creators who are already using SnippifyX to organize their content. 
              It's completely free with no hidden costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button 
                size="lg" 
                className="text-xl px-12 py-6 bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
                onClick={() => router.push('/signup')}
              >
                <FiPlus className="mr-3 h-6 w-6" />
                Create Your First Snippet
                <FiArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-xl px-12 py-6 border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 group"
                onClick={() => router.push('/public')}
              >
                <FiEye className="mr-3 h-6 w-6" />
                Explore Community
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <FiShield className="h-4 w-4" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <FiAward className="h-4 w-4" />
                No hidden fees
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4" />
                100% free forever
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </MarketingLayout>
  );
}