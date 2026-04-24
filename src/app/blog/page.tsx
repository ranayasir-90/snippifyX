"use client";

import MarketingLayout from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  FiCalendar, 
  FiUser, 
  FiClock, 
  FiTag, 
  FiArrowRight, 
  FiSearch,
  FiBook,
  FiShare,
  FiFolder,
  FiStar,
  FiUsers,
  FiZap,
  FiTrendingUp,
  FiMessageCircle,
  FiEye,
  FiHeart
} from "react-icons/fi";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useError } from "@/contexts/ErrorContext";
import { useAuth } from "@/contexts/AuthContext";

export default function BlogPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { showError } = useError();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const categories = [
    { id: "all", name: "All Posts", count: 12 },
    { id: "features", name: "Features", count: 4 },
    { id: "tutorials", name: "Tutorials", count: 3 },
    { id: "updates", name: "Updates", count: 3 },
    { id: "tips", name: "Tips & Tricks", count: 2 },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Introducing Advanced Search: Find Your Content Faster",
      excerpt: "Discover how our new AI-powered search feature helps you find exactly what you need in seconds. Learn about smart filters, tags, and search suggestions.",
      author: "SnippifyX Team",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "features",
      tags: ["Search", "AI", "Productivity"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      featured: true,
      views: 1247,
      likes: 89,
      comments: 23
    },
    {
      id: 2,
      title: "How to Organize Your Content with Smart Folders",
      excerpt: "Learn the best practices for organizing your content snippets with our intuitive folder system. Create categories, use tags, and keep everything organized.",
      author: "Sarah Chen",
      date: "2024-01-12",
      readTime: "4 min read",
      category: "tutorials",
      tags: ["Organization", "Folders", "Productivity"],
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop",
      featured: false,
      views: 892,
      likes: 67,
      comments: 15
    },
    {
      id: 3,
      title: "New Sharing Features: Collaborate with Your Team",
      excerpt: "Explore our latest sharing capabilities that make team collaboration seamless. Share snippets, set permissions, and work together efficiently.",
      author: "Mike Johnson",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "features",
      tags: ["Sharing", "Collaboration", "Teams"],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
      featured: false,
      views: 756,
      likes: 54,
      comments: 12
    },
    {
      id: 4,
      title: "10 Productivity Tips for Content Creators",
      excerpt: "Boost your productivity with these proven tips and tricks. From keyboard shortcuts to workflow optimization, discover how to work smarter.",
      author: "Emma Wilson",
      date: "2024-01-08",
      readTime: "8 min read",
      category: "tips",
      tags: ["Productivity", "Tips", "Workflow"],
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
      featured: false,
      views: 1103,
      likes: 78,
      comments: 19
    },
    {
      id: 5,
      title: "SnippifyX v2.1: What's New and Improved",
      excerpt: "Get the details on our latest update including performance improvements, new features, and bug fixes that make SnippifyX even better.",
      author: "SnippifyX Team",
      date: "2024-01-05",
      readTime: "3 min read",
      category: "updates",
      tags: ["Update", "Features", "Performance"],
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
      featured: false,
      views: 634,
      likes: 42,
      comments: 8
    },
    {
      id: 6,
      title: "Building a Content Library: A Complete Guide",
      excerpt: "Learn how to build and maintain a comprehensive content library that grows with your business. Organize, tag, and manage your content effectively.",
      author: "David Kim",
      date: "2024-01-03",
      readTime: "7 min read",
      category: "tutorials",
      tags: ["Library", "Organization", "Guide"],
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
      featured: false,
      views: 945,
      likes: 71,
      comments: 16
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);

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
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                  <FiBook className="w-4 h-4 text-blue-400 mr-2" />
                  SnippifyX Blog
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in-up animation-delay-200">
                  SnippifyX <span className="gradient-text">Blog</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-400">
                  Discover tips, tutorials, and insights to help you organize, share, and create amazing content with SnippifyX.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full sm:w-80 rounded-lg border border-gray-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Categories Filter */}
        <AnimatedSection>
          <section className="py-8 relative z-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-white/70 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/90"
                    }`}
                  >
                    {category.name}
                    <span className="ml-2 text-sm opacity-75">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Featured Post */}
        {featuredPost && (
          <AnimatedSection>
            <section className="py-16 relative z-10">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <div className="relative">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-64 md:h-80 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <FiUser className="w-4 h-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold mb-4 text-gray-800">
                        {featuredPost.title}
                      </h2>
                      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiEye className="w-4 h-4" />
                            <span>{featuredPost.views}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiHeart className="w-4 h-4" />
                            <span>{featuredPost.likes}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiMessageCircle className="w-4 h-4" />
                            <span>{featuredPost.comments}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => router.push(`/blog/${featuredPost.id}`)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          Read More
                          <FiArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* Blog Posts Grid */}
        <AnimatedSection>
          <section className="py-16 relative z-10">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.filter(post => !post.featured).map((post) => (
                  <article
                    key={post.id}
                    className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  >
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded-full">
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <FiUser className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FiEye className="w-3 h-3" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FiHeart className="w-3 h-3" />
                            <span>{post.likes}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => router.push(`/blog/${post.id}`)}
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 p-0"
                        >
                          Read More
                          <FiArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Newsletter Section */}
        <AnimatedSection>
          <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  Stay Updated
                </h2>
                <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
                  Get the latest SnippifyX updates, tips, and tutorials delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-xl border-0 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="text-lg px-8 py-4 btn-animate hover-lift bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Subscribe
                    <FiArrowRight className="w-5 h-5 ml-2" />
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
