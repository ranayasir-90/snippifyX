"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FiSave, 
  FiX, 
  FiCode, 
  FiFolder, 
  FiTag, 
  FiEye, 
  FiEyeOff,
  FiArrowLeft,
  FiTrash2,
  FiCheck,
  FiAlertCircle,
  FiZap,
  FiGlobe,
  FiLock,
  FiClock,
  FiBarChart,
  FiPlus
} from "react-icons/fi";
import { snippetService, folderService, tagService, Snippet, Folder, Tag } from "@/lib/firebaseServices";
import { Timestamp } from "firebase/firestore";
import { useError } from "@/contexts/ErrorContext";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";

export default function EditSnippet() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const snippetId = params.id as string;

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [folderId, setFolderId] = useState<string | undefined>(undefined);
  const [isPublic, setIsPublic] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { showError } = useError();
  const { showConfirm } = useConfirmDialog();

  useEffect(() => {
    if (user && snippetId) {
      loadData();
    }
  }, [user, snippetId]);

  const loadData = async () => {
    if (!user?.id || !snippetId) return;
    
    try {
      setLoading(true);
      const [snippetData, foldersData, allTags] = await Promise.all([
        snippetService.getById(snippetId),
        folderService.getByUser(user.id),
        tagService.getByUser(user.id)
      ]);
      
      if (snippetData && snippetData.userId === user.id) {
        setSnippet(snippetData);
        setTitle(snippetData.title);
        setContent(snippetData.content);
        setCategory(snippetData.category || "");
        setFolderId(snippetData.folderId);
        setIsPublic(snippetData.isPublic || false);
        setSelectedTags(snippetData.tags || []);
      } else {
        router.push("/snippets");
        return;
      }
      
      setFolders(foldersData);
      setTags(allTags);
      
      // Use user tags for availableTags
      const uniqueTags = allTags
        .map(tag => tag.name.startsWith('#') ? tag.name : `#${tag.name}`)
        .sort((a, b) => a.localeCompare(b));
      setAvailableTags(uniqueTags);
    } catch (error) {
      console.error("Error loading data:", error);
      router.push("/snippets");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !snippetId || !title.trim()) return;
    
    try {
      setSaving(true);
      await snippetService.update(snippetId, {
        title: title.trim(),
        content: content.trim(),
        category: category.trim() || undefined,
        folderId: folderId || undefined,
        isPublic,
        tags: selectedTags.filter(tag => tag.trim()),
        updatedAt: Timestamp.now()
      });
      
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      
      setTimeout(() => {
        router.push("/snippets");
      }, 1000);
    } catch (error) {
      console.error("Error updating snippet:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id || !snippetId) return;
    
    try {
      setDeleting(true);
      await snippetService.delete(snippetId);
      router.push("/snippets");
    } catch (error) {
      console.error("Error deleting snippet:", error);
      showError("Failed to delete snippet");
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = () => {
    showConfirm({ 
      message: 'Are you sure you want to delete this snippet? This action cannot be undone.', 
      onConfirm: handleDelete,
      confirmText: "Delete",
      cancelText: "Cancel"
    });
  };

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const tagWithHash = newTag.trim().startsWith('#') ? newTag.trim() : `#${newTag.trim()}`;
      setSelectedTags([...selectedTags, tagWithHash]);
      setNewTag("");
      setShowNewTagInput(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const getFilteredAvailableTags = () => {
    if (!tagSearch.trim()) return availableTags;
    return availableTags.filter(tag => 
      tag.toLowerCase().includes(tagSearch.toLowerCase())
    );
  };

  // Track changes
  useEffect(() => {
    if (snippet) {
      const hasChanges = 
        title !== snippet.title ||
        content !== snippet.content ||
        category !== (snippet.category || "") ||
        folderId !== snippet.folderId ||
        isPublic !== (snippet.isPublic || false) ||
        JSON.stringify(selectedTags) !== JSON.stringify(snippet.tags || []);
      
      setHasUnsavedChanges(hasChanges);
    }
  }, [title, content, category, folderId, isPublic, selectedTags, snippet]);

  const getWordCount = () => {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getLineCount = () => {
    return content.split('\n').length;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to edit snippets.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-6 py-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Button
                      onClick={() => {
                        if (hasUnsavedChanges) {
                          showConfirm({ message: 'You have unsaved changes. Are you sure you want to leave?', onConfirm: () => router.back() });
                        } else {
                          router.back();
                        }
                      }}
                      variant="ghost"
                      className="text-white hover:bg-white/10 p-2 rounded-xl"
                    >
                      <FiArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl lg:text-4xl font-bold">
                      Edit Snippet
                    </h1>
                  </div>
                  <p className="text-indigo-100 text-lg">
                    Update your code snippet
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    {hasUnsavedChanges && (
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 backdrop-blur-sm text-orange-200 text-sm">
                        <FiAlertCircle className="h-4 w-4" />
                        Unsaved changes
                      </span>
                    )}
                    {lastSaved && !hasUnsavedChanges && (
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-sm text-green-200 text-sm">
                        <FiCheck className="h-4 w-4" />
                        Saved {lastSaved.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={confirmDelete}
                    variant="outline"
                    className="px-6 py-3 rounded-xl bg-white/10 text-white border-white/20 hover:bg-white/20"
                    disabled={deleting}
                  >
                    <FiTrash2 className="mr-2 h-5 w-5" />
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={saving || !title.trim() || !hasUnsavedChanges}
                    className="px-6 py-3 rounded-xl bg-white text-indigo-600 hover:bg-gray-50 shadow-lg"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2 h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiCode className="h-5 w-5 text-indigo-600" />
                    Basic Information
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter snippet title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      maxLength={100}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {title.length}/100 characters
                      </span>
                      {!title.trim() && (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                          <FiAlertCircle className="h-3 w-3" />
                          Title is required
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., React, Node.js, CSS..."
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        maxLength={50}
                      />
                      <span className="text-xs text-gray-500 mt-1">
                        {category.length}/50 characters
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Folder
                      </label>
                      <select
                        value={folderId || ""}
                        onChange={(e) => setFolderId(e.target.value || undefined)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">No folder</option>
                        {folders.map(folder => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Content */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiZap className="h-5 w-5 text-indigo-600" />
                    Content *
                  </h2>
                </div>
                <div className="p-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Code
                    </label>
                    <div className="relative">
                      <textarea
                        placeholder="Paste your code here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={15}
                        className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
                      />
                      <div className="absolute bottom-3 right-3 bg-gray-100 rounded-lg px-3 py-1 text-xs text-gray-600 shadow-sm">
                        {content.length} chars • {getWordCount()} words • {getLineCount()} lines
                      </div>
                    </div>
                    {!content.trim() && (
                      <span className="text-xs text-red-500 flex items-center gap-1 mt-2">
                        <FiAlertCircle className="h-3 w-3" />
                        Content is required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Organization */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiFolder className="h-5 w-5 text-indigo-600" />
                    Organization
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 border border-indigo-200"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-indigo-600"
                            >
                              <FiX className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      
                      {showNewTagInput ? (
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="New tag..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                            className="flex-1 px-3 py-2 rounded-lg border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <Button
                            onClick={addTag}
                            size="sm"
                            className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            <FiCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              setShowNewTagInput(false);
                              setNewTag("");
                            }}
                            variant="outline"
                            size="sm"
                            className="px-3 py-2 rounded-lg border-gray-200"
                          >
                            <FiX className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setShowNewTagInput(true)}
                          variant="outline"
                          size="sm"
                          className="w-full px-3 py-2 rounded-lg border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          <FiPlus className="h-4 w-4 mr-2" />
                          Add Tag
                        </Button>
                      )}

                      {availableTags.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-2">
                            Available tags from all snippets ({availableTags.length} total):
                          </p>
                          
                          {/* Search Input */}
                          <div className="mb-2">
                            <Input
                              type="text"
                              placeholder="Search tags..."
                              value={tagSearch}
                              onChange={(e) => setTagSearch(e.target.value)}
                              className="px-3 py-2 rounded-lg border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            />
                          </div>
                          
                          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                            {getFilteredAvailableTags().map((tag) => (
                              <button
                                key={tag}
                                onClick={() => {
                                  if (!selectedTags.includes(tag)) {
                                    setSelectedTags([...selectedTags, tag]);
                                  }
                                }}
                                disabled={selectedTags.includes(tag)}
                                className={`px-2 py-1 rounded text-xs border transition-colors ${
                                  selectedTags.includes(tag)
                                    ? 'bg-indigo-100 text-indigo-600 border-indigo-200 cursor-not-allowed'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                          {getFilteredAvailableTags().length === 0 && tagSearch.trim() && (
                            <p className="text-xs text-gray-400 mt-1">
                              No tags found matching "{tagSearch}"
                            </p>
                          )}
                          {availableTags.length > 20 && !tagSearch.trim() && (
                            <p className="text-xs text-gray-400 mt-1">
                              Scroll to see more tags
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiZap className="h-5 w-5 text-indigo-600" />
                    Settings
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                        <FiGlobe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Public Snippet</p>
                        <p className="text-xs text-gray-500">Make this snippet visible to others</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPublic(!isPublic)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isPublic ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isPublic ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiSave className="h-5 w-5 text-indigo-600" />
                    Actions
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  <Button
                    onClick={handleSave}
                    disabled={saving || !title.trim() || !hasUnsavedChanges}
                    className="w-full py-3 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2 h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => {
                      if (hasUnsavedChanges) {
                        showConfirm({ message: 'You have unsaved changes. Are you sure you want to leave?', onConfirm: () => router.back() });
                      } else {
                        router.back();
                      }
                    }}
                    variant="outline"
                    className="w-full py-3 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    onClick={confirmDelete}
                    variant="outline"
                    className="w-full py-3 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                    disabled={deleting}
                  >
                    <FiTrash2 className="mr-2 h-5 w-5" />
                    {deleting ? "Deleting..." : "Delete Snippet"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 