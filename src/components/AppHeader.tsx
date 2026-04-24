"use client";

import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { userService, User } from "@/lib/firebaseServices";
import { useState, useEffect, useRef } from "react";
import { 
  FiSearch, 
  FiPlus, 
  FiUser, 
  FiLogOut,
  FiMenu,
  FiCode,
  FiX,
  FiCheck,
  FiTrash2,
  FiBell
} from "react-icons/fi";
import Link from "next/link";
import { useSnippetModal } from "@/contexts/SnippetModalContext";

interface AppHeaderProps {
  sidebarOpen?: boolean;
  sidebarExpanded?: boolean;
  onSidebarToggle?: () => void;
  isMobile?: boolean;
}

export default function AppHeader({ sidebarOpen, sidebarExpanded, onSidebarToggle, isMobile = false }: AppHeaderProps) {
  const { user: authUser, signOut, refreshUserData } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [firestoreUser, setFirestoreUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { openSnippet } = useSnippetModal();

  useEffect(() => {
    const loadUserData = async () => {
      if (!authUser?.id) return;
      try {
        const userData = await userService.getById(authUser.id);
        setFirestoreUser(userData);
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };
    loadUserData();
  }, [authUser, authUser?.email]);

  const userName = firestoreUser?.name || authUser?.email?.split('@')[0] || "User";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'snippet_shared':
        return '📤';
      default:
        return '🔔';
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-purple-50 border-b border-gray-200 shadow-sm">
      <div className="flex h-20 items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <button
              onClick={onSidebarToggle}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <FiMenu className="h-6 w-6 text-blue-600" />
            </button>
          )}
          
          {/* Logo/Brand */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="SnippetX Logo" className="w-9 h-9 rounded-xl shadow" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-purple-700 transition-colors">SnippifyX</span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setShowNotifications(v => !v)}
              aria-label="Notifications"
            >
              <FiBell className="h-5 w-5 text-blue-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-fade-in max-h-96 overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between gap-2">
                  <span className="font-semibold text-gray-900">Notifications</span>
                  <div className="flex gap-2">
                    <button
                      className="text-xs text-blue-600 hover:underline disabled:text-gray-400"
                      onClick={handleMarkAllAsRead}
                      disabled={notifications.length === 0 || unreadCount === 0}
                    >Mark all as read</button>
                  </div>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-500">No notifications</div>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b border-gray-100 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          if (n.type === 'like' && n.relatedId) {
                            openSnippet(n.relatedId);
                            setShowNotifications(false);
                          } else if (n.id) {
                            handleMarkAsRead(n.id);
                          }
                        }}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <span className="text-lg">{getNotificationIcon(n.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${!n.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                {n.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {n.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTime(n.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              {!n.isRead && (
                                <button
                                  className="text-xs text-blue-600 hover:underline"
                                  onClick={e => { e.stopPropagation(); n.id && handleMarkAsRead(n.id); }}
                                >
                                  <FiCheck className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                className="text-xs text-red-500 hover:underline"
                                onClick={e => { e.stopPropagation(); n.id && handleDeleteNotification(n.id); }}
                              >
                                <FiTrash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* New Snippet Button */}
          <Link href="/snippets/new" className="hidden md:block">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-2xl flex items-center gap-2 shadow-md text-base font-semibold">
              <FiPlus className="h-5 w-5" />
              <span className="hidden sm:inline">New Snippet</span>
            </Button>
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {firestoreUser?.profileImage ? (
                <img 
                  src={firestoreUser.profileImage} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 shadow"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow">
                  <span className="text-white font-bold text-lg">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="hidden md:block text-left">
                <div className="text-base font-semibold text-gray-900">
                  {userName}
                </div>
                <div className="text-xs text-gray-500">
                  {authUser?.email}
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-900">{userName}</div>
                  <div className="text-xs text-gray-500">{authUser?.email}</div>
                </div>
                <div className="py-1">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <FiUser className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}