"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FiPlus, 
  FiTag, 
  FiEdit, 
  FiTrash2, 
  FiCode,
  FiClock,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { tagService, snippetService, Tag, Snippet } from "@/lib/firebaseServices";
import { useError } from "@/contexts/ErrorContext";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";

export default function Tags() {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3B82F6");
  const [searchTerm, setSearchTerm] = useState("");
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
      const [tagsData, snippetsData] = await Promise.all([
        tagService.getByUser(user.id),
        snippetService.getByUser(user.id)
      ]);
      
      setTags(tagsData);
      setSnippets(snippetsData);
    } catch (error) {
      console.error("Error loading data:", error);
      showError("Error loading data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!user?.id || !newTagName.trim()) return;
    
    try {
      await tagService.create({
        name: newTagName.trim(),
        color: newTagColor,
        userId: user.id,
      });
      
      setNewTagName("");
      setNewTagColor("#3B82F6");
      setShowCreateForm(false);
      await loadData();
    } catch (error) {
      console.error("Error creating tag:", error);
      showError("Error creating tag. Please try again later.");
    }
  };

  const handleUpdateTag = async (tagId: string) => {
    if (!editName.trim()) return;
    
    try {
      await tagService.update(tagId, {
        name: editName.trim(),
        color: editColor,
      });
      
      setEditingTag(null);
      setEditName("");
      setEditColor("");
      await loadData();
    } catch (error) {
      console.error("Error updating tag:", error);
      showError("Error updating tag. Please try again later.");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return;
    
    showConfirm({
      message: `Are you sure you want to delete the tag "${tag.name}"? This will remove it from all snippets.`,
      onConfirm: async () => {
        try {
          // Remove tag from all snippets
          const snippetsWithTag = snippets.filter(s => s.tags.includes(tag.name));
          for (const snippet of snippetsWithTag) {
            const updatedTags = snippet.tags.filter(t => t !== tag.name);
            await snippetService.update(snippet.id!, { tags: updatedTags });
          }
          await tagService.delete(tagId);
          await loadData();
        } catch (error) {
          console.error("Error deleting tag:", error);
          showError("Error deleting tag. Please try again later.");
        }
      }
    });
  };

  // Helper to normalize tag names (remove # and trim)
  const normalizeTag = (tag: string) => tag.replace(/^#/, '').trim().toLowerCase();

  // Get all tag names (normalized)
  const allTagNames = tags.map(t => normalizeTag(t.name));

  // Get all snippet tags (flattened and normalized)
  const allSnippetTags = snippets.flatMap(s => s.tags.map(normalizeTag));

  // Stats
  const totalTags = tags.length;
  const taggedSnippets = snippets.filter(s => s.tags.length > 0).length;
  const coverage = Math.round(taggedSnippets / Math.max(snippets.length, 1) * 100);
  const untaggedSnippets = snippets.filter(s => s.tags.length === 0).length;

  // For each tag, count how many snippets use it (normalized)
  const getSnippetCount = (tagName: string) => {
    const norm = normalizeTag(tagName);
    return snippets.filter(s => s.tags.map(normalizeTag).includes(norm)).length;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const colorOptions = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#06B6D4", "#84CC16", "#F97316",
    "#EC4899", "#14B8A6", "#F43F5E", "#8B5A2B"
  ];

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  Tags
                </h1>
                <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                  Organize and categorize your code snippets with smart tags. Find what you need instantly with powerful tagging system.
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
                  Your Tags
                </h2>
                <p className="text-gray-600 mt-1">
                  Organize and manage your snippets with smart categorization
                </p>
              </div>
              <Button 
                onClick={() => setShowCreateForm(true)} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                New Tag
              </Button>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Tags */}
              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Tags</p>
                    <p className="text-3xl font-bold text-blue-900">{totalTags}</p>
                    <p className="text-xs text-blue-600 mt-1">Categories created</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiTag className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Tagged Snippets */}
              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Tagged Snippets</p>
                    <p className="text-3xl font-bold text-green-900">{taggedSnippets}</p>
                    <p className="text-xs text-green-600 mt-1">Organized content</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiCheckCircle className="h-7 w-7 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Coverage */}
              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Coverage</p>
                    <p className="text-3xl font-bold text-purple-900">{coverage}%</p>
                    <p className="text-xs text-purple-600 mt-1">Snippets tagged</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiTag className="h-7 w-7 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Untagged */}
              <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Untagged</p>
                    <p className="text-3xl font-bold text-orange-900">{untaggedSnippets}</p>
                    <p className="text-xs text-orange-600 mt-1">Need organization</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiTag className="h-7 w-7 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Create Tag Form */}
            {showCreateForm && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Create New Tag</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Name</label>
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewTagColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            newTagColor === color ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateTag} disabled={!newTagName.trim()} className="rounded-xl">
                      Create Tag
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewTagName("");
                        setNewTagColor("#3B82F6");
                      }}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tags Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading tags...</p>
                </div>
              </div>
            ) : filteredTags.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <FiTag className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {searchTerm ? "No tags found" : "No tags yet"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm ? "Try adjusting your search terms to find what you're looking for." : "Create your first tag to organize your snippets and make them easier to find."}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowCreateForm(true)} 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FiPlus className="mr-2 h-6 w-6" />
                    Create Your First Tag
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTags.map((tag, idx) => {
                  // Pick a color for the background blob based on index for variety
                  const bgBlob = [
                    'bg-blue-200',
                    'bg-green-200',
                    'bg-purple-200',
                    'bg-orange-200',
                  ][idx % 4];
                  return (
                    <div
                      key={tag.id}
                      className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                    >
                      {/* Animated/gradient background blob */}
                      <div className={`absolute top-0 right-0 w-32 h-32 ${bgBlob} rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                      {editingTag === tag.id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Name</label>
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Color</label>
                            <div className="flex gap-2 flex-wrap">
                              {colorOptions.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => setEditColor(color)}
                                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                                    editColor === color ? 'border-gray-900' : 'border-gray-300'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleUpdateTag(tag.id!)} 
                              disabled={!editName.trim()}
                              size="sm"
                              className="rounded-xl"
                            >
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setEditingTag(null);
                                setEditName("");
                                setEditColor("");
                              }}
                              size="sm"
                              className="rounded-xl"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 group-hover:scale-110 transition-transform shadow-sm"
                              >
                                <FiTag 
                                  className="h-7 w-7" 
                                  style={{ color: tag.color }}
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{tag.name}</h3>
                                <p className="text-xs text-gray-600 mt-1">
                                  {getSnippetCount(tag.name)} snippets
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingTag(tag.id!);
                                  setEditName(tag.name);
                                  setEditColor(tag.color);
                                }}
                                className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                              >
                                <FiEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTag(tag.id!)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs mt-2">
                            <span className="flex items-center gap-2 text-gray-600">
                              <FiCode className="h-4 w-4" />
                              {getSnippetCount(tag.name)} snippets tagged
                            </span>
                            <span className="flex items-center gap-2 text-gray-600">
                              <FiClock className="h-4 w-4" />
                              {formatDate(tag.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-end mt-3">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${tag.color}20`,
                                color: tag.color,
                              }}
                            >
                              {tag.name}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 