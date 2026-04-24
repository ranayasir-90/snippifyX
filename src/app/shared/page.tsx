"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FiCopy, 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiSearch, 
  FiUsers, 
  FiShare2, 
  FiClock, 
  FiStar, 
  FiUser, 
  FiLock,
  FiEye,
  FiDownload,
  FiHeart,
  FiMessageCircle,
  FiTrendingUp,
  FiZap,
  FiGrid,
  FiList,
  FiFileText,
  FiX,
  FiFilter,
  FiGlobe,
  FiLink,
  FiBarChart,
  FiRefreshCw
} from "react-icons/fi";
import { snippetService, Snippet } from "@/lib/firebaseServices";
import { useRouter } from "next/navigation";
import SnippetDetailModal from "@/components/SnippetDetailModal";
import { useError } from "@/contexts/ErrorContext";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";

// Helper function to convert Timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (!timestamp) return new Date(0);
  if (typeof timestamp === 'object' && 'toDate' in timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

export default function Shared() {
  const { user } = useAuth();
  const router = useRouter();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "category">("date");
  const [showFilters, setShowFilters] = useState(false);
  const [showSnippetModal, setShowSnippetModal] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [likedSnippets, setLikedSnippets] = useState<Set<string>>(new Set());
  const [likingSnippet, setLikingSnippet] = useState<string | null>(null);
  const { showError } = useError();
  const { showConfirm } = useConfirmDialog();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortSnippets();
  }, [snippets, searchTerm, selectedCategory, sortBy]);

  const loadData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      console.log("Loading user's shared snippets...");
      const snippetsData = await snippetService.getByUser(user.id);
      // Filter only public snippets for shared view
      const publicSnippets = snippetsData.filter(snippet => snippet.isPublic);
      console.log("User's public snippets:", publicSnippets);
      setSnippets(publicSnippets);
      
      // Load liked snippets for current user using the likedBy array from snippet data
      const likedSnippetIds = new Set<string>();
      publicSnippets.forEach(snippet => {
        if (snippet.id && snippet.likedBy && snippet.likedBy.includes(user.id)) {
          likedSnippetIds.add(snippet.id);
        }
      });
      setLikedSnippets(likedSnippetIds);
    } catch (error) {
      console.error("Error loading data:", error);
      showError("Error loading data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSnippets = () => {
    let filtered = [...snippets];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(snippet.tags) && snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(snippet => snippet.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "date":
        default:
          const dateA = timestampToDate(a.updatedAt).getTime();
          const dateB = timestampToDate(b.updatedAt).getTime();
          return dateB - dateA;
      }
    });

    setFilteredSnippets(filtered);
  };

  const handleCreateSnippet = () => {
    router.push("/snippets/new");
  };

  const handleSnippetClick = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setShowSnippetModal(true);
  };

  const closeSnippetModal = () => {
    setShowSnippetModal(false);
    setSelectedSnippet(null);
  };

  const deleteSnippet = async (snippetId: string) => {
    showConfirm({ 
      message: 'Are you sure you want to delete this snippet? This action cannot be undone.', 
      onConfirm: async () => {
        try {
          await snippetService.delete(snippetId);
          // Close the modal if it's open
          if (showSnippetModal) {
            setShowSnippetModal(false);
            setSelectedSnippet(null);
          }
          // Refresh the data
          await loadData();
        } catch (error) {
          console.error("Error deleting snippet:", error);
          showError("Error deleting snippet. Please try again later.");
        }
      },
      confirmText: "Delete",
      cancelText: "Cancel"
    });
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      showError("Error copying to clipboard. Please try again later.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestampToDate(timestamp);
    return date.toLocaleDateString();
  };

  const getCategories = () => {
    const categories = [...new Set(snippets.map(s => s.category).filter(Boolean))];
    return categories.sort();
  };

  const getStats = () => {
    return {
      total: snippets.length,
      categories: getCategories().length,
      thisMonth: snippets.filter(s => {
        const date = timestampToDate(s.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length,
      totalViews: snippets.length * 10, // Mock data for now
      totalLikes: snippets.reduce((sum, s) => sum + (s.likes || 0), 0)
    };
  };

  const stats = getStats();

  const handleLike = async (snippetId: string) => {
    if (!user?.id) return;
    
    try {
      setLikingSnippet(snippetId);
      await snippetService.likeSnippet(snippetId, user.id);
      
      // Update local state
      const newLikedSnippets = new Set(likedSnippets);
      if (newLikedSnippets.has(snippetId)) {
        newLikedSnippets.delete(snippetId);
      } else {
        newLikedSnippets.add(snippetId);
      }
      setLikedSnippets(newLikedSnippets);
      
      // Update snippets array
      setSnippets(prevSnippets => 
        prevSnippets.map(snippet => {
          if (snippet.id === snippetId) {
            const currentLikes = snippet.likes || 0;
            return {
              ...snippet,
              likes: newLikedSnippets.has(snippetId) ? currentLikes + 1 : currentLikes - 1
            };
          }
          return snippet;
        })
      );
    } catch (error) {
      console.error("Error liking snippet:", error);
      showError("Error liking snippet. Please try again later.");
    } finally {
      setLikingSnippet(null);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {/* Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative px-6 py-16 sm:px-8 sm:py-20">
              <div className="mx-auto max-w-7xl">
                <div className="text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Shared Snippets
                  </h1>
                  <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                    Your public snippets shared with the community. Inspire others and grow your network.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
          </div>

          <div className="px-6 py-8 sm:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your shared snippets...</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-6 py-16 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Shared Snippets
                </h1>
                <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                  Your public snippets shared with the community. Inspire others and grow your network.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Public Library
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage and showcase your shared code snippets
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={loadData}
                  variant="outline"
                  className="px-6 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
                >
                  <FiRefreshCw className="mr-2 h-5 w-5" />
                  Refresh
                </Button>
                <Button 
                  onClick={handleCreateSnippet} 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FiPlus className="h-5 w-5" />
                  <span>Create Snippet</span>
                </Button>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Shared</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Public snippets
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiGlobe className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Views</p>
                    <p className="text-3xl font-bold text-green-900">{stats.total * 10}</p>
                    <p className="text-xs text-green-600 mt-1">
                      Community views
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiEye className="h-7 w-7 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Total Likes</p>
                    <p className="text-3xl font-bold text-purple-900">{stats.totalLikes}</p>
                    <p className="text-xs text-purple-600 mt-1">
                      Community likes
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiHeart className="h-7 w-7 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">This Month</p>
                    <p className="text-3xl font-bold text-orange-900">{stats.thisMonth}</p>
                    <p className="text-xs text-orange-600 mt-1">
                      New shares
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiTrendingUp className="h-7 w-7 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search your shared snippets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 rounded-xl border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    size="sm"
                    className="px-4 py-2 rounded-xl border-gray-300 hover:bg-gray-50"
                  >
                    <FiFilter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setViewMode("grid")}
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      className="px-3 py-2 rounded-xl"
                    >
                      <FiGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setViewMode("list")}
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      className="px-3 py-2 rounded-xl"
                    >
                      <FiList className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex flex-wrap gap-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      {getCategories().map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "date" | "name" | "category")}
                      className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="name">Sort by Name</option>
                      <option value="category">Sort by Category</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredSnippets.length} snippet{filteredSnippets.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Snippets Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSnippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => handleSnippetClick(snippet)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FiFileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {snippet.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiGlobe className="h-4 w-4 text-green-500" />
                        {snippet.id && likedSnippets.has(snippet.id) && (
                          <FiHeart className="h-4 w-4 text-red-500 fill-current" />
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {snippet.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {snippet.content.length > 120 
                        ? `${snippet.content.substring(0, 120)}...` 
                        : snippet.content
                      }
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <FiClock className="h-4 w-4" />
                        <span>{formatDate(snippet.updatedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiEye className="h-4 w-4" />
                        <span>Public</span>
                      </div>
                    </div>

                    {snippet.tags && snippet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {snippet.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                        {snippet.tags.length > 2 && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{snippet.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(snippet.content);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FiCopy className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSnippetClick(snippet);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FiEye className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (snippet.id) {
                              handleLike(snippet.id);
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          disabled={snippet.id ? likingSnippet === snippet.id : false}
                        >
                          <FiHeart className={`h-4 w-4 ${snippet.id && likedSnippets.has(snippet.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                        </button>
                        <span className="text-xs text-gray-500">
                          {snippet.likes || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (snippet.id) {
                              deleteSnippet(snippet.id);
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <FiTrash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSnippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    onClick={() => handleSnippetClick(snippet)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {snippet.title}
                        </h3>
                        <FiGlobe className="h-5 w-5 text-green-500" />
                        {snippet.id && likedSnippets.has(snippet.id) && (
                          <FiHeart className="h-5 w-5 text-red-500 fill-current" />
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2 line-clamp-2 truncate">
                        {snippet.content.length > 120 
                          ? `${snippet.content.substring(0, 120)}...` 
                          : snippet.content
                        }
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FiClock className="h-4 w-4" />
                          <span>{formatDate(snippet.updatedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiFileText className="h-4 w-4" />
                          <span>{snippet.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiEye className="h-4 w-4" />
                          <span>Public</span>
                        </div>
                      </div>
                      
                      {snippet.tags && snippet.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {snippet.tags.slice(0, 5).map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                          {snippet.tags.length > 5 && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{snippet.tags.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-0 opacity-100 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(snippet.content);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <FiCopy className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSnippetClick(snippet);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <FiEye className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (snippet.id) {
                            handleLike(snippet.id);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        disabled={snippet.id ? likingSnippet === snippet.id : false}
                      >
                        <FiHeart className={`h-4 w-4 ${snippet.id && likedSnippets.has(snippet.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                      </button>
                      <span className="text-xs text-gray-500">
                        {snippet.likes || 0}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (snippet.id) {
                            deleteSnippet(snippet.id);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredSnippets.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <FiGlobe className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No shared snippets found
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t shared any snippets yet. Create your first public snippet and start inspiring the community!'}
                </p>
                {!searchTerm && (
                  <Button onClick={handleCreateSnippet} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                    <FiPlus className="mr-2 h-6 w-6" />
                    Create Your First Shared Snippet
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Snippet Detail Modal */}
        <SnippetDetailModal
          open={showSnippetModal}
          onClose={closeSnippetModal}
          snippet={selectedSnippet}
          folders={[]}
          user={user}
          onEdit={(snippet) => snippet.id && router.push(`/snippets/${snippet.id}/edit`)}
          onDelete={(snippet) => snippet.id && deleteSnippet(snippet.id)}
          onLike={(snippetId) => handleLike(snippetId)}
          isLiked={selectedSnippet?.id ? likedSnippets.has(selectedSnippet.id) : false}
          showEditDelete={true}
          showLikeButton={true}
          showFolder={false}
          showFavorite={false}
        />
      </div>
    </AppLayout>
  );
} 
