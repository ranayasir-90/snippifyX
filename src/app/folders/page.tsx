"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FiPlus, 
  FiFolder, 
  FiEdit, 
  FiTrash2, 
  FiMoreVertical,
  FiCode,
  FiClock,
  FiArrowRight,
  FiEye,
  FiCopy,
  FiHeart,
  FiX,
  FiSearch,
  FiFilter,
  FiShare2,
  FiDownload,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { folderService, snippetService, Folder, Snippet } from "@/lib/firebaseServices";
import { useRouter } from "next/navigation";
import SnippetDetailModal from "@/components/SnippetDetailModal";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { useError } from "@/contexts/ErrorContext";

export default function Folders() {
  const { user } = useAuth();
  const router = useRouter();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editColor, setEditColor] = useState("#3B82F6");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#3B82F6");
  const [viewFolder, setViewFolder] = useState<Folder | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showSnippetModal, setShowSnippetModal] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [snippetSearch, setSnippetSearch] = useState('');
  const [snippetFilter, setSnippetFilter] = useState('all'); // all, public, private
  const [showFolderDeleteDialog, setShowFolderDeleteDialog] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [showSnippetDeleteDialog, setShowSnippetDeleteDialog] = useState(false);
  const [snippetToDelete, setSnippetToDelete] = useState<Snippet | null>(null);
  const { showConfirm } = useConfirmDialog();
  const { showError } = useError();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const [foldersData, snippetsData] = await Promise.all([
        folderService.getByUser(user.id),
        snippetService.getByUser(user.id)
      ]);
      
      setFolders(foldersData);
      setSnippets(snippetsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!user?.id || !newFolderName.trim()) return;
    
    try {
      await folderService.create({
        name: newFolderName.trim(),
        description: newFolderDescription.trim(),
        userId: user.id,
        color: newFolderColor,
      });
      
      setNewFolderName("");
      setNewFolderDescription("");
      setNewFolderColor("#3B82F6");
      setShowCreateForm(false);
      await loadData();
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleUpdateFolder = async (folderId: string) => {
    if (!editName.trim()) return;
    
    try {
      await folderService.update(folderId, {
        name: editName.trim(),
        description: editDescription.trim(),
        color: editColor,
      });
      
      setEditingFolder(null);
      setEditName("");
      setEditDescription("");
      setEditColor("#3B82F6");
      await loadData();
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    const snippetCount = getSnippetCount(folderId);
    
    if (snippetCount > 0) {
      const folder = folders.find(f => f.id === folderId);
      setFolderToDelete(folder || null);
      setShowFolderDeleteDialog(true);
      return;
    }
    
    showConfirm({ 
      message: 'Are you sure you want to delete this empty folder?', 
      onConfirm: async () => {
        try {
          await folderService.delete(folderId);
          await loadData();
        } catch (error) {
          console.error("Error deleting folder:", error);
          showError("Error deleting folder. Please try again later.");
        }
      },
      confirmText: "Delete",
      cancelText: "Cancel"
    });
  };

  const getSnippetCount = (folderId: string) => {
    return snippets.filter(s => s.folderId === folderId).length;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const colorOptions = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"
  ];

  const getSnippetsForFolder = (folderId: string) => {
    return snippets.filter(s => s.folderId === folderId);
  };

  const handleDeleteSnippet = async (snippetId: string) => {
    const snippet = snippets.find(s => s.id === snippetId);
    if (snippet) {
      setSnippetToDelete(snippet);
      setShowSnippetDeleteDialog(true);
    }
  };

  const confirmDeleteSnippet = async () => {
    if (!snippetToDelete) return;
    
    try {
      await snippetService.delete(snippetToDelete.id!);
      // Close the modal if it's open
      if (showSnippetModal) {
        setShowSnippetModal(false);
        setSelectedSnippet(null);
      }
      // Refresh the data
      await loadData();
      // Close the dialog
      setShowSnippetDeleteDialog(false);
      setSnippetToDelete(null);
    } catch (error) {
      console.error('Error deleting snippet:', error);
      showError("Error deleting snippet. Please try again later.");
    }
  };

  const copyFolderInfo = () => {
    if (!viewFolder) return;
    const info = `Folder: ${viewFolder.name}\n${viewFolder.description ? `Description: ${viewFolder.description}\n` : ''}Snippets: ${getSnippetCount(viewFolder.id!)}`;
    navigator.clipboard.writeText(info);
  };

  const getFilteredSnippets = (folderId: string) => {
    let filtered = getSnippetsForFolder(folderId);
    
    // Apply search filter
    if (snippetSearch) {
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(snippetSearch.toLowerCase()) ||
        snippet.content.toLowerCase().includes(snippetSearch.toLowerCase()) ||
        (Array.isArray(snippet.tags) && snippet.tags.some(tag => tag.toLowerCase().includes(snippetSearch.toLowerCase())))
      );
    }
    
    // Apply visibility filter
    if (snippetFilter === 'public') {
      filtered = filtered.filter(snippet => snippet.isPublic);
    } else if (snippetFilter === 'private') {
      filtered = filtered.filter(snippet => !snippet.isPublic);
    }
    
    return filtered;
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
                  Folders
                </h1>
                <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                  Organize your code snippets into beautiful, structured folders. Keep your content organized and easily accessible.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Folders
                </h2>
                <p className="text-gray-600 mt-1">
                  Organize and manage your code snippets efficiently
                </p>
              </div>
              <Button 
                onClick={() => setShowCreateForm(true)} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Folders</p>
                    <p className="text-3xl font-bold text-blue-900">{folders.length}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Organized collections
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiFolder className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Snippets</p>
                    <p className="text-3xl font-bold text-green-900">{snippets.length}</p>
                    <p className="text-xs text-green-600 mt-1">
                      Organized content
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiFileText className="h-7 w-7 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Organized</p>
                    <p className="text-3xl font-bold text-purple-900">{snippets.filter(s => s.folderId).length}</p>
                    <p className="text-xs text-purple-600 mt-1">
                      In folders
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiCheckCircle className="h-7 w-7 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Unorganized</p>
                    <p className="text-3xl font-bold text-orange-900">{snippets.filter(s => !s.folderId).length}</p>
                    <p className="text-xs text-orange-600 mt-1">
                      Need organization
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiAlertCircle className="h-7 w-7 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Create Folder Form */}
            {showCreateForm && (
              <div className="relative bg-white rounded-2xl border border-gray-200/60 shadow-xl overflow-hidden backdrop-blur-sm">
                {/* Gradient Background */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 bg-gradient-to-br from-blue-400 to-purple-600"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-12 -translate-x-12 bg-gradient-to-br from-green-400 to-blue-600"></div>
                </div>
                
                {/* Header */}
                <div className="relative z-10 px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <FiFolder className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Create New Folder</h3>
                      <p className="text-xs text-gray-600">Organize your snippets with a new folder</p>
                    </div>
                  </div>
                </div>
                
                {/* Form Content */}
                <div className="relative z-10 p-6 space-y-4">
                  {/* Name Field */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">
                      Folder Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter a descriptive name for your folder"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  {/* Description Field */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">
                      Description <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <Input
                      value={newFolderDescription}
                      onChange={(e) => setNewFolderDescription(e.target.value)}
                      placeholder="Brief description of what this folder contains"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  {/* Color Picker */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Folder Color
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewFolderColor(color)}
                          className={`relative w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                            newFolderColor === color 
                              ? 'border-gray-900 shadow-lg scale-110' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color }}
                        >
                          {newFolderColor === color && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Choose a color to help you identify this folder quickly
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3">
                    <Button 
                      onClick={handleCreateFolder} 
                      disabled={!newFolderName.trim()} 
                      className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlus className="mr-2 h-4 w-4" />
                      Create Folder
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewFolderName("");
                        setNewFolderDescription("");
                        setNewFolderColor("#3B82F6");
                      }}
                      className="px-4 py-2.5 rounded-lg border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Folders Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading folders...</p>
                </div>
              </div>
            ) : folders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <FiFolder className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No folders yet
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Create your first folder to organize your snippets and keep your content structured.
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)} 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FiPlus className="mr-2 h-6 w-6" />
                  Create Your First Folder
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="group relative bg-white rounded-2xl border border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer backdrop-blur-sm"
                    onClick={() => {
                      if (editingFolder !== folder.id) {
                        setViewFolder(folder);
                        setShowFolderModal(true);
                      }
                    }}
                  >
                    {/* Professional Gradient Background */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700"
                      style={{ 
                        background: `linear-gradient(135deg, ${folder.color}08, ${folder.color}15, ${folder.color}08)`
                      }}
                    />
                    
                    {/* Subtle Pattern Overlay */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-12 translate-x-12"
                           style={{ backgroundColor: folder.color }}></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full translate-y-8 -translate-x-8"
                           style={{ backgroundColor: folder.color }}></div>
                    </div>
                    
                    {/* Top Action Buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setEditingFolder(folder.id!);
                          setEditName(folder.name);
                          setEditDescription(folder.description || "");
                          setEditColor(folder.color || "#3B82F6");
                        }}
                        className="p-2 rounded-lg bg-white/90 backdrop-blur-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-lg border border-gray-200/50"
                      >
                        <FiEdit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDeleteFolder(folder.id!);
                        }}
                        className="p-2 rounded-lg bg-white/90 backdrop-blur-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-lg border border-gray-200/50"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {editingFolder === folder.id ? (
                      <div className="p-5 space-y-4 relative z-10" onClick={(e) => e.stopPropagation()}>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">Name</label>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="input-focus rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">Color</label>
                          <div className="grid grid-cols-8 gap-2">
                            {colorOptions.map((color) => (
                              <button
                                key={color}
                                onClick={() => setEditColor(color)}
                                className={`relative w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                                  editColor === color 
                                    ? 'border-gray-900 shadow-lg scale-110' 
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                                style={{ backgroundColor: color }}
                              >
                                {editColor === color && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateFolder(folder.id!);
                            }} 
                            disabled={!editName.trim()}
                            size="sm"
                            className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                          >
                            Save Changes
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFolder(null);
                              setEditName("");
                              setEditDescription("");
                              setEditColor("#3B82F6");
                            }}
                            size="sm"
                            className="rounded-xl"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 relative z-10">
                        {/* Header Section */}
                        <div className="flex items-start gap-4 mb-5">
                          <div 
                            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500"
                            style={{ 
                              background: `linear-gradient(135deg, ${folder.color}20, ${folder.color}10)`,
                              border: `2px solid ${folder.color}30`,
                              boxShadow: `0 6px 20px ${folder.color}20`
                            }}
                          >
                            <FiFolder 
                              className="h-7 w-7" 
                              style={{ color: folder.color }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {folder.name}
                            </h3>
                            {folder.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {folder.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Stats Section */}
                        <div className="space-y-4">
                          {/* Primary Stats Card */}
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                {getSnippetCount(folder.id!)}
                              </div>
                              <div className="text-xs text-gray-600 font-medium">
                                Snippets
                              </div>
                            </div>
                          </div>

                          {/* Footer Info */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                              <span className="font-medium">Updated</span>
                              <span>{formatDate(folder.updatedAt)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                              <span>View</span>
                              <FiArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Folder Detail Modal */}
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
                  <span className="flex items-center gap-1"><FiCode className="h-4 w-4" /> {getSnippetCount(viewFolder.id!)} snippets</span>
                </div>
              </div>

              {/* Search and Filter Bar */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search snippets..."
                      value={snippetSearch}
                      onChange={(e) => setSnippetSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={snippetFilter}
                    onChange={(e) => setSnippetFilter(e.target.value)}
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
                    Snippets ({getFilteredSnippets(viewFolder.id!).length})
                  </h3>
                  {getFilteredSnippets(viewFolder.id!).length > 0 && (
                    <Button
                      onClick={() => {
                        const content = getFilteredSnippets(viewFolder.id!).map(s => 
                          `${s.title}\n${s.content}\n---`
                        ).join('\n\n');
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

                {getFilteredSnippets(viewFolder.id!).length === 0 ? (
                  <div className="text-center py-12">
                    <FiCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {snippetSearch || snippetFilter !== 'all' 
                        ? 'No snippets match your search/filter criteria.' 
                        : 'No snippets in this folder.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getFilteredSnippets(viewFolder.id!).map(snippet => (
                      <div key={snippet.id} className="p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900 text-lg truncate">{snippet.title}</h4>
                              {snippet.isPublic && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 flex items-center gap-1">
                                  <FiShare2 className="h-3 w-3" />
                                  Public
                                </span>
                              )}
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100">
                                {snippet.category || 'General'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3 truncate">
                              {snippet.content.length > 150 ? snippet.content.slice(0, 150) + '...' : snippet.content}
                            </p>
                            {snippet.tags && snippet.tags.length > 0 && (
                              <div className="flex gap-2 mb-3 flex-wrap">
                                {snippet.tags.slice(0, 3).map((tag, idx) => (
                                  <span key={idx} className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    {tag}
                                  </span>
                                ))}
                                {snippet.tags.length > 3 && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                                    +{snippet.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-0 opacity-100 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              title="View details" 
                              onClick={() => { setSelectedSnippet(snippet); setShowSnippetModal(true); }}
                              className="rounded-lg"
                            >
                              <FiEye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              title="Edit" 
                              onClick={() => router.push(`/snippets/${snippet.id}/edit`)}
                              className="rounded-lg"
                            >
                              <FiEdit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              title="Delete" 
                              onClick={() => handleDeleteSnippet(snippet.id!)}
                              className="rounded-lg text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <FiTrash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{snippet.content.length} chars</span>
                          <span>{snippet.content.split(/\s+/).filter(w => w.length > 0).length} words</span>
                          <span>{formatDate(snippet.updatedAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Snippet Detail Modal */}
        <SnippetDetailModal
          open={showSnippetModal}
          onClose={() => { setShowSnippetModal(false); setSelectedSnippet(null); }}
          snippet={selectedSnippet && selectedSnippet.id ? { ...selectedSnippet, id: selectedSnippet.id || '' } : null}
          folders={folders.filter(f => f.id).map(f => ({ ...f, id: f.id || '' }))}
          user={user}
          onEdit={(snippet) => snippet.id && router.push(`/snippets/${snippet.id}/edit`)}
          onDelete={(snippet) => snippet.id && handleDeleteSnippet(snippet.id)}
          showEditDelete={true}
        />
      </div>

      {/* Custom Folder Delete Dialog */}
      {showFolderDeleteDialog && folderToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            {/* Warning Icon */}
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <FiAlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Cannot Delete Folder
              </h3>
              <p className="text-gray-600 mb-4">
                The folder <span className="font-semibold text-gray-900">"{folderToDelete.name}"</span> contains {getSnippetCount(folderToDelete.id!)} snippet{getSnippetCount(folderToDelete.id!) > 1 ? 's' : ''}.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Please move or delete all snippets from this folder before deleting it.
              </p>
              <Button
                onClick={() => {
                  setShowFolderDeleteDialog(false);
                  setFolderToDelete(null);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Snippet Delete Dialog */}
      {showSnippetDeleteDialog && snippetToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            {/* Warning Icon */}
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <FiTrash2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Snippet
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{snippetToDelete.title}"</span>?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone. The snippet will be permanently removed from your library.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowSnippetDeleteDialog(false);
                    setSnippetToDelete(null);
                  }}
                  variant="outline"
                  className="flex-1 py-3 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteSnippet}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold shadow-lg"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
} 