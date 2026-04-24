import React from "react";
import { FiCopy, FiHeart, FiTrash2, FiEdit, FiStar, FiShare2, FiFolder, FiClock, FiTag, FiGlobe, FiFileText } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export interface SnippetCardProps {
  snippet: any;
  folderName?: string;
  tagColors?: { [tag: string]: string };
  onCopy?: (snippet: any) => void;
  onFavorite?: (snippet: any) => void;
  onDelete?: (snippet: any) => void;
  onEdit?: (snippet: any) => void;
  onClick?: (snippet: any) => void;
  onLike?: (snippetId: string) => void;
  isLiked?: boolean;
  isLoading?: boolean;
  viewMode?: "grid" | "list";
  showLikeButton?: boolean;
  showFolder?: boolean;
  showFavorite?: boolean;
  showShareIcon?: boolean;
  isPublicContext?: boolean;
  size?: "sm" | "md";
}

const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  folderName,
  tagColors = {},
  onCopy,
  onFavorite,
  onDelete,
  onEdit,
  onClick,
  onLike,
  isLiked = false,
  isLoading = false,
  viewMode = "grid",
  showLikeButton = false,
  showFolder = true,
  showFavorite = true,
  showShareIcon = true,
  isPublicContext = false,
  size = "md",
}) => {
  const padding = size === "sm" ? "p-3" : viewMode === "list" ? "p-6" : "p-6";
  const titleClass = size === "sm" ? "text-base font-semibold" : "text-lg font-semibold";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const tagClass = size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-xs";
  const contentClass = size === "sm" ? "mb-2 text-xs" : "mb-4";
  return (
    <div
      className={`group bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${viewMode === "list" ? "flex" : ""}`}
      onClick={() => onClick && onClick(snippet)}
    >
      <div className={viewMode === "list" ? `flex-1 ${padding} flex flex-col justify-between` : padding}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${size === "sm" ? "w-8 h-8" : "w-10 h-10"} rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center`}>
              <FiFileText className={`${iconSize} text-white`} />
            </div>
            <div>
              <h3 className={`${titleClass} text-gray-900 group-hover:text-indigo-600 transition-colors`}>
                {snippet.title}
              </h3>
              <p className="text-xs text-gray-500">{snippet.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {snippet.favorite && showFavorite && <FiStar className={`${iconSize} text-yellow-500 fill-current`} />}
            {snippet.isPublic && showShareIcon && (
              <FiGlobe className={`${iconSize} text-green-500`} />
            )}
          </div>
        </div>
        <p className={`text-gray-600 ${contentClass} line-clamp-2`}>
          {snippet.content.length > 120 ? `${snippet.content.substring(0, 120)}...` : snippet.content}
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {snippet.tags && snippet.tags.slice(0, 3).map((tag: string, idx: number) => (
            <span
              key={idx}
              className={`${tagClass} rounded-full font-medium border`}
              style={{
                backgroundColor: `${tagColors[tag] || "#6366F1"}10`,
                color: tagColors[tag] || "#6366F1",
                borderColor: `${tagColors[tag] || "#6366F1"}30`
              }}
            >
              {tag}
            </span>
          ))}
          {snippet.tags && snippet.tags.length > 3 && (
            <span className={`${tagClass} rounded-full bg-gray-100 text-gray-600 border border-gray-200`}>
              +{snippet.tags.length - 3} more
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-2">
            <FiClock className={iconSize} />
            <span>{snippet.updatedAt && (snippet.updatedAt.toDate ? snippet.updatedAt.toDate().toLocaleDateString() : "-")}</span>
          </div>
          <div className="flex items-center gap-3">
            {showLikeButton && (
              <div className="flex items-center gap-1">
                <FiHeart className={`${iconSize} ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                <span>{snippet.likes || 0}</span>
              </div>
            )}
            {showFolder && snippet.folderId && folderName && (
              <div className="flex items-center gap-1">
                <FiFolder className={iconSize} />
                <span>{folderName}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
          {showLikeButton && (
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-red-50"
              onClick={e => { e.stopPropagation(); onLike && snippet.id && onLike(snippet.id); }}
              disabled={isLoading}
              title={isLiked ? "Unlike" : "Like"}
            >
              <FiHeart className={`${iconSize} ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-indigo-50"
            onClick={e => { e.stopPropagation(); onCopy && onCopy(snippet); }}
            disabled={isLoading}
            title="Copy"
          >
            <FiCopy className={`${iconSize} text-gray-400`} />
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-red-50"
              onClick={e => { e.stopPropagation(); onDelete(snippet); }}
              disabled={isLoading}
              title="Delete"
            >
              <FiTrash2 className={`${iconSize} text-red-400`} />
            </Button>
          )}
          {onFavorite && showFavorite && (
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-yellow-50"
              onClick={e => { e.stopPropagation(); onFavorite(snippet); }}
              disabled={isLoading}
              title={snippet.favorite ? "Unlike" : "Like"}
            >
              <FiHeart className={`${iconSize} ${snippet.favorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
            </Button>
          )}
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-blue-50"
              onClick={e => { e.stopPropagation(); onEdit(snippet); }}
              disabled={isLoading}
              title="Edit"
            >
              <FiEdit className={`${iconSize} text-blue-500`} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnippetCard; 