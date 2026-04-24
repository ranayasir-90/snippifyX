"use client";

import MarketingLayout from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FiSearch, 
  FiBook, 
  FiCode, 
  FiZap, 
  FiUsers, 
  FiShield, 
  FiSettings, 
  FiDownload,
  FiUpload,
  FiFolder,
  FiTag,
  FiShare,
  FiStar,
  FiArrowRight,
  FiPlay,
  FiCopy,
  FiCheck,
  FiMail,
  FiMessageCircle,
  FiGithub,
  FiExternalLink,
  FiLock,
  FiEye,
  FiActivity,
  FiUser,
  FiEdit,
  FiTrash,
  FiKey
} from "react-icons/fi";
import { useError } from "@/contexts/ErrorContext";
import { useAuth } from "@/contexts/AuthContext";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { showError } = useError();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const navigation = [
    { id: "getting-started", title: "Getting Started", icon: <FiZap className="w-4 h-4" /> },
    { id: "snippets", title: "Snippets", icon: <FiCode className="w-4 h-4" /> },
    { id: "organization", title: "Organization", icon: <FiFolder className="w-4 h-4" /> },
    { id: "sharing", title: "Sharing ", icon: <FiShare className="w-4 h-4" /> },
    { id: "search", title: "Search ", icon: <FiSearch className="w-4 h-4" /> },
    { id: "security", title: "Security & Privacy", icon: <FiShield className="w-4 h-4" /> }
    
    
  ];

  const quickStartSteps = [
    {
      step: "1",
      title: "Create Your Account",
      description: "Sign up for free and get started in seconds",
      icon: <FiUsers className="w-6 h-6" />,
      action: "Sign Up",
      href: "/signup"
    },
    {
      step: "2",
      title: "Create Your First Snippet",
      description: "Add content to your snippet",
      icon: <FiCode className="w-6 h-6" />,
      action: "Create Snippet",
      href: "/signup"
    },
    {
      step: "3",
      title: "Organize with Folders",
      description: "Keep your snippets organized and accessible",
      icon: <FiFolder className="w-6 h-6" />,
      action: "Create Folder",
      href: "/signup"
    },
    {
      step: "4",
      title: "Share with Community",
      description: "Share your snippets and discover others",
      icon: <FiShare className="w-6 h-6" />,
      action: "Explore Community",
      href: "/public"
    }
  ];

  const contentExamples = {
    instagramBio: `🌟 Digital Creator & Content Strategist
📱 Helping brands grow on social media
💡 Sharing tips for creators
🎯 Building authentic connections
✨ Let's create something amazing together!

#ContentCreator #SocialMedia #DigitalMarketing`,
    emailTemplate: `Subject: Welcome to Our Community!

Hi [Name],

Welcome to our amazing community! We're thrilled to have you on board.

Here's what you can expect:
• Weekly tips and insights
• Exclusive content and resources
• Community events and meetups

If you have any questions, feel free to reach out.

Best regards,
[Your Name]
[Company Name]`,
    socialPost: `🚀 Just launched our new feature!

We've been working hard to bring you something special, and we're excited to finally share it with you.

What's new:
✅ Enhanced user experience
✅ Faster performance
✅ Better organization tools

Try it out and let us know what you think! 

#NewFeature #ProductLaunch #Innovation`
  };

  const renderSection = () => {
    switch (activeSection) {
      case "getting-started":
        return (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 gradient-text">Welcome to SnippifyX</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                SnippifyX is your ultimate content snippet manager. Organize, search, and share your content snippets 
                with powerful AI-powered features and seamless collaboration tools.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Quick Start Guide</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {quickStartSteps.map((step, index) => (
                  <div key={index} className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-500">
                          {step.step}
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                          {step.icon}
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h4>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      <Button 
                        size="sm" 
                        className="btn-animate hover-lift"
                        onClick={() => router.push(step.href)}
                      >
                        {step.action}
                        <FiArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Key Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiSearch className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">AI-Powered Search</h4>
                    <p className="text-muted-foreground text-sm">Find snippets by functionality, not just keywords</p>
                  </div>
                </div>
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiShare className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Team Collaboration</h4>
                    <p className="text-muted-foreground text-sm">Share snippets with your team seamlessly</p>
                  </div>
                </div>
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiShield className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Enterprise Security</h4>
                    <p className="text-muted-foreground text-sm">Bank-level encryption and security standards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "snippets":
        return (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 gradient-text">Working with Content Snippets</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Learn how to create, edit, and manage your content snippets effectively. From social media posts to email templates.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Creating Content Snippets</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold mb-4 text-gray-800">Step 1: Click "New Snippet"</h4>
                      <p className="text-muted-foreground mb-4">Navigate to the snippets page and click the "New Snippet" button to start creating your content.</p>
                      <Button 
                        size="sm" 
                        className="btn-animate hover-lift"
                        onClick={() => router.push('/signup')}
                      >
                        Create New Snippet
                        <FiArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold mb-4 text-gray-800">Step 2: Add Your Content</h4>
                      <p className="text-muted-foreground mb-4">Write or paste your content. Perfect for social media posts, email templates, bios, and more.</p>
                    </div>
                  </div>

                  <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold mb-4 text-gray-800">Step 3: Add Metadata</h4>
                      <p className="text-muted-foreground mb-4">Add a title, description, tags, and select the appropriate folder for organization.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xl font-bold mb-4">Content Examples</h4>
                  <div className="space-y-4">
                    <div className="group relative rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 border border-pink-200 overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-pink-600/20 border-b border-pink-300/30">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-sm text-pink-100 font-medium">Instagram Bio</span>
                      </div>
                      <div className="p-4 bg-white/90">
                        <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap font-sans">
                          {contentExamples.instagramBio}
                        </pre>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                          <FiCopy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="group relative rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 border border-blue-200 overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-blue-600/20 border-b border-blue-300/30">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-sm text-blue-100 font-medium">Email Template</span>
                      </div>
                      <div className="p-4 bg-white/90">
                        <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap font-sans">
                          {contentExamples.emailTemplate}
                        </pre>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                          <FiCopy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Content Management</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiTag className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Content Categories</h4>
                    <p className="text-muted-foreground text-sm">Organize content by type: social media, emails, bios, captions, and more</p>
                  </div>
                </div>
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiStar className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Like</h4>
                    <p className="text-muted-foreground text-sm">Like your most-used content snippets for quick access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "organization":
        return (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 gradient-text">Organizing Your Snippets</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Keep your code organized with folders, tags, and smart categorization.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Folders & Structure</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold mb-4 text-gray-800">Creating Folders</h4>
                      <p className="text-muted-foreground mb-4">Create folders to group related snippets together. You can nest folders for better organization.</p>
                      <Button 
                        size="sm" 
                        className="btn-animate hover-lift"
                        onClick={() => router.push('/folders')}
                      >
                        Manage Folders
                        <FiArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold mb-4 text-gray-800">Smart Organization</h4>
                      <p className="text-muted-foreground mb-4">Use tags, categories, and custom fields to organize snippets beyond just folders.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xl font-bold mb-4">Recommended Structure</h4>
                  <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FiFolder className="w-5 h-5 text-pink-500" />
                          <span className="font-semibold">Social Media</span>
                        </div>
                        <div className="ml-6 space-y-2">
                          <div className="flex items-center gap-3">
                            <FiFolder className="w-4 h-4 text-pink-400" />
                            <span>Instagram</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FiFolder className="w-4 h-4 text-pink-400" />
                            <span>Twitter/X</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FiFolder className="w-4 h-4 text-pink-400" />
                            <span>LinkedIn</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FiFolder className="w-4 h-4 text-pink-400" />
                            <span>TikTok</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FiFolder className="w-5 h-5 text-blue-500" />
                          <span className="font-semibold">Marketing</span>
                        </div>
                        <div className="ml-6 space-y-2">
                          <div className="flex items-center gap-3">
                            <FiFolder className="w-4 h-4 text-blue-400" />
                            <span>Email Templates</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FiFolder className="w-4 h-4 text-blue-400" />
                            <span>Ad Copy</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FiFolder className="w-4 h-4 text-blue-400" />
                            <span>Landing Pages</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FiFolder className="w-5 h-5 text-green-500" />
                          <span className="font-semibold">Content</span>
                        </div>
                        <div className="ml-6 space-y-2">
                          <div className="flex items-center gap-3">
                            <FiFolder className="w-4 h-4 text-green-400" />
                            <span>Blog Posts</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FiFolder className="w-4 h-4 text-green-400" />
                            <span>Product Descriptions</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FiFolder className="w-4 h-4 text-green-400" />
                            <span>Bios & About</span>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "sharing":
        return (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 gradient-text">Sharing & Community</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Share your content snippets with the SnippifyX community. 
                Get discovered and inspire others with your amazing content.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Public Sharing</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                          <FiShare className="w-6 h-6" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-4 text-gray-800">Share Your Content</h4>
                      <p className="text-muted-foreground mb-4">Share your best content with the SnippifyX community. Get discovered and inspire others.</p>
                      <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                        <li>• One-click public sharing</li>
                        <li>• Community discovery</li>
                        <li>• Like and save system</li>
                        <li>• Attribution and credits</li>
                      </ul>
                      <Button 
                        size="sm" 
                        className="btn-animate hover-lift"
                        onClick={() => router.push('/public')}
                      >
                        Explore Community
                        <FiArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xl font-bold mb-4">Sharing Features</h4>
                  <div className="space-y-4">
                    <div className="group relative p-4 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 border border-pink-200 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <FiCopy className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h5 className="text-white font-semibold">Copy Link</h5>
                            <p className="text-pink-100 text-sm">Share snippets with a direct link</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 border border-blue-200 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <FiDownload className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h5 className="text-white font-semibold">Export Options</h5>
                            <p className="text-blue-100 text-sm">Download as PDF, TXT, or JSON</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                          Export
                        </Button>
                      </div>
                    </div>

                    <div className="group relative p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 border border-green-200 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <FiStar className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h5 className="text-white font-semibold">Like</h5>
                            <p className="text-green-100 text-sm">Like and save shared content</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                          Like
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Community Features</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 border border-pink-200 overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-4 text-white">Discover Amazing Content</h4>
                    <p className="text-pink-100 mb-6">Explore thousands of shared snippets from the SnippifyX community. Find inspiration and ready-to-use content.</p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-pink-100">
                        <FiStar className="w-4 h-4" />
                        <span className="text-sm">Trending content daily</span>
                      </div>
                      <div className="flex items-center gap-3 text-pink-100">
                        <FiUsers className="w-4 h-4" />
                        <span className="text-sm">50K+ active creators</span>
                      </div>
                      <div className="flex items-center gap-3 text-pink-100">
                        <FiCheck className="w-4 h-4" />
                        <span className="text-sm">Curated quality content</span>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      className="bg-white text-pink-600 hover:bg-gray-100"
                      onClick={() => router.push('/public')}
                    >
                      Explore Community
                      <FiArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 border border-blue-200 overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-4 text-white">Share Your Expertise</h4>
                    <p className="text-blue-100 mb-6">Contribute to the community by sharing your best content. Help others and build your reputation.</p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-blue-100">
                        <FiStar className="w-4 h-4" />
                        <span className="text-sm">Earn recognition</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-100">
                        <FiUsers className="w-4 h-4" />
                        <span className="text-sm">Connect with creators</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-100">
                        <FiCheck className="w-4 h-4" />
                        <span className="text-sm">Grow your network</span>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      className="bg-white text-blue-600 hover:bg-gray-100"
                      onClick={() => router.push('/signup')}
                    >
                      Start Sharing
                      <FiArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "search":
        return (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 gradient-text">Search & Discovery</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Find exactly what you need with our powerful search functionality. 
                Search by content, tags, categories, or keywords to locate your snippets quickly.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Search Features</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                          <FiSearch className="w-6 h-6" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-4 text-gray-800">Smart Search</h4>
                      <p className="text-muted-foreground mb-4">Search through your content with powerful keyword matching and filters.</p>
                      <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                        <li>• Search by keywords and phrases</li>
                        <li>• Find content by title and description</li>
                        <li>• Search within specific folders</li>
                        <li>• Real-time search results</li>
                      </ul>
                    </div>
                  </div>

                  <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                          <FiTag className="w-6 h-6" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-4 text-gray-800">Advanced Filters</h4>
                      <p className="text-muted-foreground mb-4">Narrow down your search with powerful filtering options.</p>
                      <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                        <li>• Filter by content type (social media, email, etc.)</li>
                        <li>• Search by tags and categories</li>
                        <li>• Date range filtering</li>
                        <li>• Language and platform filters</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xl font-bold mb-4">Search Examples</h4>
                  <div className="space-y-4">
                    <div className="group relative p-4 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 border border-pink-200 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <FiSearch className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h5 className="text-white font-semibold">"Instagram bio"</h5>
                            <p className="text-pink-100 text-sm">Finds all Instagram bio content</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 border border-blue-200 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <FiSearch className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h5 className="text-white font-semibold">"email template"</h5>
                            <p className="text-blue-100 text-sm">Finds email templates</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group relative p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 border border-green-200 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <FiSearch className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h5 className="text-white font-semibold">"product launch"</h5>
                            <p className="text-green-100 text-sm">Finds product launch content</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Search Tools</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiSearch className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Instant Search</h4>
                    <p className="text-muted-foreground text-sm">Get results as you type with real-time search</p>
                  </div>
                </div>
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiStar className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Search History</h4>
                    <p className="text-muted-foreground text-sm">Quick access to your recent searches</p>
                  </div>
                </div>
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiFolder className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Search Within Folders</h4>
                    <p className="text-muted-foreground text-sm">Search specific folders or across all content</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Search Tips</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 border border-pink-200 overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-4 text-white">Pro Search Tips</h4>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-pink-100">
                        <FiSearch className="w-4 h-4" />
                        <span className="text-sm">Use quotes for exact phrases</span>
                      </div>
                      <div className="flex items-center gap-3 text-pink-100">
                        <FiTag className="w-4 h-4" />
                        <span className="text-sm">Search by hashtags and tags</span>
                      </div>
                      <div className="flex items-center gap-3 text-pink-100">
                        <FiFolder className="w-4 h-4" />
                        <span className="text-sm">Filter by folder or category</span>
                      </div>
                      <div className="flex items-center gap-3 text-pink-100">
                        <FiStar className="w-4 h-4" />
                        <span className="text-sm">Search your liked content</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 border border-blue-200 overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-4 text-white">Keyboard Shortcuts</h4>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-blue-100">
                        <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">Ctrl/Cmd + K</kbd>
                        <span className="text-sm">Quick search</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-100">
                        <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">Ctrl/Cmd + F</kbd>
                        <span className="text-sm">Search in current page</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-100">
                        <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">Esc</kbd>
                        <span className="text-sm">Clear search</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-100">
                        <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">↑↓</kbd>
                        <span className="text-sm">Navigate results</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 gradient-text">Security & Privacy</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Your data security and privacy are our top priorities. We implement industry-standard 
                security measures to protect your content and personal information.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Data Protection</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                          <FiShield className="w-6 h-6" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-4 text-gray-800">Encryption</h4>
                      <p className="text-muted-foreground mb-4">All your data is encrypted both in transit and at rest using industry-standard protocols.</p>
                      <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                        <li>• AES-256 encryption for data at rest</li>
                        <li>• TLS 1.3 for data in transit</li>
                        <li>• End-to-end encryption for sensitive data</li>
                        <li>• Secure key management</li>
                      </ul>
                    </div>
                  </div>

                  <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                          <FiLock className="w-6 h-6" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-4 text-gray-800">Access Control</h4>
                      <p className="text-muted-foreground mb-4">Granular control over who can access your content and data.</p>
                      <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                        <li>• Role-based access control</li>
                        <li>• Two-factor authentication (2FA)</li>
                        <li>• Session management</li>
                        <li>• IP-based access restrictions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xl font-bold mb-4">Security Features</h4>
                  <div className="space-y-4">
                    <div className="group relative p-4 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 border border-red-200 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <FiShield className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h5 className="text-white font-semibold">Data Backup</h5>
                            <p className="text-red-100 text-sm">Automatic daily backups with 30-day retention</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group relative p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 border border-blue-200 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <FiEye className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h5 className="text-white font-semibold">Privacy Controls</h5>
                            <p className="text-blue-100 text-sm">Control visibility of your content</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group relative p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 border border-green-200 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <FiActivity className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h5 className="text-white font-semibold">Activity Monitoring</h5>
                            <p className="text-green-100 text-sm">Track access and changes to your data</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Privacy Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiEye className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Content Visibility</h4>
                    <p className="text-muted-foreground text-sm">Choose who can see your content - private, public, or shared</p>
                  </div>
                </div>
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiUser className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Data Ownership</h4>
                    <p className="text-muted-foreground text-sm">You retain full ownership of all your content and data</p>
                  </div>
                </div>
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiDownload className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Data Export</h4>
                    <p className="text-muted-foreground text-sm">Export your data anytime in standard formats</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Compliance & Standards</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 border border-blue-200 overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-4 text-white">Security Standards</h4>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-blue-100">
                        <FiCheck className="w-4 h-4" />
                        <span className="text-sm">SOC 2 Type II compliance</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-100">
                        <FiCheck className="w-4 h-4" />
                        <span className="text-sm">GDPR compliant</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-100">
                        <FiCheck className="w-4 h-4" />
                        <span className="text-sm">ISO 27001 certified</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-100">
                        <FiCheck className="w-4 h-4" />
                        <span className="text-sm">Regular security audits</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 border border-green-200 overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-4 text-white">Privacy Rights</h4>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-green-100">
                        <FiUser className="w-4 h-4" />
                        <span className="text-sm">Right to access your data</span>
                      </div>
                      <div className="flex items-center gap-3 text-green-100">
                        <FiEdit className="w-4 h-4" />
                        <span className="text-sm">Right to correct data</span>
                      </div>
                      <div className="flex items-center gap-3 text-green-100">
                        <FiTrash className="w-4 h-4" />
                        <span className="text-sm">Right to delete data</span>
                      </div>
                      <div className="flex items-center gap-3 text-green-100">
                        <FiDownload className="w-4 h-4" />
                        <span className="text-sm">Right to data portability</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Security Best Practices</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiKey className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Account Security</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Enable two-factor authentication</li>
                      <li>• Use strong, unique passwords</li>
                      <li>• Regularly review account activity</li>
                      <li>• Log out from shared devices</li>
                    </ul>
                  </div>
                </div>
                <div className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FiShield className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Content Security</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Review sharing permissions regularly</li>
                      <li>• Use private folders for sensitive content</li>
                      <li>• Monitor public content access</li>
                      <li>• Backup important content locally</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 gradient-text">Documentation</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                This section is under development. Check back soon for comprehensive documentation.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        {/* Hero Section */}
        <AnimatedSection>
          <section className="relative py-32">
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                
                <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in-up animation-delay-200">
                  <span className="gradient-text">SnippifyX Documentation</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-400">
                  Everything you need to know about using SnippifyX effectively. 
                  From getting started to advanced features.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search documentation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full sm:w-80 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 btn-animate hover-lift bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => window.location.href = 'mailto:your-email@gmail.com?subject=SnippifyX Documentation Question&body=Hello,%0D%0A%0D%0AI have a question about SnippifyX documentation. Please help me with:%0D%0A%0D%0A[Describe your question here]%0D%0A%0D%0AThank you!'}
                  >
                    <FiMail className="mr-2 h-5 w-5" />
                    Ask for Help
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Documentation Content */}
        <AnimatedSection>
          <section className="py-24 relative z-10">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-4 gap-8">
                  {/* Sidebar Navigation */}
                  <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-8 lg:h-fit">
                      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Documentation</h3>
                        <nav className="space-y-2">
                          {navigation.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setActiveSection(item.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-300 ${
                                activeSection === item.id
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {item.icon}
                              <span className="text-sm font-medium">{item.title}</span>
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="lg:col-span-3">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                      {renderSection()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection>
          <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  Ready to Get Started?
                </h2>
                <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
                  Start organizing your snippets today with SnippifyX's powerful features.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-10 py-4 btn-animate hover-lift border-2 border-white text-white hover:bg-white hover:text-blue-600"
                    onClick={() => window.location.href = 'mailto:your-email@gmail.com?subject=SnippifyX Support Request&body=Hello,%0D%0A%0D%0AI need help with SnippifyX. Please provide details about your issue below:%0D%0A%0D%0A[Describe your issue here]%0D%0A%0D%0AThank you!'}
                  >
                    <FiMessageCircle className="mr-2 h-5 w-5" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </div>
    </MarketingLayout>
  );
} 