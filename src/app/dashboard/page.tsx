"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/layouts/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FiPlus, 
  FiFolder, 
  FiClock, 
  FiCode,
  FiCopy,
  FiEdit,
  FiTrash2,
  FiShare2,
  FiEye,
  FiDownload,
  FiX,
  FiFilter,
  FiTrendingUp,
  FiTag,
  FiZap,
  FiCalendar,
  FiBarChart,
  FiGlobe,
  FiArrowRight,
  FiFileText,
  FiSearch
} from "react-icons/fi";
import { snippetService, folderService, tagService, Snippet, Folder, Tag } from "@/lib/firebaseServices";
import { useRouter } from "next/navigation";
import SnippetCard from "@/components/SnippetCard";
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

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'recent'>('overview');
  const [showSnippetModal, setShowSnippetModal] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [likingSnippet, setLikingSnippet] = useState<string | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [viewFolder, setViewFolder] = useState<Folder | null>(null);
  const [folderSnippetSearch, setFolderSnippetSearch] = useState("");
  const [folderSnippetFilter, setFolderSnippetFilter] = useState("all");
  const { showError } = useError();
  const { showConfirm } = useConfirmDialog();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const [snippetsData, foldersData, tagsData] = await Promise.all([
        snippetService.getByUser(user.id),
        folderService.getByUser(user.id),
        tagService.getByUser(user.id)
      ]);
      
      setSnippets(snippetsData);
      setFolders(foldersData);
      setTags(tagsData);
    } catch (error) {
      console.error("Error loading data:", error);
      showError("Error loading data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnippet = () => {
    router.push("/snippets/new");
  };

  const handleCreateFolder = () => {
    router.push("/folders");
  };

  const handleSnippetClick = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setShowSnippetModal(true);
  };

  const handleFolderClick = (folderId: string) => {
    setSelectedFolder(selectedFolder === folderId ? null : folderId);
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

  const getSnippetsForFolder = (folderId: string | null) => {
    if (!folderId) return snippets;
    return snippets.filter(snippet => snippet.folderId === folderId);
  };

  const getTagColor = (tagName: string) => {
    const tag = tags.find(t => t.name === tagName);
    return tag?.color || "#6B7280";
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestampToDate(timestamp);
    return date.toLocaleDateString();
  };

  const getRecentSnippets = () => {
    return snippets
      .sort((a, b) => {
        const dateA = timestampToDate(a.updatedAt);
        const dateB = timestampToDate(b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);
  };

  const getStats = () => {
    const totalSnippets = snippets.length;
    const totalFolders = folders.length;
    const totalTags = tags.length;
    const sharedSnippets = snippets.filter(s => s.isPublic).length;
    const thisMonthSnippets = snippets.filter(s => {
      const date = timestampToDate(s.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalSnippets,
      totalFolders,
      totalTags,
      sharedSnippets,
      thisMonthSnippets
    };
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
            const isLiked = likedBy.includes(user.id);
            
            if (isLiked) {
              // Unlike
              return {
                ...snippet,
                likes: currentLikes - 1,
                likedBy: likedBy.filter(id => id !== user.id)
              };
            } else {
              // Like
              return {
                ...snippet,
                likes: currentLikes + 1,
                likedBy: [...likedBy, user.id]
              };
            }
          }
          return snippet;
        })
      );
    } catch (error) {
      console.error("Error liking/unliking snippet:", error);
      showError("Error liking/unliking snippet. Please try again later.");
    } finally {
      setLikingSnippet(null);
    }
  };

  const getFilteredFolderSnippets = (folderId: string) => {
    let filtered = snippets.filter(s => s.folderId === folderId);
    if (folderSnippetSearch) {
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(folderSnippetSearch.toLowerCase()) ||
        snippet.content.toLowerCase().includes(folderSnippetSearch.toLowerCase()) ||
        (Array.isArray(snippet.tags) && snippet.tags.some(tag => tag.toLowerCase().includes(folderSnippetSearch.toLowerCase())))
      );
    }
    if (folderSnippetFilter === "public") {
      filtered = filtered.filter(snippet => snippet.isPublic);
    } else if (folderSnippetFilter === "private") {
      filtered = filtered.filter(snippet => !snippet.isPublic);
    }
    return filtered;
  };

  const copyFolderInfo = () => {
    if (!viewFolder) return;
    const info = `Folder: ${viewFolder.name}\n${viewFolder.description ? `Description: ${viewFolder.description}\n` : ''}Snippets: ${snippets.filter(s => s.folderId === viewFolder.id).length}`;
    navigator.clipboard.writeText(info);
  };

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

  const stats = getStats();

  return (
    <AuthGuard>
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {/* Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative px-6 py-8 lg:py-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="text-white">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                      Welcome back, {user.name || user.email?.split('@')[0]} 👋
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Here's what's happening with your snippets today
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleCreateFolder} 
                      variant="outline" 
                      className="px-6 py-3 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <FiFolder className="mr-2 h-5 w-5" />
                      New Folder
                    </Button>
                    <Button 
                      onClick={handleCreateSnippet} 
                      className="px-6 py-3 rounded-xl bg-white text-blue-600 hover:bg-gray-50 shadow-lg"
                    >
                      <FiPlus className="mr-2 h-5 w-5" />
                      New Snippet
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Snippets</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalSnippets}</p>
                      <p className="text-xs text-green-600 mt-1 flex items-center">
                        <FiTrendingUp className="h-3 w-3 mr-1" />
                        +{stats.thisMonthSnippets} this month
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <FiFileText className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Folders</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalFolders}</p>
                      <p className="text-xs text-gray-500 mt-1">Organized content</p>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <FiFolder className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Shared</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.sharedSnippets}</p>
                      <p className="text-xs text-gray-500 mt-1">Public snippets</p>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                      <FiShare2 className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-white p-2 rounded-2xl shadow-lg border border-gray-200 max-w-md">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'recent'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Recent
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Quick Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900">Quick Insights</h3>
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FiTrendingUp className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <span className="text-sm text-gray-600">Most Used Category</span>
                            <span className="text-sm font-medium text-gray-900">
                              {(() => {
                                const categories = snippets.reduce((acc, snippet) => {
                                  const category = snippet.category || 'Uncategorized';
                                  acc[category] = (acc[category] || 0) + 1;
                                  return acc;
                                }, {} as Record<string, number>);
                                const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
                                return topCategory ? topCategory[0] : 'None';
                              })()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <span className="text-sm text-gray-600">Average Length</span>
                            <span className="text-sm font-medium text-gray-900">
                              {snippets.length > 0 
                                ? Math.round(snippets.reduce((sum, s) => sum + s.content.length, 0) / snippets.length)
                                : 0} chars
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <span className="text-sm text-gray-600">Public Ratio</span>
                            <span className="text-sm font-medium text-gray-900">
                              {snippets.length > 0 
                                ? Math.round((stats.sharedSnippets / snippets.length) * 100)
                                : 0}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <FiClock className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          {getRecentSnippets().slice(0, 3).map((snippet) => (
                            <div key={snippet.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => snippet.id && handleSnippetClick(snippet)}>
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <FiFileText className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{snippet.title}</h4>
                                <p className="text-xs text-gray-500">
                                  {formatDate(snippet.updatedAt)}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {snippet.isPublic && <FiGlobe className="h-3 w-3 text-green-500" />}
                              </div>
                            </div>
                          ))}
                          {snippets.length === 0 && (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-500">No recent activity</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Category Distribution</h3>
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                          <FiBarChart className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        {(() => {
                          const categories = snippets.reduce((acc, snippet) => {
                            const category = snippet.category || 'Uncategorized';
                            acc[category] = (acc[category] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);
                          
                          const sortedCategories = Object.entries(categories)
                            .sort(([,a], [,b]) => b - a)
                            .slice(0, 5);
                          
                          return sortedCategories.map(([category, count], index) => {
                            const percentage = snippets.length > 0 ? (count / snippets.length) * 100 : 0;
                            const colors = ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-red-500 to-red-600'];
                            return (
                              <div key={category} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[index % colors.length]}`}></div>
                                    <span className="font-medium text-gray-900">{category}</span>
                                  </div>
                                  <span className="text-sm text-gray-500">{count} snippets</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full bg-gradient-to-r ${colors[index % colors.length]}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                        {snippets.length === 0 && (
                          <div className="text-center py-8">
                            <FiBarChart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">No categories to display</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Productivity Metrics */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Productivity Metrics</h3>
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                          <FiCalendar className="h-4 w-4 text-orange-600" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {stats.thisMonthSnippets}
                          </div>
                          <div className="text-sm text-blue-600">This Month</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {snippets.length > 0 ? Math.round(snippets.reduce((sum, s) => sum + s.content.length, 0) / 1000) : 0}
                          </div>
                          <div className="text-sm text-green-600">Avg. KB per Snippet</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {tags.length}
                          </div>
                          <div className="text-sm text-purple-600">Total Tags</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'recent' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">Recent Snippets</h2>
                      <span className="text-sm text-gray-500">{getRecentSnippets().length} items</span>
                    </div>
                    <div className="space-y-4">
                      {getRecentSnippets().map((snippet) => (
                        <SnippetCard
                          key={snippet.id}
                          snippet={snippet}
                          folderName={folders.find(f => f.id === snippet.folderId)?.name || ""}
                          tagColors={Object.fromEntries(tags.map(tag => [tag.name, tag.color]))}
                          onCopy={() => navigator.clipboard.writeText(snippet.content)}
                          onDelete={() => snippet.id && deleteSnippet(snippet.id)}
                          onEdit={() => snippet.id && router.push(`/snippets/${snippet.id}/edit`)}
                          onClick={() => snippet.id && handleSnippetClick(snippet)}
                          onLike={() => snippet.id && handleLike(snippet.id)}
                          isLiked={snippet.likedBy?.includes(user?.id || "") || false}
                          isLoading={likingSnippet === snippet.id}
                          viewMode="list"
                          showFavorite={false}
                          showShareIcon={true}
                          isPublicContext={false}
                          showLikeButton={true}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiZap className="h-5 w-5 text-blue-500" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={handleCreateSnippet}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg"
                    >
                      <FiPlus className="mr-2 h-5 w-5" />
                      New Snippet
                    </Button>
                    <Button
                      onClick={handleCreateFolder}
                      variant="outline"
                      className="w-full py-3 rounded-xl border-gray-200 hover:bg-gray-50"
                    >
                      <FiFolder className="mr-2 h-5 w-5" />
                      New Folder
                    </Button>
                  </div>
                </div>

                {/* Top Folders */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiFolder className="h-5 w-5 text-green-500" />
                    Top Folders
                  </h3>
                  <div className="space-y-3">
                    {folders
                      .map(folder => ({
                        ...folder,
                        snippetCount: snippets.filter(s => s.folderId === folder.id).length
                      }))
                      .sort((a, b) => b.snippetCount - a.snippetCount)
                      .slice(0, 3)
                      .map((folder) => (
                        <div
                          key={folder.id}
                          className="group relative p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 cursor-pointer transition-all duration-300 border border-transparent hover:border-green-200"
                          onClick={() => {
                            setViewFolder(folder);
                            setShowFolderModal(true);
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300"
                              style={{ 
                                background: `linear-gradient(135deg, ${folder.color || '#10B981'}20, ${folder.color || '#10B981'}10)`,
                                border: `2px solid ${folder.color || '#10B981'}30`
                              }}
                            >
                              <FiFolder 
                                className="h-5 w-5" 
                                style={{ color: folder.color || '#10B981' }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                {folder.name}
                              </p>
                              <div className="flex items-center gap-4 mt-1">
                                <p className="text-sm text-gray-500">
                                  {folder.snippetCount} snippets
                                </p>
                                <div className="w-2 h-2 rounded-full bg-green-400 group-hover:bg-green-500 transition-colors"></div>
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <FiArrowRight className="h-4 w-4 text-green-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiTag className="h-5 w-5 text-purple-500" />
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags
                      .map(tag => ({
                        ...tag,
                        count: snippets.filter(s => s.tags.includes(tag.name)).length
                      }))
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 3)
                      .map((tag) => (
                        <span
                          key={tag.id}
                          className="px-3 py-1 rounded-full text-sm font-medium border"
                          style={{
                            backgroundColor: `${tag.color}10`,
                            color: tag.color,
                            borderColor: `${tag.color}30`
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    {tags.length === 0 && (
                      <div className="text-center py-4">
                        <FiTag className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No tags yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Snippet Detail Modal */}
        <SnippetDetailModal
          open={showSnippetModal}
          onClose={closeSnippetModal}
          snippet={selectedSnippet}
          folders={folders}
          user={user}
          onEdit={(snippet) => snippet.id && router.push(`/snippets/${snippet.id}/edit`)}
          onDelete={(snippet) => snippet.id && deleteSnippet(snippet.id)}
          onLike={() => selectedSnippet?.id && handleLike(selectedSnippet.id)}
          isLiked={selectedSnippet?.likedBy?.includes(user?.id || "") || false}
          showEditDelete={true}
          showLikeButton={true}
        />

        {showFolderModal && viewFolder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: `${viewFolder.color}20` }}>
                    <FiFolder className="h-7 w-7" style={{ color: viewFolder.color }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{viewFolder.name}</h2>
                    {viewFolder.description && (
                      <p className="text-sm text-gray-500 mt-1">{viewFolder.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={copyFolderInfo} variant="outline" size="sm" className="rounded-xl">
                    <FiCopy className="h-4 w-4 mr-1" />
                    Copy Info
                  </Button>
                  <Button onClick={() => setShowFolderModal(false)} variant="outline" className="rounded-xl">
                    <FiX className="h-4 w-4 mr-1" />
                    Close
                  </Button>
                </div>
              </div>
              {/* Folder Stats */}
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-6 justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><FiFileText className="h-4 w-4" /> {snippets.filter(s => s.folderId === viewFolder.id).length} snippets</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium">Updated</span>
                  <span>{formatDate(viewFolder.updatedAt)}</span>
                </div>
              </div>
              {/* Search and Filter Bar */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search snippets..."
                      value={folderSnippetSearch}
                      onChange={e => setFolderSnippetSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={folderSnippetFilter}
                    onChange={e => setFolderSnippetFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Snippets</option>
                    <option value="public">Public Only</option>
                    <option value="private">Private Only</option>
                  </select>
                </div>
              </div>
              {/* Snippet List */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)] flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Snippets ({viewFolder.id ? getFilteredFolderSnippets(viewFolder.id).length : 0})
                  </h3>
                  {viewFolder.id && getFilteredFolderSnippets(viewFolder.id).length > 0 && (
                    <Button
                      onClick={() => {
                        const content = viewFolder.id ? getFilteredFolderSnippets(viewFolder.id).map(s => `${s.title}\n${s.content}\n---`).join("\n\n") : "";
                        navigator.clipboard.writeText(content);
                      }}
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                    >
                      <FiDownload className="h-4 w-4 mr-1" />
                      Export All
                    </Button>
                  )}
                </div>
                {!viewFolder.id || getFilteredFolderSnippets(viewFolder.id).length === 0 ? (
                  <div className="text-center py-12">
                    <FiFileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {folderSnippetSearch || folderSnippetFilter !== 'all' 
                        ? 'No snippets match your search/filter criteria.' 
                        : 'No snippets in this folder.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {viewFolder.id && getFilteredFolderSnippets(viewFolder.id).map(snippet => (
                      <SnippetCard
                        key={snippet.id}
                        snippet={snippet}
                        folderName={viewFolder.name}
                        tagColors={Object.fromEntries(tags.map(tag => [tag.name, tag.color]))}
                        onCopy={() => navigator.clipboard.writeText(snippet.content)}
                        onDelete={() => snippet.id && deleteSnippet(snippet.id)}
                        onEdit={() => snippet.id && router.push(`/snippets/${snippet.id}/edit`)}
                        onClick={() => snippet.id && handleSnippetClick(snippet)}
                        onLike={() => snippet.id && handleLike(snippet.id)}
                        isLiked={snippet.likedBy?.includes(user?.id || "") || false}
                        isLoading={likingSnippet === snippet.id}
                        viewMode="list"
                        showFavorite={false}
                        showShareIcon={true}
                        isPublicContext={false}
                        showLikeButton={true}
                        size="sm"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AppLayout>
    </AuthGuard>
  );
} 