"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/layouts/AppLayout";
import MarketingLayout from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { 
  FiCopy, 
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
  FiCode,
  FiX,
  FiFilter,
  FiGlobe,
  FiLink,
  FiBarChart,
  FiRefreshCw,
  FiPlus
} from "react-icons/fi";
import { snippetService, Snippet } from "@/lib/firebaseServices";
import SnippetDetailModal from "@/components/SnippetDetailModal";
import SnippetCard from "@/components/SnippetCard";
import { useError } from "@/contexts/ErrorContext";

// Helper function to convert Timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (!timestamp) return new Date(0);
  if (typeof timestamp === 'object' && 'toDate' in timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

export default function PublicSnippets() {
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
  const [currentPage, setCurrentPage] = useState(1);
  const SNIPPETS_PER_PAGE = 60;
  const [selectedTag, setSelectedTag] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortSnippets();
    setCurrentPage(1); // Reset page on filter/search change
  }, [snippets, searchTerm, selectedCategory, selectedTag, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("Loading community public snippets...");
      // Get all public snippets from all users
      const allSnippets = await snippetService.getAllPublic();
      console.log("Community public snippets loaded:", allSnippets);
      setSnippets(allSnippets);
      
      // Load liked snippets for current user using the likedBy array from snippet data
      if (user?.id) {
        const likedSnippetIds = new Set<string>();
        allSnippets.forEach(snippet => {
          if (snippet.id && snippet.likedBy && snippet.likedBy.includes(user.id)) {
            likedSnippetIds.add(snippet.id);
          }
        });
        setLikedSnippets(likedSnippetIds);
      }
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
        (Array.isArray(snippet.tags) && snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        snippet.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(snippet => snippet.category === selectedCategory);
    }

    // Tag filter
    if (selectedTag !== "all") {
      filtered = filtered.filter(snippet => Array.isArray(snippet.tags) && snippet.tags.includes(selectedTag));
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

  const handleSnippetClick = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setShowSnippetModal(true);
  };

  const closeSnippetModal = () => {
    setShowSnippetModal(false);
    setSelectedSnippet(null);
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

  const getTags = () => {
    const tagsSet = new Set<string>();
    snippets.forEach(s => Array.isArray(s.tags) && s.tags.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
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
      uniqueUsers: [...new Set(snippets.map(s => s.userId))].length,
      totalViews: snippets.length * 15, // Mock data
      totalLikes: snippets.reduce((sum, s) => sum + (s.likes || 0), 0)
    };
  };

  const stats = getStats();

  const handleLike = async (snippetId: string) => {
    if (!user?.id) {
      // Show a friendly message instead of redirecting
      alert("Please sign in to like snippets. You can still browse and copy all content!");
      return;
    }
    
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

  // Use AppLayout when user is logged in (app sidebar), MarketingLayout when not logged in (marketing header)
  const Layout = user ? AppLayout : MarketingLayout;

  // Pagination logic
  const totalPages = Math.ceil(filteredSnippets.length / SNIPPETS_PER_PAGE);
  const paginatedSnippets = filteredSnippets.slice(
    (currentPage - 1) * SNIPPETS_PER_PAGE,
    currentPage * SNIPPETS_PER_PAGE
  );

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {/* Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative px-6 py-16 sm:px-8 sm:py-20">
              <div className="mx-auto max-w-7xl">
                <div className="text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Community Snippets
                  </h1>
                  <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                    Discover amazing code snippets shared by developers worldwide. Learn, inspire, and grow together.
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
                  <p className="text-gray-600">Loading community snippets...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-6 py-16 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Community Snippets
                </h1>
                <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                  Discover amazing code snippets shared by developers worldwide. Learn, inspire, and grow together.
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
                  Explore Community
                </h2>
                <p className="text-gray-600 mt-1">
                  Browse and discover code snippets from developers around the world
                </p>
              </div>
              {!user && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => router.push("/login")}
                    variant="outline"
                    className="px-4 py-2 rounded-xl border-gray-300 hover:bg-gray-50"
                  >
                    <FiUser className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  <Button
                    onClick={() => router.push("/signup")}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Join Community
                  </Button>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search snippets, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-xl border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>

            {/* Filters and View Mode */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="px-4 py-2 rounded-xl border-gray-300 hover:bg-gray-50"
                >
                  <FiFilter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === "grid"
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FiGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === "list"
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FiList className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {getCategories().map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Tags</option>
                    {getTags().map((tag) => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "date" | "name" | "category")}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Latest</option>
                    <option value="name">Name</option>
                    <option value="category">Category</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedTag("all");
                      setSortBy("date");
                    }}
                    variant="outline"
                    className="w-full py-2 rounded-xl border-gray-300 hover:bg-gray-50"
                  >
                    <FiRefreshCw className="mr-2 h-4 w-4" />
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredSnippets.length} {filteredSnippets.length === 1 ? 'Snippet' : 'Snippets'} Found
                </h2>
                <p className="text-sm text-gray-500">
                  Showing community snippets
                </p>
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSnippets.map((snippet) => (
                    <SnippetCard
                      key={snippet.id}
                      snippet={snippet}
                      onCopy={() => copyToClipboard(snippet.content)}
                      onLike={() => snippet.id && handleLike(snippet.id)}
                      isLiked={snippet.id ? likedSnippets.has(snippet.id) : false}
                      isLoading={likingSnippet === snippet.id}
                      onClick={() => snippet.id && handleSnippetClick(snippet)}
                      viewMode="grid"
                      showLikeButton={true}
                      showFolder={false}
                      showFavorite={false}
                      isPublicContext={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedSnippets.map((snippet) => (
                    <SnippetCard
                      key={snippet.id}
                      snippet={snippet}
                      onCopy={() => copyToClipboard(snippet.content)}
                      onLike={() => snippet.id && handleLike(snippet.id)}
                      isLiked={snippet.id ? likedSnippets.has(snippet.id) : false}
                      isLoading={likingSnippet === snippet.id}
                      onClick={() => snippet.id && handleSnippetClick(snippet)}
                      viewMode="list"
                      showLikeButton={true}
                      showFolder={false}
                      showFavorite={false}
                      isPublicContext={true}
                    />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    className="px-3 py-1 rounded"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-600 text-white' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    className="px-3 py-1 rounded"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

            {filteredSnippets.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <FiCode className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No snippets found
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm || selectedCategory !== "all" ? 'Try adjusting your search terms or filters' : 'Be the first to share a snippet with the community!'}
                </p>
                {!searchTerm && selectedCategory === "all" && (
                  <Button 
                    onClick={() => router.push("/signup")} 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FiPlus className="mr-2 h-6 w-6" />
                    Join Community to Share
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
          onEdit={undefined}
          onDelete={undefined}
          onLike={(snippetId) => handleLike(snippetId)}
          isLiked={selectedSnippet?.id ? likedSnippets.has(selectedSnippet.id) : false}
          showEditDelete={Boolean(user && selectedSnippet && selectedSnippet.userId === user.id)}
          showLikeButton={true}
          showFolder={false}
          showFavorite={false}
        />
      </div>
    </Layout>
  );
} 