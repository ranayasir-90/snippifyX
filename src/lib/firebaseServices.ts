import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  setDoc,
  writeBatch,
  FieldValue
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { db, storage } from "./firebaseClient";

// Types
export interface Snippet {
  id?: string;
  title: string;
  content: string;
  category?: string;
  tags: string[];
  folderId?: string;
  userId: string;
  userName?: string;
  isPublic: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  description?: string;
  favorite?: boolean;
  likes?: number;
  likedBy?: string[];
}

export interface Folder {
  id?: string;
  name: string;
  description?: string;
  userId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  color?: string;
}

export interface Tag {
  id?: string;
  name: string;
  color: string;
  userId: string;
  createdAt?: Timestamp;
}

export interface UserSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  location?: string;
  website?: string;
  profileImage?: string;
  birthdate?: string;
  gender?: string;
  country?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  plan?: 'free' | 'pro';
  settings?: UserSettings;
  active?: boolean;
  twoFactorEnabled?: boolean;
  phoneNumber?: string;
}

// Log Services
export interface Log {
  id?: string;
  type: string;
  user: string;
  date: Timestamp | FieldValue;
  details: string;
}

// Support Ticket Services
export interface SupportTicket {
  id?: string;
  subject: string;
  user: string;
  date: Timestamp | FieldValue;
  status: 'Open' | 'Closed' | 'Pending';
  message: string;
  replies?: { message: string; date: Timestamp | FieldValue; user: string }[];
}

// Admin Settings Service
export interface AdminSettings {
  siteName: string;
  enablePublicSnippets: boolean;
  enableUserRegistration: boolean;
  maintenanceMode: boolean;
}

// Notification Service
export interface Notification {
  id?: string;
  title: string;
  message: string;
  userId: string; // Required - who should receive the notification
  type: 'like' | 'comment' | 'follow' | 'system' | 'snippet_shared';
  relatedId?: string; // ID of related item (snippet, comment, etc.)
  relatedType?: string; // Type of related item
  fromUserId?: string; // Who triggered the notification
  fromUserName?: string; // Name of the user who triggered the notification
  isRead: boolean;
  createdAt?: Timestamp;
}

