"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/layouts/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FiPlus, 
  FiFileText,
  FiSave,
  FiX,
  FiTag,
  FiFolder,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiLock,
  FiZap,
  FiArrowLeft,
  FiCheck,
  FiAlertCircle,
  FiEdit
} from "react-icons/fi";
import { snippetService, folderService, tagService, Snippet, Folder, Tag } from "@/lib/firebaseServices";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { useError } from "@/contexts/ErrorContext";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";

export default function NewSnippet() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const categoryOptions = [
    // Content Types
    "Select Category",
    "Instagram Caption",
    "Social Media Post",
    "Code Snippet",
    "Text Content",
    "Email Template",
    "Blog Post",
    "Quote",
    "Note",
    "Recipe",
    "List",
    "LinkedIn Post",
    "Twitter Post",
    "Facebook Post",
    "TikTok Caption",
    "YouTube Description",
    "Product Description",
    "Bio",
    "Resume",
    "Cover Letter",
    "Meeting Notes",
    "Shopping List",
    "To-Do List",
    "Bucket List",
    "Goals",
    "Ideas",
    "Jokes",
    "Poems",
    "Stories",
    "Reviews",
    "Tutorial",
    "Script",
    "Presentation",
    "Proposal",
    "Contract",
    "Terms & Conditions",
    "Privacy Policy",
    "FAQ",
    "Instructions",
    "Manual",
    "Guide",
    // Tones/Styles
    "Motivational",
    "Inspirational",
    "Educational",
    "Entertainment",
    "Business",
    "Personal",
    "Professional",
    "Creative",
    "Technical",
    "Other"
  ];
  const [category, setCategory] = useState(categoryOptions[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
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
      const [foldersData, allTags] = await Promise.all([
        folderService.getByUser(user.id),
        tagService.getByUser(user.id)
      ]);
      
      setFolders(foldersData);
      setTags(allTags);
      
      // Use user tags for availableTags
      const uniqueTags = allTags
        .map(tag => tag.name.startsWith('#') ? tag.name : `#${tag.name}`)
        .sort((a, b) => a.localeCompare(b));
      setAvailableTags(uniqueTags);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const tagWithHash = newTag.trim().startsWith('#') ? newTag.trim() : `#${newTag.trim()}`;
      setSelectedTags([...selectedTags, tagWithHash]);
      setNewTag("");
      setShowNewTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddFolder = async () => {
    if (!user?.id || !newFolder.trim()) return;
    try {
      const folderId = await folderService.create({
        name: newFolder.trim(),
        userId: user.id
      });
      setFolders([...folders, { id: folderId, name: newFolder.trim(), userId: user.id }]);
      setSelectedFolder(folderId);
      setNewFolder("");
      setShowNewFolderInput(false);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !title.trim() || !content.trim() || !selectedFolder) {
      if (!title.trim() || !content.trim() || !selectedFolder) {
        alert("Please fill in the title, content, and select a folder");
        return;
      }
      return;
    }

    try {
      setSaving(true);
      // 1. Find which selectedTags are not in tags collection
      const existingTagNames = tags.map(t => t.name.startsWith('#') ? t.name : `#${t.name}`.trim().toLowerCase());
      const newTagsToCreate = selectedTags.filter(tag =>
        !existingTagNames.includes(tag.trim().toLowerCase())
      );
      // 2. Create missing tags in tags collection
      for (const tag of newTagsToCreate) {
        await tagService.create({
          name: tag.startsWith('#') ? tag.slice(1) : tag, // store without #
          color: "#3B82F6", // default color, or you can let user pick
          userId: user.id
        });
      }
      // 3. Save the snippet
      const snippetData: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'> = {
        title: title.trim(),
        content: content.trim(),
        category: category,
        tags: selectedTags.length > 0 ? selectedTags : [],
        folderId: selectedFolder,
        isPublic,
        userId: user.id,
      };

      await snippetService.create(snippetData);
      
      // Reset form and stay on the same page
      setTitle("");
      setContent("");
      setCategory(categoryOptions[0]);
      setSelectedTags([]);
      setSelectedFolder("");
      setIsPublic(false);
      setNewTag("");
      setTagSearch("");
      
      // Show success dialog
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error creating snippet:", error);
      alert("Failed to create snippet. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getWordCount = () => {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getLineCount = () => {
    return content.split('\n').length;
  };

  const getFilteredAvailableTags = () => {
    if (!tagSearch.trim()) return availableTags;
    return availableTags.filter(tag => 
      tag.toLowerCase().includes(tagSearch.toLowerCase())
    );
  };

  return (
    <AuthGuard>
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
                        onClick={() => router.push("/snippets")}
                        variant="ghost"
                        className="text-white hover:bg-white/10 p-2 rounded-xl"
                      >
                        <FiArrowLeft className="h-5 w-5" />
                      </Button>
                      <h1 className="text-3xl lg:text-4xl font-bold">
                        Create New Snippet
                      </h1>
                    </div>
                    <p className="text-indigo-100 text-lg">
                      Add a new snippet to your library
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => router.push("/snippets")}
                      variant="outline"
                      className="px-6 py-3 rounded-xl bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={saving || !title.trim() || !content.trim() || !selectedFolder}
                      className="px-6 py-3 rounded-xl bg-white text-indigo-600 hover:bg-gray-50 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2 h-5 w-5" />
                          Save Snippet
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
                      <FiFileText className="h-5 w-5 text-indigo-600" />
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
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        {categoryOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Code Content */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FiEdit className="h-5 w-5 text-indigo-600" />
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
                        Folder <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedFolder}
                        onChange={(e) => setSelectedFolder(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          !selectedFolder ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select a folder</option>
                        {folders.map(folder => (
                          <option key={folder.id} value={folder.id}>{folder.name}</option>
                        ))}
                      </select>
                      {showNewFolderInput ? (
                        <div className="flex gap-2 mt-2">
                          <Input
                            type="text"
                            placeholder="New folder name..."
                            value={newFolder}
                            onChange={(e) => setNewFolder(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
                            className="flex-1 px-3 py-2 rounded-lg border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <Button
                            onClick={handleAddFolder}
                            size="sm"
                            className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            <FiCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              setShowNewFolderInput(false);
                              setNewFolder("");
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
                          onClick={() => setShowNewFolderInput(true)}
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 px-3 py-2 rounded-lg border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          <FiPlus className="h-4 w-4 mr-2" />
                          Add Folder
                        </Button>
                      )}
                    </div>

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
                                onClick={() => handleRemoveTag(tag)}
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
                              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                              className="flex-1 px-3 py-2 rounded-lg border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <Button
                              onClick={handleAddTag}
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
                          <FiEye className="h-5 w-5 text-white" />
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
                      disabled={saving || !title.trim() || !content.trim() || !selectedFolder}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2 h-5 w-5" />
                          Save Snippet
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => router.push("/snippets")}
                      variant="outline"
                      className="w-full py-3 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Success Dialog */}
        {showSuccessDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
              {/* Success Icon */}
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <FiCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Snippet Saved Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your snippet has been added to your library and is ready to use.
                </p>
                <Button
                  onClick={() => setShowSuccessDialog(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg"
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        )}
      </AppLayout>
    </AuthGuard>
  );
} 