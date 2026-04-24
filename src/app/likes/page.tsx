"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/layouts/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList,
  FiCode,
  FiCopy,
  FiEdit,
  FiTrash2,
  FiShare2,
  FiClock,
  FiFolder,
  FiEye,
  FiDownload,
  FiX,
  FiHeart,
  FiStar,
  FiZap,
  FiGlobe,
  FiLock
} from "react-icons/fi";
import { snippetService, folderService, tagService, Snippet, Folder, Tag } from "@/lib/firebaseServices";
import { useRouter } from "next/navigation";
import SnippetDetailModal from "@/components/SnippetDetailModal";
import SnippetCard from "@/components/SnippetCard";
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

export default function Likes() {
  const { user } = useAuth();
  const router = useRouter();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "category">("date");
  const [showFilters, setShowFilters] = useState(false);
  const [showSnippetModal, setShowSnippetModal] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
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
  }, [snippets, searchTerm, selectedCategory, selectedTag, selectedFolder, sortBy]);

  const loadData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Get all public snippets first
      const allPublicSnippets = await snippetService.getAllPublic();
      
      // Get user's own snippets
      const userSnippets = await snippetService.getByUser(user.id);
      
      // Combine all snippets and remove duplicates based on snippet ID
      const snippetMap = new Map();
      
      // Add public snippets first
      allPublicSnippets.forEach(snippet => {
        if (snippet.id) {
          snippetMap.set(snippet.id, snippet);
        }
      });
      
      // Add user snippets (these will override public ones if same ID, which is correct)
      userSnippets.forEach(snippet => {
        if (snippet.id) {
          snippetMap.set(snippet.id, snippet);
        }
      });
      
      // Convert map back to array
      const allSnippets = Array.from(snippetMap.values());
      
      // Filter to only show snippets that the user has liked
      const likedSnippets = allSnippets.filter(snippet => 
        snippet.likedBy && snippet.likedBy.includes(user.id)
      );
      
      console.log("Liked snippets loaded:", likedSnippets);
      
      // Get folders and tags for user's own snippets
      const [foldersData, tagsData] = await Promise.all([
        folderService.getByUser(user.id),
        tagService.getByUser(user.id)
      ]);
      
      setSnippets(likedSnippets);
      setFolders(foldersData);
      setTags(tagsData);
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

    // Folder filter (only for user's own snippets)
    if (selectedFolder !== "all") {
      filtered = filtered.filter(snippet => snippet.folderId === selectedFolder);
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

  const handleLike = async (snippetId: string) => {
    if (!user?.id) return;
    
    try {
      setLikingSnippet(snippetId);
      await snippetService.likeSnippet(snippetId, user.id);
      
      // Update local state
      setSnippets(prevSnippets => 
        prevSnippets.map(snippet => {
          if (snippet.id === snippetId) {
            const currentLikes = snippet.likes || 0;
            const likedBy = snippet.likedBy || [];
            const isCurrentlyLiked = likedBy.includes(user.id);
            
            if (isCurrentlyLiked) {
              // Remove from liked snippets
              return null;
            } else {
              // Add to liked snippets
              return {
                ...snippet,
                likes: currentLikes + 1,
                likedBy: [...likedBy, user.id]
              };
            }
          }
          return snippet;
        }).filter(Boolean) as Snippet[]
      );
    } catch (error) {
      console.error("Error liking snippet:", error);
      showError("Error liking snippet. Please try again later.");
    } finally {
      setLikingSnippet(null);
    }
  };

  const toggleLike = async (snippetId: string, currentFavorite: boolean) => {
    if (!user?.id) return;
    
    try {
      await snippetService.update(snippetId, { favorite: !currentFavorite });
      await loadData(); // Reload data to reflect changes
    } catch (error) {
      console.error("Error toggling like:", error);
      showError("Error toggling like. Please try again later.");
    }
  };

  const deleteSnippet = async (snippetId: string) => {
    showConfirm({ message: 'Are you sure you want to delete this snippet?', onConfirm: async () => {
      try {
        await snippetService.delete(snippetId);
        await loadData();
      } catch (error) {
        console.error("Error deleting snippet:", error);
        showError("Error deleting snippet. Please try again later.");
      }
    } });
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // You could add a toast notification here
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      showError("Error copying to clipboard. Please try again later.");
    }
  };

  const getTagColor = (tagName: string) => {
    const tag = tags.find(t => t.name === tagName);
    return tag?.color || "#6B7280";
  };

  const getFolderName = (folderId: string | undefined) => {
    if (!folderId) return "";
    const folder = folders.find(f => f.id === folderId);
    return folder?.name || "";
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
      public: snippets.filter(s => s.isPublic).length,
      private: snippets.filter(s => !s.isPublic).length,
      categories: getCategories().length
    };
  };

  const stats = getStats();

  return (
    <AuthGuard>
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {/* Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-pink-600 to-purple-600">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative px-6 py-8 lg:py-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="text-white">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                      Liked Snippets
                    </h1>
                    <p className="text-red-100 text-lg">
                      All the snippets you've liked from the community and your own collection
                    </p>
                  </div>
                  <Button 
                    onClick={handleCreateSnippet} 
                    className="px-6 py-3 rounded-xl bg-white text-red-600 hover:bg-gray-50 shadow-lg"
                  >
                    <FiPlus className="mr-2 h-5 w-5" />
                    New Snippet
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Liked</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                      <p className="text-xs text-gray-500 mt-1">All your likes</p>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <FiHeart className="h-7 w-7 text-white fill-current" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Public</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.public}</p>
                      <p className="text-xs text-gray-500 mt-1">Community snippets</p>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <FiGlobe className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Private</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.private}</p>
                      <p className="text-xs text-gray-500 mt-1">Your own snippets</p>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <FiLock className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Categories</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.categories}</p>
                      <p className="text-xs text-gray-500 mt-1">Different types</p>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <FiGrid className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Search and Filters */}
            <div className="mb-8 space-y-6">
              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search liked snippets by title, content, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 rounded-2xl border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-lg"
                />
              </div>

              {/* Filters and Controls */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="px-4 py-2 rounded-xl flex items-center space-x-2 border-gray-200 hover:bg-gray-50"
                  >
                    <FiFilter className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>

                  {showFilters && (
                    <div className="flex flex-wrap gap-3">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
                      >
                        <option value="all">All Categories</option>
                        {getCategories().map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>

                      <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
                      >
                        <option value="all">All Tags</option>
                        {tags.map(tag => (
                          <option key={tag.id} value={tag.name}>{tag.name}</option>
                        ))}
                      </select>

                      <select
                        value={selectedFolder}
                        onChange={(e) => setSelectedFolder(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
                      >
                        <option value="all">All Folders</option>
                        {folders.map(folder => (
                          <option key={folder.id} value={folder.id}>{folder.name}</option>
                        ))}
                      </select>

                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "date" | "name" | "category")}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
                      >
                        <option value="date">Sort by Date</option>
                        <option value="name">Sort by Name</option>
                        <option value="category">Sort by Category</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl shadow-lg border border-gray-200">
                  <Button
                    onClick={() => setViewMode("grid")}
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    className={`px-3 py-2 rounded-xl ${viewMode === "grid" ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' : ''}`}
                  >
                    <FiGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setViewMode("list")}
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    className={`px-3 py-2 rounded-xl ${viewMode === "list" ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' : ''}`}
                  >
                    <FiList className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600 font-medium">
                {filteredSnippets.length} liked snippet{filteredSnippets.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Snippets Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSnippets.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    folderName={getFolderName(snippet.folderId) || ""}
                    tagColors={Object.fromEntries(tags.map(tag => [tag.name, tag.color]))}
                    onCopy={() => copyToClipboard(snippet.content)}
                    onFavorite={() => snippet.id && toggleLike(snippet.id, snippet.favorite || false)}
                    onDelete={snippet.userId === user?.id ? () => snippet.id && deleteSnippet(snippet.id) : undefined}
                    onEdit={snippet.userId === user?.id ? () => snippet.id && router.push(`/snippets/${snippet.id}/edit`) : undefined}
                    onLike={() => snippet.id && handleLike(snippet.id)}
                    isLiked={true}
                    isLoading={likingSnippet === snippet.id}
                    onClick={() => snippet.id && handleSnippetClick(snippet)}
                    viewMode="grid"
                    showLikeButton={true}
                    showFolder={snippet.userId === user?.id}
                    showFavorite={snippet.userId === user?.id}
                    isPublicContext={snippet.userId !== user?.id}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSnippets.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    folderName={getFolderName(snippet.folderId) || ""}
                    tagColors={Object.fromEntries(tags.map(tag => [tag.name, tag.color]))}
                    onCopy={() => copyToClipboard(snippet.content)}
                    onFavorite={() => snippet.id && toggleLike(snippet.id, snippet.favorite || false)}
                    onDelete={snippet.userId === user?.id ? () => snippet.id && deleteSnippet(snippet.id) : undefined}
                    onEdit={snippet.userId === user?.id ? () => snippet.id && router.push(`/snippets/${snippet.id}/edit`) : undefined}
                    onLike={() => snippet.id && handleLike(snippet.id)}
                    isLiked={true}
                    isLoading={likingSnippet === snippet.id}
                    onClick={() => snippet.id && handleSnippetClick(snippet)}
                    viewMode="list"
                    showLikeButton={true}
                    showFolder={snippet.userId === user?.id}
                    showFavorite={snippet.userId === user?.id}
                    isPublicContext={snippet.userId !== user?.id}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredSnippets.length === 0 && !loading && (
              <div className="text-center py-12">
                <FiHeart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No liked snippets found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedCategory !== "all" || selectedTag !== "all" || selectedFolder !== "all" 
                    ? 'Try adjusting your search terms or filters' 
                    : 'Start liking snippets from the community or your own collection'
                  }
                </p>
                {!searchTerm && selectedCategory === "all" && selectedTag === "all" && selectedFolder === "all" && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => router.push("/public")}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl"
                    >
                      <FiGlobe className="mr-2 h-5 w-5" />
                      Browse Community
                    </Button>
                    <Button 
                      onClick={handleCreateSnippet}
                      variant="outline"
                      className="px-6 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
                    >
                      <FiPlus className="mr-2 h-5 w-5" />
                      Create Snippet
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Snippet Detail Modal */}
        <SnippetDetailModal
          open={showSnippetModal}
          onClose={closeSnippetModal}
          snippet={selectedSnippet}
          folders={folders}
          user={user}
          onEdit={selectedSnippet?.userId === user?.id ? (snippet) => snippet.id && router.push(`/snippets/${snippet.id}/edit`) : undefined}
          onDelete={selectedSnippet?.userId === user?.id ? (snippet) => snippet.id && deleteSnippet(snippet.id) : undefined}
          onLike={(snippetId) => handleLike(snippetId)}
          isLiked={true}
          showEditDelete={Boolean(user && selectedSnippet && selectedSnippet.userId === user.id)}
          showLikeButton={true}
          showFolder={selectedSnippet?.userId === user?.id}
          showFavorite={selectedSnippet?.userId === user?.id}
        />
      </AppLayout>
    </AuthGuard>
  );
} 