// Helper function to convert Timestamp to Date
const timestampToDate = (timestamp: Timestamp | undefined): Date => {
  if (!timestamp) return new Date(0);
  if (typeof timestamp === 'object' && 'toDate' in timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Snippet Services
export const snippetService = {
  // Create new snippet
  async create(snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, "snippets"), {
      ...snippet,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Get snippets by user
  async getByUser(userId: string, folderId?: string): Promise<Snippet[]> {
    let q = query(
      collection(db, "snippets"),
      where("userId", "==", userId)
    );

    if (folderId) {
      q = query(q, where("folderId", "==", folderId));
    }

    const querySnapshot = await getDocs(q);
    const snippets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Snippet[];

    // Sort by updatedAt in descending order (most recent first)
    return snippets.sort((a, b) => {
      const dateA = timestampToDate(a.updatedAt);
      const dateB = timestampToDate(b.updatedAt);
      return dateB.getTime() - dateA.getTime();
    });
  },

  // Get snippet by ID
  async getById(id: string): Promise<Snippet | null> {
    const docRef = doc(db, "snippets", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Snippet;
    }
    return null;
  },

  // Update snippet
  async update(id: string, updates: Partial<Snippet>): Promise<void> {
    const docRef = doc(db, "snippets", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  // Delete snippet
  async delete(id: string): Promise<void> {
    const docRef = doc(db, "snippets", id);
    await deleteDoc(docRef);
  },

  // Search snippets
  async search(userId: string, searchTerm: string): Promise<Snippet[]> {
    const q = query(
      collection(db, "snippets"),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const snippets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Snippet[];

    // Filter and sort by updatedAt
    const filtered = snippets.filter(snippet => 
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(snippet.tags) && snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return filtered.sort((a, b) => {
      const dateA = timestampToDate(a.updatedAt);
      const dateB = timestampToDate(b.updatedAt);
      return dateB.getTime() - dateA.getTime();
    });
  },

  // Get liked snippets
  async getLikes(userId: string): Promise<Snippet[]> {
    const q = query(
      collection(db, "snippets"),
      where("userId", "==", userId),
      where("favorite", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    const snippets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Snippet[];

    // Sort by updatedAt
    return snippets.sort((a, b) => {
      const dateA = timestampToDate(a.updatedAt);
      const dateB = timestampToDate(b.updatedAt);
      return dateB.getTime() - dateA.getTime();
    });
  },

  // Get all public snippets from all users
  async getAllPublic(): Promise<Snippet[]> {
    try {
      console.log("Firebase: Starting getAllPublic query...");
      const q = query(
        collection(db, "snippets"),
        where("isPublic", "==", true)
      );
      
      const querySnapshot = await getDocs(q);
      console.log("Firebase: Query completed, found", querySnapshot.docs.length, "documents");
      
      const snippets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Snippet[];

      // Sort by updatedAt in descending order (most recent first)
      const sortedSnippets = snippets.sort((a, b) => {
        const dateA = timestampToDate(a.updatedAt);
        const dateB = timestampToDate(b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      });

      console.log("Firebase: Processed and sorted snippets:", sortedSnippets);
      return sortedSnippets;
    } catch (error) {
      console.error("Firebase: Error in getAllPublic:", error);
      throw error;
    }
  },

  // Get all snippets (for admin)
  async getAll(): Promise<Snippet[]> {
    const querySnapshot = await getDocs(collection(db, "snippets"));
    const snippets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Snippet[];
    // Sort by updatedAt (newest first)
    return snippets.sort((a, b) => {
      const dateA = a.updatedAt?.toDate?.() || new Date(0);
      const dateB = b.updatedAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  },

  // Like/unlike snippet
  async likeSnippet(snippetId: string, userId: string): Promise<void> {
    console.log('🔍 likeSnippet called:', { snippetId, userId });
    
    const docRef = doc(db, "snippets", snippetId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error("Snippet not found");
    }
    
    const snippet = docSnap.data() as Snippet;
    console.log('📄 Snippet data:', { 
      title: snippet.title, 
      isPublic: snippet.isPublic, 
      userId: snippet.userId,
      currentUserId: userId 
    });
    
    const likedBy = snippet.likedBy || [];
    const currentLikes = snippet.likes || 0;
    
    if (likedBy.includes(userId)) {
      // Unlike
      console.log('👎 Unlike action');
      const newLikedBy = likedBy.filter(id => id !== userId);
      await updateDoc(docRef, {
        likes: currentLikes - 1,
        likedBy: newLikedBy,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Like
      console.log('👍 Like action');
      await updateDoc(docRef, {
        likes: currentLikes + 1,
        likedBy: [...likedBy, userId],
        updatedAt: serverTimestamp(),
      });

      // Create notification for public snippets only
      console.log('🔔 Checking notification conditions:', {
        isPublic: snippet.isPublic,
        snippetUserId: snippet.userId,
        currentUserId: userId,
        shouldCreateNotification: snippet.isPublic && snippet.userId !== userId
      });
      
      if (snippet.isPublic && snippet.userId !== userId) {
        console.log('✅ Creating notification...');
        try {
          // Get user info for notification
          const user = await userService.getById(userId);
          const userName = user?.name || 'Someone';
          console.log('👤 User info for notification:', { userName, userId });
          
          // Create notification
          const notificationId = await notificationService.createLikeNotification(
            snippetId,
            snippet.title,
            snippet.userId,
            userId,
            userName
          );
          console.log('✅ Notification created with ID:', notificationId);
        } catch (error) {
          console.error('❌ Error creating like notification:', error);
          // Don't fail the like operation if notification fails
        }
      } else {
        console.log('❌ Notification not created - conditions not met');
      }
    }
  },

  // Check if user has liked a snippet
  async hasUserLiked(snippetId: string, userId: string): Promise<boolean> {
    const snippet = await this.getById(snippetId);
    if (!snippet) return false;
    return snippet.likedBy?.includes(userId) || false;
  },
};

// Folder Services
export const folderService = {
  // Create new folder
  async create(folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, "folders"), {
      ...folder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Get folders by user
  async getByUser(userId: string): Promise<Folder[]> {
    const q = query(
      collection(db, "folders"),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const folders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Folder[];

    // Sort by name
    return folders.sort((a, b) => a.name.localeCompare(b.name));
  },

  // Update folder
  async update(id: string, updates: Partial<Folder>): Promise<void> {
    const docRef = doc(db, "folders", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  // Delete folder
  async delete(id: string): Promise<void> {
    const docRef = doc(db, "folders", id);
    await deleteDoc(docRef);
  },

  // Get all folders (for admin)
  async getAll(): Promise<Folder[]> {
    const querySnapshot = await getDocs(collection(db, "folders"));
    const folders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Folder[];
    // Sort by name
    return folders.sort((a, b) => a.name.localeCompare(b.name));
  },
};

// Tag Services
export const tagService = {
  // Create new tag
  async create(tag: Omit<Tag, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, "tags"), {
      ...tag,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Get tags by user
  async getByUser(userId: string): Promise<Tag[]> {
    const q = query(
      collection(db, "tags"),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const tags = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Tag[];

    // Sort by name
    return tags.sort((a, b) => a.name.localeCompare(b.name));
  },

  // Update tag
  async update(id: string, updates: Partial<Tag>): Promise<void> {
    const docRef = doc(db, "tags", id);
    await updateDoc(docRef, updates);
  },

  // Delete tag
  async delete(id: string): Promise<void> {
    const docRef = doc(db, "tags", id);
    await deleteDoc(docRef);
  },

  // Get all tags (for admin)
  async getAll(): Promise<Tag[]> {
    const querySnapshot = await getDocs(collection(db, "tags"));
    const tags = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Tag[];
    // Sort by name
    return tags.sort((a, b) => a.name.localeCompare(b.name));
  },
};

// User Services
export const userService = {
  // Create or update user
  async createOrUpdate(user: User): Promise<void> {
    const docRef = doc(db, "users", user.id);
    await setDoc(docRef, {
      ...user,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  // Get user by ID
  async getById(id: string): Promise<User | null> {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  },

  // Update user plan
  async updatePlan(userId: string, plan: 'free' | 'pro'): Promise<void> {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      plan,
      updatedAt: serverTimestamp(),
    });
  },

  // Get all users (for admin)
  async getAll(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
    // Sort by createdAt (newest first)
    return users.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  },

  // Delete user (for admin)
  async delete(id: string): Promise<void> {
    const docRef = doc(db, "users", id);
    await deleteDoc(docRef);
  },
};

// Storage Services
export const storageService = {
  // Upload file
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },

  // Delete file
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },
};

// Log Services
export const logService = {
  async getAll(): Promise<Log[]> {
    const querySnapshot = await getDocs(collection(db, "logs"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Log[];
  },
  async add(log: Omit<Log, 'id' | 'date'>): Promise<string> {
    const docRef = await addDoc(collection(db, "logs"), {
      ...log,
      date: serverTimestamp(),
    });
    return docRef.id;
  },
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "logs", id));
  },
};

// Support Ticket Services
export const supportService = {
  async getAll(): Promise<SupportTicket[]> {
    const querySnapshot = await getDocs(collection(db, "supportTickets"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SupportTicket[];
  },
  async add(ticket: Omit<SupportTicket, 'id' | 'date' | 'status' | 'replies'>): Promise<string> {
    const docRef = await addDoc(collection(db, "supportTickets"), {
      ...ticket,
      date: serverTimestamp(),
      status: 'Open',
      replies: [],
    });
    return docRef.id;
  },
  async reply(id: string, reply: { message: string; user: string }): Promise<void> {
    const docRef = doc(db, "supportTickets", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;
    const data = docSnap.data() as SupportTicket;
    const replies = data.replies || [];
    replies.push({ ...reply, date: serverTimestamp() });
    await updateDoc(docRef, { replies });
  },
  async close(id: string): Promise<void> {
    await updateDoc(doc(db, "supportTickets", id), { status: 'Closed' });
  },
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "supportTickets", id));
  },
};

// Admin Settings Service
export const adminSettingsService = {
  async get(): Promise<AdminSettings | null> {
    const docRef = doc(db, "settings", "admin");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docSnap.data() as AdminSettings;
  },
  async update(settings: Partial<AdminSettings>): Promise<void> {
    const docRef = doc(db, "settings", "admin");
    await setDoc(docRef, settings, { merge: true });
  },
};

// Notification Service
export const notificationService = {
  // Get all notifications (for admin)
  async getAll(): Promise<Notification[]> {
    const querySnapshot = await getDocs(collection(db, "notifications"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notification[];
  },

  // Get notifications by user
  async getByUser(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId)
      // No orderBy here to avoid requiring a composite index
    );
    
    const querySnapshot = await getDocs(q);
    const notifs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notification[];

    // Sort client-side by createdAt descending (newest first)
    return notifs.sort((a, b) => {
      const dateA = (a.createdAt as any)?.toDate?.()?.getTime() ?? 0;
      const dateB = (b.createdAt as any)?.toDate?.()?.getTime() ?? 0;
      return dateB - dateA;
    });
  },

  // Get unread notifications count for user
  async getUnreadCount(userId: string): Promise<number> {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("isRead", "==", false)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  },

  // Create notification
  async create(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, "notifications"), {
      ...notification,
      isRead: false,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Create like notification
  async createLikeNotification(
    snippetId: string, 
    snippetTitle: string, 
    snippetOwnerId: string, 
    likedByUserId: string, 
    likedByUserName: string
  ): Promise<string> {
    console.log('🔔 createLikeNotification called:', {
      snippetId,
      snippetTitle,
      snippetOwnerId,
      likedByUserId,
      likedByUserName
    });
    
    // Don't create notification if user likes their own snippet
    if (snippetOwnerId === likedByUserId) {
      console.log('❌ Skipping notification - user likes their own snippet');
      return '';
    }

    const notification: Omit<Notification, 'id' | 'createdAt'> = {
      title: "New Like on Your Snippet",
      message: `${likedByUserName} liked your snippet "${snippetTitle}"`,
      userId: snippetOwnerId,
      type: 'like',
      relatedId: snippetId,
      relatedType: 'snippet',
      fromUserId: likedByUserId,
      fromUserName: likedByUserName,
      isRead: false,
    };

    console.log('📝 Creating notification with data:', notification);
    
    try {
      const notificationId = await this.create(notification);
      console.log('✅ Notification created successfully with ID:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Error in createLikeNotification:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const docRef = doc(db, "notifications", notificationId);
    await updateDoc(docRef, { isRead: true });
  },

  // Mark all notifications as read for user
  async markAllAsRead(userId: string): Promise<void> {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("isRead", "==", false)
    );
    
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    querySnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { isRead: true });
    });
    
    await batch.commit();
  },

  // Update notification
  async update(id: string, updates: Partial<Notification>): Promise<void> {
    const docRef = doc(db, "notifications", id);
    await updateDoc(docRef, updates);
  },

  // Delete notification
  async delete(id: string): Promise<void> {
    const docRef = doc(db, "notifications", id);
    await deleteDoc(docRef);
  },

  // Delete all notifications for user
  async deleteAllForUser(userId: string): Promise<void> {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  },
}; 