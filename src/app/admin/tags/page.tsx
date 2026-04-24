"use client";
import { useEffect, useState } from "react";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import AdminLayout from "@/layouts/AdminLayout";
import { tagService, snippetService, Tag, Snippet } from "@/lib/firebaseServices";
import { FiSearch, FiEdit, FiTrash2, FiX, FiTag } from "react-icons/fi";
import { useError } from "@/contexts/ErrorContext";

const PAGE_SIZE = 10;

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filtered, setFiltered] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTag, setEditTag] = useState<Partial<Tag>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [success, setSuccess] = useState("");
  const { showError } = useError();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allTags, allSnippets] = await Promise.all([
          tagService.getAll ? tagService.getAll() : [], // fallback if not implemented
          snippetService.getAll()
        ]);
        setTags(allTags);
        setSnippets(allSnippets);
        setFiltered(allTags);
      } catch (e) {
        setTags([]);
        setFiltered([]);
        setSnippets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = tags;
    if (search.trim()) {
      data = data.filter(t =>
        t.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(data);
    setPage(1);
  }, [search, tags]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Modal open/close
  const openModal = (tag: Tag) => {
    setSelectedTag(tag);
    setEditTag(tag);
    setEditMode(false);
    setModalOpen(true);
    setSuccess("");
    setConfirmDelete(false);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedTag(null);
    setEditTag({});
    setEditMode(false);
    setSuccess("");
    setConfirmDelete(false);
  };

  // Edit/save tag
  const handleSave = async () => {
    if (!selectedTag?.id) return;
    setSaving(true);
    setSuccess("");
    try {
      await tagService.update(selectedTag.id, editTag);
      setTags(tags => tags.map(t => t.id === selectedTag.id ? { ...t, ...editTag } as Tag : t));
      setSuccess("Tag updated successfully.");
      setEditMode(false);
    } catch (e) {
      showError("Failed to update tag.");
    } finally {
      setSaving(false);
    }
  };

  // Delete tag
  const handleDelete = async () => {
    if (!selectedTag?.id) return;
    setDeleting(true);
    setSuccess("");
    try {
      await tagService.delete(selectedTag.id);
      setTags(tags => tags.filter(t => t.id !== selectedTag.id));
      setSuccess("Tag deleted.");
      setTimeout(closeModal, 1000);
    } catch (e) {
      showError("Failed to delete tag.");
    } finally {
      setDeleting(false);
    }
  };

  // Get snippets with tag
  const getSnippetsWithTag = (tagName: string) => snippets.filter(s => s.tags.includes(tagName));

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Tags Management</h1>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tag name..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Color</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">Loading tags...</td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">No tags found.</td>
                </tr>
              ) : (
                paged.map(tag => (
                  <tr key={tag.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => openModal(tag)}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-2"><FiTag className="h-4 w-4" />{tag.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="inline-block w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: tag.color || '#6B7280' }}></span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tag.createdAt?.toDate?.().toLocaleString() || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex gap-2 justify-center">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Edit" onClick={e => { e.stopPropagation(); openModal(tag); setEditMode(true); }}>
                          <FiEdit className="h-4 w-4 text-blue-500" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Delete" onClick={e => { e.stopPropagation(); openModal(tag); setConfirmDelete(true); }}>
                          <FiTrash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors">Previous</button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors">Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Tag Detail Modal */}
        {modalOpen && selectedTag && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" onClick={closeModal}>
                <FiX className="h-6 w-6" />
              </button>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <FiTag className="h-6 w-6" />
                  {selectedTag.name}
                </h2>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>Created: {selectedTag.createdAt?.toDate?.().toLocaleString() || '-'}</span>
                  <span>Color: <span className="inline-block w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: selectedTag.color || '#6B7280' }}></span></span>
                </div>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editTag.name || ''}
                      onChange={e => setEditTag({ ...editTag, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <input
                      type="color"
                      className="w-full h-12 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editTag.color || '#6B7280'}
                      onChange={e => setEditTag({ ...editTag, color: e.target.value })}
                    />
                  </div>
                  {success && <div className="text-green-500 text-sm">{success}</div>}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Snippets with this tag</label>
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                      {getSnippetsWithTag(selectedTag.name).length > 0 ? (
                        <div className="text-sm text-gray-600">
                          {getSnippetsWithTag(selectedTag.name).length} snippets
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No snippets with this tag</div>
                      )}
                    </div>
                  </div>
                  
                  {confirmDelete ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                        <p>Are you sure you want to delete this tag? This action cannot be undone.</p>
                      </div>
                      {success && <div className="text-green-500 text-sm">{success}</div>}
                      <div className="flex gap-3">
                        <button
                          onClick={handleDelete}
                          disabled={deleting}
                          className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {deleting ? 'Deleting...' : 'Delete Tag'}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                      >
                        Edit Tag
                      </button>
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="px-4 py-2 rounded-xl border border-red-300 text-red-700 font-semibold hover:bg-red-50 transition-colors"
                      >
                        Delete Tag
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminRouteGuard>
  );
} 