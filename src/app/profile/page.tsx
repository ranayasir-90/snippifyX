"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { userService, snippetService, folderService, tagService, User, Snippet, Folder, Tag } from "@/lib/firebaseServices";
import { 
  updateEmail,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { 
  FiUser, 
  FiMail, 
  FiEdit3, 
  FiSave, 
  FiX, 
  FiCalendar,
  FiClock,
  FiCode,
  FiFolder,
  FiTag,
  FiStar,
  FiShare2,
  FiTrendingUp,
  FiCamera,
  FiMapPin,
  FiGlobe,
  FiSettings,
  FiShield,
  FiLock,
  FiKey,
  FiCreditCard,
  FiBell,
  FiMonitor
} from "react-icons/fi";
import { useError } from "@/contexts/ErrorContext";

export default function Profile() {
  const { user: authUser, updateUser, refreshUserData, signOut } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading: notificationLoading } = useNotifications();
  const [firestoreUser, setFirestoreUser] = useState<User | null>(null);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const { showError } = useError();
  const [imageUploading, setImageUploading] = useState(false);
  const [activeSection, setActiveSection] = useState('edit-profile');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [about, setAbout] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState("");

  // Account Management states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountActionLoading, setAccountActionLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);

  // Security states
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([
    {
      id: 'current',
      name: 'This device',
      browser: 'Chrome',
      os: 'Windows',
      location: 'Active now',
      isCurrent: true,
      lastActive: new Date()
    }
  ]);

  // Navigation items
  const navigationItems = [
    { id: 'edit-profile', label: 'Edit Profile', icon: FiUser },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'account-management', label: 'Account Management', icon: FiSettings },
    { id: 'security', label: 'Security', icon: FiShield },
  ];

  // Load user data and statistics
  useEffect(() => {
    const loadProfileData = async () => {
      if (!authUser?.id) return;
      
      try {
        setLoading(true);
        const [userData, snippetsData, foldersData, tagsData] = await Promise.all([
          userService.getById(authUser.id),
          snippetService.getByUser(authUser.id),
          folderService.getByUser(authUser.id),
          tagService.getByUser(authUser.id)
        ]);

        if (userData) {
          setFirestoreUser(userData);
          // Split name into first and last name
          const nameParts = (userData.name || "").split(" ");
          setFirstName(nameParts[0] || "");
          setLastName(nameParts.slice(1).join(" ") || "");
          setAbout(userData.bio || "");
          setBirthdate(userData.birthdate || "");
          setGender(userData.gender || "");
          setCountry(userData.country || "");
          setProfileImage(userData.profileImage || "");
        }

        setSnippets(snippetsData);
        setFolders(foldersData);
        setTags(tagsData);
      } catch (err) {
        console.error("Error loading profile data:", err);
        showError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [authUser, showError]);

  // Check if user has password set
  useEffect(() => {
    const checkPasswordStatus = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Check if user has password provider (email/password signup)
        const hasPasswordProvider = Array.isArray(currentUser.providerData) && currentUser.providerData.some(
          (provider) => provider.providerId === "password"
        );
        setHasPassword(hasPasswordProvider);
      }
    };

    checkPasswordStatus();
  }, [authUser]);

  const handleSaveProfile = async () => {
    if (!authUser?.id || !firestoreUser) return;
    
    setLoading(true);
    setSuccess("");

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const updatedUser: User = {
        ...firestoreUser,
        name: fullName,
        bio: about,
        birthdate,
        gender,
        country,
        profileImage,
      };

      await userService.createOrUpdate(updatedUser);
      setFirestoreUser(updatedUser);
      
      // Update Firebase Auth and Firestore user
      await updateUser({ 
        name: fullName, 
        bio: about,
        birthdate,
        gender,
        country,
        profileImage
      });
      
      // Refresh user data across all components
      await refreshUserData();
      
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      showError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Account Management Functions
  const handleEmailChange = async () => {
    if (!auth.currentUser || !newEmail.trim()) return;
    
    setAccountActionLoading(true);

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update email
      await updateEmail(auth.currentUser, newEmail);
      
      // Update Firestore
      await updateUser({ email: newEmail });
      await refreshUserData();
      
      setSuccess("Email updated successfully!");
      setShowEmailModal(false);
      setNewEmail("");
      setCurrentPassword("");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error updating email:", err);
      showError(err.message || "Failed to update email. Please check your current password.");
    } finally {
      setAccountActionLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!auth.currentUser || !newPassword || newPassword !== confirmPassword) return;
    
    setAccountActionLoading(true);

    try {
      // If user has a password, require re-authentication
      if (hasPassword) {
        if (!currentPassword) {
          showError("Please enter your current password.");
          return;
        }
        // Re-authenticate user
        const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }
      
      // Update password
      await updatePassword(auth.currentUser, newPassword);
      
      // Update hasPassword state
      setHasPassword(true);
      
      setSuccess(hasPassword ? "Password updated successfully!" : "Password set successfully!");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error updating password:", err);
      showError(err.message || "Failed to update password. Please check your current password.");
    } finally {
      setAccountActionLoading(false);
    }
  };

  const handleAccountDeactivation = async () => {
    if (!authUser?.id) return;
    
    setAccountActionLoading(true);

    try {
      // Update user status to inactive
      await updateUser({ active: false });
      await refreshUserData();
      
      setSuccess("Account deactivated successfully!");
      setShowDeactivateModal(false);
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deactivating account:", err);
      showError("Failed to deactivate account. Please try again.");
    } finally {
      setAccountActionLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!auth.currentUser || !authUser?.id) return;
    
    setAccountActionLoading(true);

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Delete user data from Firestore
      await userService.delete(authUser.id);
      
      // Delete user's snippets
      const userSnippets = await snippetService.getByUser(authUser.id);
      for (const snippet of userSnippets) {
        if (snippet.id) {
          await snippetService.delete(snippet.id);
        }
      }
      
      // Delete user's folders
      const userFolders = await folderService.getByUser(authUser.id);
      for (const folder of userFolders) {
        if (folder.id) {
          await folderService.delete(folder.id);
        }
      }
      
      // Delete user's tags
      const userTags = await tagService.getByUser(authUser.id);
      for (const tag of userTags) {
        if (tag.id) {
          await tagService.delete(tag.id);
        }
      }
      
      // Delete Firebase Auth user
      await deleteUser(auth.currentUser);
      
      setSuccess("Account deleted successfully!");
      setShowDeleteModal(false);
      
      // Sign out and redirect
      setTimeout(() => {
        signOut();
      }, 2000);
    } catch (err: any) {
      console.error("Error deleting account:", err);
      showError(err.message || "Failed to delete account. Please check your password.");
    } finally {
      setAccountActionLoading(false);
    }
  };

  // Security Functions
  const handleGoogleConnect = async () => {
    setAccountActionLoading(true);

    try {
      // In a real implementation, you would integrate with Google OAuth
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGoogleConnected(true);
      setSuccess("Google account connected successfully!");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error connecting Google:", err);
      showError("Failed to connect Google account. Please try again.");
    } finally {
      setAccountActionLoading(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    setAccountActionLoading(true);

    try {
      // In a real implementation, you would disconnect from Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setGoogleConnected(false);
      setSuccess("Google account disconnected successfully!");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error disconnecting Google:", err);
      showError("Failed to disconnect Google account. Please try again.");
    } finally {
      setAccountActionLoading(false);
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    setConnectedDevices(prev => prev.filter(device => device.id !== deviceId));
    // In a real app, you would call an API to revoke the device session
  };

  // Notification handlers
  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification(notificationId);
  };

  const formatNotificationTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStats = () => {
    const totalSnippets = snippets.length;
    const publicSnippets = snippets.filter(s => s.isPublic).length;
    const likedSnippets = snippets.filter(s => s.favorite).length;
    const totalFolders = folders.length;
    const totalTags = tags.length;

    return {
      totalSnippets,
      publicSnippets,
      likedSnippets,
      totalFolders,
      totalTags,
      averageSnippetsPerDay: totalSnippets > 0 ? (totalSnippets / Math.max(1, Math.floor((Date.now() - (firestoreUser?.createdAt?.toDate?.() || new Date()).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(1) : "0"
    };
  };

  const getRecentActivity = () => {
    return snippets
      .sort((a, b) => {
        const dateA = a.updatedAt?.toDate?.() || new Date(a.updatedAt);
        const dateB = b.updatedAt?.toDate?.() || new Date(b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);
  };

  const renderContent = () => {
    const stats = getStats();
    const recentActivity = getRecentActivity();

    switch (activeSection) {
      case 'edit-profile':
        return (
          <div className="space-y-6">
            {/* Edit Profile Form */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiUser className="h-6 w-6 text-blue-600" />
                Edit Profile
              </h3>
              
              <div className="space-y-6">
                {/* Photo */}
                <div className="flex flex-col items-center gap-4">
                  <label className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg cursor-pointer overflow-hidden border-4 border-white">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <FiUser className="w-10 h-10 text-white opacity-80" />
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    {imageUploading && <span className="absolute text-xs text-blue-600 mt-2">Uploading...</span>}
                  </label>
                  <span className="text-sm text-gray-600">Photo</span>
                </div>

                {/* Name Fields */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                    <Input 
                      value={firstName} 
                      onChange={e => setFirstName(e.target.value)} 
                      placeholder="First name" 
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                    <Input 
                      value={lastName} 
                      onChange={e => setLastName(e.target.value)} 
                      placeholder="Last name" 
                      className="w-full"
                    />
                  </div>
                </div>

                {/* About */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                  <textarea 
                    value={about} 
                    onChange={e => setAbout(e.target.value)} 
                    placeholder="Tell us about yourself..." 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Birthdate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birthdate</label>
                  <Input 
                    type="date" 
                    value={birthdate} 
                    onChange={e => setBirthdate(e.target.value)} 
                    className="w-full"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="gender" 
                        value="male" 
                        checked={gender === 'male'} 
                        onChange={e => setGender(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Male</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="gender" 
                        value="female" 
                        checked={gender === 'female'} 
                        onChange={e => setGender(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Female</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="gender" 
                        value="non-binary" 
                        checked={gender === 'non-binary'} 
                        onChange={e => setGender(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Non-binary</span>
                    </label>
                  </div>
                </div>

                {/* Country/Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country/Region</label>
                  <Input 
                    value={country} 
                    onChange={e => setCountry(e.target.value)} 
                    placeholder="Country or region" 
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow w-full sm:w-auto">Save</Button>
              </div>
              {success && <div className="text-green-600 text-center mt-2">{success}</div>}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FiBell className="h-6 w-6 text-blue-600" />
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {unreadCount} unread
                    </span>
                    <Button
                      onClick={handleMarkAllAsRead}
                      disabled={notificationLoading}
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                    >
                      {notificationLoading ? 'Marking...' : 'Mark all as read'}
                    </Button>
                  </div>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <FiBell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    You'll see notifications here when someone likes your snippets or interacts with your content.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        notification.isRead
                          ? 'border-gray-200 bg-gray-50'
                          : 'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{formatNotificationTime(notification.createdAt)}</span>
                            {notification.fromUserName && (
                              <span>from {notification.fromUserName}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              onClick={() => notification.id && handleMarkAsRead(notification.id)}
                              variant="outline"
                              size="sm"
                              className="rounded-lg"
                            >
                              Mark as read
                            </Button>
                          )}
                          <Button
                            onClick={() => notification.id && handleDeleteNotification(notification.id)}
                            variant="outline"
                            size="sm"
                            className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'account-management':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Account management</h3>
              <p className="text-gray-600 mb-8">
                Make changes to your personal information or account type.
              </p>
              
              <div className="space-y-8">
                {/* Your account */}
                <div className="border border-gray-200 rounded-xl p-4 sm:p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Your account</h4>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium">Email</span>
                        <span className="text-gray-500 text-sm">• Private</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900">{firestoreUser?.email}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowEmailModal(true)}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <span className="text-gray-900 font-medium">Password</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowPasswordModal(true)}
                      >
                        {hasPassword ? "Change" : "New Password"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Deactivation and deletion */}
                <div className="border border-gray-200 rounded-xl p-4 sm:p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Deactivation and deletion</h4>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h5 className="text-gray-900 font-medium mb-1">Deactivate account</h5>
                      <p className="text-gray-600 text-sm">
                        Temporarily hide your profile, Snippets and folders
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDeactivateModal(true)}
                    >
                      Deactivate account
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4">
                    <div>
                      <h5 className="text-gray-900 font-medium mb-1">Delete your data and account</h5>
                      <p className="text-gray-600 text-sm">
                        Permanently delete your data and everything associated with your account
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Security</h3>
              <p className="text-gray-600 mb-8">
                Include additional security like checking your list of connected devices to keep your account, Snippets and folders safe.
              </p>
              
              <div className="space-y-8">
                {/* Login Options */}
                <div className="border border-gray-200 rounded-xl p-4 sm:p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Login options</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Use your social account to log in to SnippifyX. 
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">G</span>
                      </div>
                      <span className="text-gray-700">Use your Google account to log in</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={googleConnected ? handleGoogleDisconnect : handleGoogleConnect}
                      disabled={accountActionLoading}
                    >
                      {googleConnected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>

                {/* Connected Devices */}
                <div className="border border-gray-200 rounded-xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Connected devices</h4>
                      <p className="text-gray-600 text-sm">
                        This is a list of devices that have logged into your account. Revoke access to any device you don't recognize. 
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="whitespace-nowrap"
                      onClick={() => setShowSessionsModal(true)}
                    >
                      Show sessions
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {connectedDevices.map((device) => (
                      <div key={device.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <FiMonitor className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-gray-700 font-medium">{device.name}</div>
                            <div className="text-gray-500 text-sm">
                              {device.os} • {device.browser} • {device.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          {device.isCurrent ? (
                            <span className="text-green-600 text-sm font-medium">Current</span>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeDevice(device.id)}
                              disabled={accountActionLoading}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!authUser) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Profile Settings</h2>
          <button
            onClick={() => setShowMobileSidebar((v) => !v)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
        {/* Sidebar */}
        <div className={`fixed inset-0 z-40 bg-black/40 lg:bg-transparent transition-opacity duration-200 ${showMobileSidebar ? 'block' : 'hidden'} lg:static lg:block`} onClick={() => setShowMobileSidebar(false)} />
        <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg border-r border-gray-200 z-50 transform transition-transform duration-300 lg:static lg:translate-x-0 ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} lg:w-80`} onClick={e => e.stopPropagation()}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 hidden lg:block">Profile Settings</h2>
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setShowMobileSidebar(false); }}
                    className={`w-full flex flex-wrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl text-left transition-all duration-200 text-base sm:text-[1rem] md:text-base lg:text-lg min-h-[48px] sm:min-h-[52px] ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium truncate flex-1 text-left">{item.label}</span>
                    {item.id === 'notifications' && unreadCount > 0 && (
                      <div className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        {/* Content Area */}
        <div className="flex-1 p-2 sm:p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Email</label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full"
                />
              </div>
              {success && <div className="text-green-600 text-sm">{success}</div>}
              <div className="flex gap-3">
                <Button
                  onClick={handleEmailChange}
                  disabled={accountActionLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  {accountActionLoading ? "Updating..." : "Update Email"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEmailModal(false);
                    setNewEmail("");
                    setCurrentPassword("");
                  }}
                  disabled={accountActionLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {hasPassword ? "Change Password" : "Set New Password"}
            </h3>
            <div className="space-y-4">
              {hasPassword && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {hasPassword ? "New Password" : "Password"}
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={hasPassword ? "Enter new password" : "Enter your password"}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {hasPassword ? "Confirm New Password" : "Confirm Password"}
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={hasPassword ? "Confirm new password" : "Confirm your password"}
                  className="w-full"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handlePasswordChange}
                  disabled={accountActionLoading || newPassword !== confirmPassword}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  {accountActionLoading 
                    ? (hasPassword ? "Updating..." : "Setting...") 
                    : (hasPassword ? "Update Password" : "Set Password")
                  }
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  disabled={accountActionLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Deactivation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deactivate Account</h3>
            <p className="text-gray-600 mb-4">
              Your account will be temporarily hidden. You can reactivate it anytime by logging in again.
            </p>
            {success && <div className="text-green-600 text-sm mb-4">{success}</div>}
            <div className="flex gap-3">
              <Button
                onClick={handleAccountDeactivation}
                disabled={accountActionLoading}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
              >
                {accountActionLoading ? "Deactivating..." : "Deactivate Account"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeactivateModal(false);
                }}
                disabled={accountActionLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Account Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. All your data, snippets, folders, and tags will be permanently deleted.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter your password to confirm</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAccountDeletion}
                disabled={accountActionLoading || !currentPassword}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {accountActionLoading ? "Deleting..." : "Delete Account"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentPassword("");
                }}
                disabled={accountActionLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                These are all the devices currently signed into your account. You can revoke access to any device you don't recognize.
              </p>
              <div className="space-y-3">
                {connectedDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <FiMonitor className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-gray-700 font-medium">{device.name}</div>
                        <div className="text-gray-500 text-sm">
                          {device.os} • {device.browser} • {device.location}
                        </div>
                        <div className="text-gray-400 text-xs">
                          Last active: {device.lastActive.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {device.isCurrent ? (
                        <span className="text-green-600 text-sm font-medium">Current Session</span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeDevice(device.id)}
                          disabled={accountActionLoading}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Revoke Access
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {success && <div className="text-green-600 text-sm">{success}</div>}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSessionsModal(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
} 