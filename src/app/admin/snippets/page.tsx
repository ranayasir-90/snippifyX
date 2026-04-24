"use client";
import { useEffect, useState } from "react";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import AdminLayout from "@/layouts/AdminLayout";
import { snippetService, Snippet } from "@/lib/firebaseServices";
import { FiSearch, FiEdit, FiTrash2, FiEye, FiX } from "react-icons/fi";
import { useError } from "@/contexts/ErrorContext";

const PAGE_SIZE = 10;

export default function AdminSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filtered, setFiltered] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [publicFilter, setPublicFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSnippet, setEditSnippet] = useState<Partial<Snippet>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [success, setSuccess] = useState("");
  const { showError } = useError();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allSnippets = await snippetService.getAll();
        setSnippets(allSnippets);
        setFiltered(allSnippets);
      } catch (e) {
        setSnippets([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = snippets;
    if (search.trim()) {
      data = data.filter(s =>
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.content?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (publicFilter !== "all") {
      data = data.filter(s => (publicFilter === "public" ? s.isPublic : !s.isPublic));
    }
    setFiltered(data);
    setPage(1);
  }, [search, publicFilter, snippets]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Modal open/close
  const openModal = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setEditSnippet(snippet);
    setEditMode(false);
    setModalOpen(true);
    setSuccess("");
    setConfirmDelete(false);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedSnippet(null);
    setEditSnippet({});
    setEditMode(false);
    setSuccess("");
    setConfirmDelete(false);
  };

  // Edit/save snippet
  const handleSave = async () => {
    if (!selectedSnippet?.id) return;
    setSaving(true);
    setSuccess("");
    try {
      await snippetService.update(selectedSnippet.id, editSnippet);
      setSnippets(snippets => snippets.map(s => s.id === selectedSnippet.id ? { ...s, ...editSnippet } as Snippet : s));
      setSuccess("Snippet updated successfully.");
      setEditMode(false);
    } catch (e) {
      showError("Failed to update snippet.");
    } finally {
      setSaving(false);
    }
  };

  // Delete snippet
  const handleDelete = async () => {
    if (!selectedSnippet?.id) return;
    setDeleting(true);
    setSuccess("");
    try {
      await snippetService.delete(selectedSnippet.id);
      setSnippets(snippets => snippets.filter(s => s.id !== selectedSnippet.id));
      setSuccess("Snippet deleted.");
      setTimeout(closeModal, 1000);
    } catch (e) {
      showError("Failed to delete snippet.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Snippets Management</h1>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search title or content..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={publicFilter}
              onChange={e => setPublicFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Public</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">Loading snippets...</td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">No snippets found.</td>
                </tr>
              ) : (
                paged.map(snippet => (
                  <tr key={snippet.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => openModal(snippet)}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{snippet.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {snippet.isPublic ? <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Yes</span> : <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">No</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{snippet.updatedAt?.toDate?.().toLocaleString() || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex gap-2 justify-center">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Edit" onClick={e => { e.stopPropagation(); openModal(snippet); setEditMode(true); }}>
                          <FiEdit className="h-4 w-4 text-blue-500" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Delete" onClick={e => { e.stopPropagation(); openModal(snippet); setConfirmDelete(true); }}>
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

        {/* Snippet Detail Modal */}
        {modalOpen && selectedSnippet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" onClick={closeModal}>
                <FiX className="h-6 w-6" />
              </button>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSnippet.title}</h2>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>Public: {selectedSnippet.isPublic ? 'Yes' : 'No'}</span>
                  <span>Updated: {selectedSnippet.updatedAt?.toDate?.().toLocaleString() || '-'}</span>
                </div>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editSnippet.title || ''}
                      onChange={e => setEditSnippet({ ...editSnippet, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                      rows={10}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      value={editSnippet.content || ''}
                      onChange={e => setEditSnippet({ ...editSnippet, content: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={editSnippet.isPublic || false}
                        onChange={e => setEditSnippet({ ...editSnippet, isPublic: e.target.checked })}
                      />
                      <span className="text-sm text-gray-700">Public</span>
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 font-mono text-sm text-gray-900 whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {selectedSnippet.content}
                    </div>
                  </div>
                  
                  {confirmDelete ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                        <p>Are you sure you want to delete this snippet? This action cannot be undone.</p>
                      </div>
                      {success && <div className="text-green-500 text-sm">{success}</div>}
                      <div className="flex gap-3">
                        <button
                          onClick={handleDelete}
                          disabled={deleting}
                          className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {deleting ? 'Deleting...' : 'Delete Snippet'}
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
                        Edit Snippet
                      </button>
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="px-4 py-2 rounded-xl border border-red-300 text-red-700 font-semibold hover:bg-red-50 transition-colors"
                      >
                        Delete Snippet
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