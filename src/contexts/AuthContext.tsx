"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { userService, User } from "@/lib/firebaseServices";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  AdditionalUserInfo,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { serverTimestamp } from "firebase/firestore";
import { User as AppUser } from "@/lib/firebaseServices";
import { Timestamp } from "firebase/firestore";

// Define the context type
interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUser: (data: Partial<AppUser>) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => { },
  signUp: async () => { },
  signInWithGoogle: async () => { },
  signOut: async () => { },
  refreshUserData: async () => { },
  updateUser: async () => { },
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();

  // Handle redirect in useEffect to avoid setState during render
  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
      setShouldRedirect(false);
    }
  }, [shouldRedirect, router]);

  // Check if user is admin
  useEffect(() => {
    if (user && user.email) {
      const isUserAdmin = user.email === 'raeesrana727@gmail.com' || user.email === 'rubazjamshed@gmail.com';
      console.log('Admin check:', { email: user.email, isAdmin: isUserAdmin });
      setIsAdmin(isUserAdmin);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          // Fetch user from Firestore
          let appUser = await userService.getById(fbUser.uid);
          // If not found, create
          if (!appUser) {
            appUser = {
              id: fbUser.uid,
              email: fbUser.email!,
              name: fbUser.displayName || fbUser.email!.split('@')[0],
              plan: 'free',
              createdAt: serverTimestamp() as any,
              lastLoginAt: serverTimestamp() as any,
            };
            await userService.createOrUpdate(appUser);
          }
          setUser(appUser);
        } catch (error) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign in successful for:", email);
      // onAuthStateChanged will handle user state
      return { data: userCredential.user, error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      // Provide more user-friendly error messages
      let errorMessage = "An error occurred during sign in";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled";
      }
      return { data: null, error: { ...error, message: errorMessage } };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Attempting sign up for:", email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Sign up successful for:", email);
      // onAuthStateChanged will handle user state
      return { data: userCredential.user, error: null };
    } catch (error: any) {
      console.error("Sign up error:", error);
      // Provide more user-friendly error messages
      let errorMessage = "An error occurred during sign up";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please choose a stronger password";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/password accounts are not enabled. Please contact support";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection";
      }
      return { data: null, error: { ...error, message: errorMessage } };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("Attempting Google sign in");
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      console.log("Google sign in successful");

      // Check if this is a new user (first time signing in with Google)
      const isNewUser = (userCredential as any).additionalUserInfo?.isNewUser;

      if (isNewUser && userCredential.user) {
        console.log("Creating new user profile for Google user");
        // Create user profile in Firestore for new Google users
        const userProfile = {
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
          bio: '',
          location: '',
          website: '',
          profileImage: userCredential.user.photoURL || '',
          birthdate: '',
          gender: '',
          country: '',
          createdAt: Timestamp.fromDate(new Date()),
          lastLoginAt: Timestamp.fromDate(new Date()),
          plan: 'free' as const,
          settings: {
            theme: 'system' as const,
            language: 'en',
            notifications: true
          },
          active: true
        };

        // Import userService here to avoid circular dependency
        const { userService } = await import('../lib/firebaseServices');
        await userService.createOrUpdate(userProfile);
        console.log("New user profile created successfully");
      }

      // onAuthStateChanged will handle user state
      return { data: userCredential.user, error: null };
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      // Provide more user-friendly error messages
      let errorMessage = "An error occurred during Google sign-in";
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was cancelled";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Sign-in popup was blocked. Please allow popups for this site";
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "An account already exists with this email using a different sign-in method";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "Google sign-in is not allowed from this domain. Please contact support or try again later.";
      }
      return { data: null, error: { ...error, message: errorMessage } };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
    setShouldRedirect(true);
  };

  const updateUser = async (updates: Partial<AppUser>) => {
    if (!user) return;
    try {
      // Update Firestore user
      const currentUser = await userService.getById(user.id);
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        await userService.createOrUpdate(updatedUser);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const refreshUserData = async () => {
    if (!user) return;
    try {
      const currentUser = await userService.getById(user.id);
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      refreshUserData,
      updateUser,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}