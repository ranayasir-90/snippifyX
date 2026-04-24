"use client";
import { useEffect, useState } from "react";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import AdminLayout from "@/layouts/AdminLayout";
import { folderService, snippetService, Folder, Snippet } from "@/lib/firebaseServices";
import { FiSearch, FiEdit, FiTrash2, FiX, FiFolder } from "react-icons/fi";
import { useError } from "@/contexts/ErrorContext";

const PAGE_SIZE = 10;

export default function AdminFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filtered, setFiltered] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editFolder, setEditFolder] = useState<Partial<Folder>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [success, setSuccess] = useState("");
  const { showError } = useError();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allFolders, allSnippets] = await Promise.all([
          folderService.getAll ? folderService.getAll() : [], // fallback if not implemented
          snippetService.getAll()
        ]);
        setFolders(allFolders);
        setSnippets(allSnippets);
        setFiltered(allFolders);
      } catch (e) {
        setFolders([]);
        setFiltered([]);
        setSnippets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = folders;
    if (search.trim()) {
      data = data.filter(f =>
        f.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(data);
    setPage(1);
  }, [search, folders]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Modal open/close
  const openModal = (folder: Folder) => {
    setSelectedFolder(folder);
    setEditFolder(folder);
    setEditMode(false);
    setModalOpen(true);
    setSuccess("");
    setConfirmDelete(false);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedFolder(null);
    setEditFolder({});
    setEditMode(false);
    setSuccess("");
    setConfirmDelete(false);
  };

  // Edit/save folder
  const handleSave = async () => {
    if (!selectedFolder?.id) return;
    setSaving(true);
    setSuccess("");
    try {
      await folderService.update(selectedFolder.id, editFolder);
      setFolders(folders => folders.map(f => f.id === selectedFolder.id ? { ...f, ...editFolder } as Folder : f));
      setSuccess("Folder updated successfully.");
      setEditMode(false);
    } catch (e) {
      showError("Failed to update folder.");
    } finally {
      setSaving(false);
    }
  };

  // Delete folder
  const handleDelete = async () => {
    if (!selectedFolder?.id) return;
    setDeleting(true);
    setSuccess("");
    try {
      await folderService.delete(selectedFolder.id);
      setFolders(folders => folders.filter(f => f.id !== selectedFolder.id));
      setSuccess("Folder deleted.");
      setTimeout(closeModal, 1000);
    } catch (e) {
      showError("Failed to delete folder.");
    } finally {
      setDeleting(false);
    }
  };

  // Get snippets in folder
  const getSnippetsInFolder = (folderId: string) => snippets.filter(s => s.folderId === folderId);

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Folders Management</h1>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search folder name..."
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">Loading folders...</td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">No folders found.</td>
                </tr>
              ) : (
                paged.map(folder => (
                  <tr key={folder.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => openModal(folder)}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-2"><FiFolder className="h-4 w-4" />{folder.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{folder.createdAt?.toDate?.().toLocaleString() || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{folder.updatedAt?.toDate?.().toLocaleString() || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex gap-2 justify-center">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Edit" onClick={e => { e.stopPropagation(); openModal(folder); setEditMode(true); }}>
                          <FiEdit className="h-4 w-4 text-blue-500" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Delete" onClick={e => { e.stopPropagation(); openModal(folder); setConfirmDelete(true); }}>
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

        {/* Folder Detail Modal */}
        {modalOpen && selectedFolder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" onClick={closeModal}>
                <FiX className="h-6 w-6" />
              </button>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedFolder.name}</h2>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>Created: {selectedFolder.createdAt?.toDate?.().toLocaleString() || '-'}</span>
                  <span>Updated: {selectedFolder.updatedAt?.toDate?.().toLocaleString() || '-'}</span>
                </div>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editFolder.name || ''}
                      onChange={e => setEditFolder({ ...editFolder, name: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                      {selectedFolder.description || 'No description available'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Snippets in this folder</label>
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                      {selectedFolder.id && getSnippetsInFolder(selectedFolder.id).length > 0 ? (
                        <div className="text-sm text-gray-600">
                          {selectedFolder.id && getSnippetsInFolder(selectedFolder.id).length} snippets
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No snippets in this folder</div>
                      )}
                    </div>
                  </div>
                  
                  {confirmDelete ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                        <p>Are you sure you want to delete this folder? This action cannot be undone.</p>
                      </div>
                      {success && <div className="text-green-500 text-sm">{success}</div>}
                      <div className="flex gap-3">
                        <button
                          onClick={handleDelete}
                          disabled={deleting}
                          className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {deleting ? 'Deleting...' : 'Delete Folder'}
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
                        Edit Folder
                      </button>
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="px-4 py-2 rounded-xl border border-red-300 text-red-700 font-semibold hover:bg-red-50 transition-colors"
                      >
                        Delete Folder
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