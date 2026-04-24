import React from "react";
import { Button } from "./ui/button";
import {
  FiFileText,
  FiShare2,
  FiCopy,
  FiX,
  FiEye,
  FiDownload,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiStar,
  FiClock,
  FiFolder,
  FiTag,
  FiZap,
  FiBarChart,
  FiCalendar,
  FiUser,
  FiGlobe,
  FiLock,
  FiCheck,
  FiHeart
} from "react-icons/fi";
import type { User, Folder } from '@/lib/firebaseServices';

interface Snippet {
  id?: string;
  title: string;
  content: string;
  category?: string;
  createdAt?: any;
  updatedAt?: any;
  isPublic?: boolean;
  tags: string[];
  folderId?: string;
  userId?: string;
  favorite?: boolean;
  likes?: number;
  likedBy?: string[];
}

interface SnippetDetailModalProps {
  open: boolean;
  onClose: () => void;
  snippet: Snippet | null;
  folders: Folder[];
  user?: User | null;
  onEdit?: (snippet: Snippet) => void;
  onDelete?: (snippet: Snippet) => void;
  onLike?: (snippetId: string) => void;
  isLiked?: boolean;
  showEditDelete?: boolean;
  showLikeButton?: boolean;
  showFolder?: boolean;
  showFavorite?: boolean;
}

function formatDate(timestamp: any) {
  if (!timestamp) return "";
  if (typeof timestamp === "object" && "toDate" in timestamp) {
    return timestamp.toDate().toLocaleDateString();
  }
  try {
    return new Date(timestamp).toLocaleDateString();
  } catch {
    return "";
  }
}

const SnippetDetailModal: React.FC<SnippetDetailModalProps> = ({
  open,
  onClose,
  snippet,
  folders,
  user,
  onEdit,
  onDelete,
  onLike,
  isLiked = false,
  showEditDelete = false,
  showLikeButton = false,
  showFolder = true,
  showFavorite = true,
}) => {
  if (!open || !snippet) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(snippet.content);
      // You could add a toast notification here
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200">
        {/* Enhanced Modal Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative p-6">
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-y-2">
              <div className="flex items-center space-x-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg shrink-0">
                  <FiFileText className="h-7 w-7 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-white mb-1 truncate">
                    {snippet.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white">
                      {snippet.category || "General"}
                    </span>
                    {snippet.favorite && showFavorite && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 backdrop-blur-sm text-yellow-200 flex items-center gap-1">
                        <FiStar className="h-3 w-3 fill-current" />
                        Liked
                      </span>
                    )}
                    {snippet.isPublic ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 backdrop-blur-sm text-green-200 flex items-center gap-1">
                        <FiGlobe className="h-3 w-3" />
                        Public
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 backdrop-blur-sm text-gray-200 flex items-center gap-1">
                        <FiLock className="h-3 w-3" />
                        Private
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0 z-10">
                {showLikeButton && onLike && snippet.id && (
                  <button
                    onClick={() => snippet.id && onLike(snippet.id)}
                    className={`p-3 rounded-xl backdrop-blur-sm transition-all duration-200 text-white flex items-center gap-2 ${
                      isLiked 
                        ? 'bg-red-500/20 hover:bg-red-500/30' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    title={isLiked ? "Unlike" : "Like"}
                  >
                    <FiHeart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{snippet.likes || 0}</span>
                  </button>
                )}
                <button
                  onClick={copyToClipboard}
                  className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 text-white"
                  title="Copy content"
                >
                  <FiCopy className="h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 text-white shrink-0 z-10"
                  title="Close"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="space-y-6">
            {/* Content Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FiFileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Content</h3>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-inner">
                <div className="overflow-x-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono leading-relaxed break-words">
                    {snippet.content}
                  </pre>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            {snippet.tags && snippet.tags.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <FiTag className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {snippet.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details and Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Details Card */}
              <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <FiEye className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Created</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(snippet.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                    <div className="flex items-center gap-2">
                      <FiClock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Updated</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(snippet.updatedAt)}
                    </span>
                  </div>
                  {showFolder && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                      <div className="flex items-center gap-2">
                        <FiFolder className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Folder</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {snippet.folderId ? folders.find(f => f.id === snippet.folderId)?.name || "Unknown" : "None"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics Card */}
              <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <FiBarChart className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Statistics</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                    <span className="text-sm text-gray-600">Characters</span>
                    <span className="text-sm font-bold text-gray-900">
                      {snippet.content.length.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                    <span className="text-sm text-gray-600">Words</span>
                    <span className="text-sm font-bold text-gray-900">
                      {snippet.content.split(/\s+/).filter(word => word.length > 0).length.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                    <span className="text-sm text-gray-600">Lines</span>
                    <span className="text-sm font-bold text-gray-900">
                      {snippet.content.split('\n').length.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                    <span className="text-sm text-gray-600">Tags</span>
                    <span className="text-sm font-bold text-gray-900">
                      {snippet.tags.length}
                    </span>
                  </div>
                  {showLikeButton && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                      <span className="text-sm text-gray-600">Likes</span>
                      <span className="text-sm font-bold text-gray-900">
                        {snippet.likes || 0}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <FiZap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Actions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {showEditDelete && onEdit && (
                  <Button
                    onClick={() => onEdit(snippet)}
                    className="justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                  >
                    <FiEdit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
                {showEditDelete && onDelete && (
                  <Button
                    onClick={() => onDelete(snippet)}
                    variant="outline"
                    className="justify-center rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="justify-center rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  <FiCopy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="justify-center rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnippetDetailModal; 