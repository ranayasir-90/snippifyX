"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/layouts/AdminLayout";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FiBell, 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiSend,
  FiUsers,
  FiGlobe,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiX,
  FiSave,
  FiRefreshCw,
  FiHeart,
  FiMessageSquare
} from "react-icons/fi";
import { notificationService, userService, Notification, User } from "@/lib/firebaseServices";
import { useError } from "@/contexts/ErrorContext";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [success, setSuccess] = useState("");
  const { showError } = useError();
  const { showConfirm } = useConfirmDialog();

  // Form states for creating notification
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<'system' | 'like' | 'comment' | 'follow' | 'snippet_shared'>('system');
  const [targetUsers, setTargetUsers] = useState<'all' | 'specific'>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notificationsData, usersData] = await Promise.all([
        notificationService.getAll(),
        userService.getAll()
      ]);
      
      setNotifications(notificationsData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading data:", error);
      showError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.fromUserName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || notification.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleCreateNotification = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      showError("Please fill in all required fields");
      return;
    }

    setSendingNotification(true);

    try {
      const notificationData = {
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType,
        relatedId: 'admin-broadcast',
        relatedType: 'admin_notification',
        fromUserId: user?.id || 'admin',
        fromUserName: user?.name || 'Admin',
        isRead: false,
      };

      if (targetUsers === 'all') {
        // Send to all users
        const batch = users.map(user => ({
          ...notificationData,
          userId: user.id,
        }));

        // Create notifications in batches to avoid Firestore limits
        const batchSize = 500;
        for (let i = 0; i < batch.length; i += batchSize) {
          const currentBatch = batch.slice(i, i + batchSize);
          await Promise.all(currentBatch.map(notification => 
            notificationService.create(notification)
          ));
        }

        setSuccess(`Notification sent to all users successfully!`);
      } else {
        // Send to specific users
        const batch = selectedUserIds.map(userId => ({
          ...notificationData,
          userId: userId,
        }));

        await Promise.all(batch.map(notification => 
          notificationService.create(notification)
        ));

        setSuccess(`Notification sent to selected users successfully!`);
      }

      // Reset form
      setNotificationTitle("");
      setNotificationMessage("");
      setNotificationType('system');
      setTargetUsers('all');
      setSelectedUserIds([]);
      setShowCreateModal(false);

      // Reload data
      await loadData();
    } catch (error) {
      console.error("Error creating notification:", error);
      showError("Failed to send notification. Please try again.");
    } finally {
      setSendingNotification(false);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    showConfirm({ message: 'Are you sure you want to delete this notification?', onConfirm: async () => {
      try {
        await notificationService.delete(notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        showError("Notification deleted successfully!");
      } catch (error) {
        console.error("Error deleting notification:", error);
        showError("Failed to delete notification");
      }
    }});
  };

  const handleViewNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowViewModal(true);
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
      case 'system':
        return '🔔';
      default:
        return '🔔';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const getNotificationStats = () => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const system = notifications.filter(n => n.type === 'system').length;
    const likes = notifications.filter(n => n.type === 'like').length;
    const comments = notifications.filter(n => n.type === 'comment').length;

    return { total, unread, system, likes, comments };
  };

  const stats = getNotificationStats();

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminRouteGuard>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative px-6 py-8 lg:py-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="text-white">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                      Notification Management
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Send notifications to users and manage system notifications
                    </p>
                    <p className="text-blue-200 text-sm mt-2">
                      🔒 User privacy is protected - only masked IDs are displayed
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowCreateModal(true)} 
                    className="px-6 py-3 rounded-xl bg-white text-blue-600 hover:bg-gray-50 shadow-lg"
                  >
                    <FiPlus className="mr-2 h-5 w-5" />
                    Send Notification
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <FiBell className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unread</p>
                    <p className="text-3xl font-bold text-red-600">{stats.unread}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <FiAlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System</p>
                    <p className="text-3xl font-bold text-green-600">{stats.system}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <FiGlobe className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Likes</p>
                    <p className="text-3xl font-bold text-pink-600">{stats.likes}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                    <FiHeart className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Comments</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.comments}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <FiMessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  >
                    <option value="all">All Types</option>
                    <option value="system">System</option>
                    <option value="like">Likes</option>
                    <option value="comment">Comments</option>
                    <option value="follow">Follows</option>
                    <option value="snippet_shared">Shared</option>
                  </select>
                  <Button
                    onClick={loadData}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FiRefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  All Notifications ({filteredNotifications.length})
                </h2>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <FiBell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
                  <p className="text-gray-600">
                    {searchTerm || filterType !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "No notifications have been created yet"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-6 hover:bg-gray-50 ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="text-2xl">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                                  Unread
                                </span>
                              )}
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                {notification.type}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Recipient: User #{notification.userId?.slice(-6) || 'Unknown'}</span>
                              {notification.fromUserName && (
                                <span>From: {notification.fromUserName}</span>
                              )}
                              <span>{formatDate(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewNotification(notification)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <FiEye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => notification.id && handleDeleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Notification Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Send Notification
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    placeholder="Notification title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Notification message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={notificationType}
                    onChange={(e) => setNotificationType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  >
                    <option value="system">System</option>
                    <option value="like">Like</option>
                    <option value="comment">Comment</option>
                    <option value="follow">Follow</option>
                    <option value="snippet_shared">Snippet Shared</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Users
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="targetUsers"
                        value="all"
                        checked={targetUsers === 'all'}
                        onChange={(e) => setTargetUsers(e.target.value as 'all' | 'specific')}
                        className="mr-2"
                      />
                      <span className="text-gray-700">
                        All Users
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="targetUsers"
                        value="specific"
                        checked={targetUsers === 'specific'}
                        onChange={(e) => setTargetUsers(e.target.value as 'all' | 'specific')}
                        className="mr-2"
                      />
                      <span className="text-gray-700">
                        Specific Users
                      </span>
                    </label>
                  </div>
                </div>

                {targetUsers === 'specific' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Users
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                      {users.map((user) => (
                        <label key={user.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUserIds(prev => [...prev, user.id]);
                              } else {
                                setSelectedUserIds(prev => prev.filter(id => id !== user.id));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-gray-700">
                            {user.name} (User #{user.id.slice(-6)})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">{success}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateNotification}
                  disabled={sendingNotification || !notificationTitle.trim() || !notificationMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {sendingNotification ? (
                    <>
                      <FiRefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="h-4 w-4 mr-2" />
                      Send Notification
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* View Notification Modal */}
        {showViewModal && selectedNotification && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Notification Details
                  </h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {getNotificationIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedNotification.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedNotification.type} • {formatDate(selectedNotification.createdAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedNotification.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient
                    </label>
                    <p className="text-gray-900">User #{selectedNotification.userId?.slice(-6) || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From
                    </label>
                    <p className="text-gray-900">{selectedNotification.fromUserName || 'System'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <p className={`${selectedNotification.isRead ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedNotification.isRead ? 'Read' : 'Unread'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <p className="text-gray-900 capitalize">{selectedNotification.type}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end">
                <Button
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </AdminRouteGuard>
    </AdminLayout>
  );
} 