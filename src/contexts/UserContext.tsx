
import React, { createContext, useContext } from "react";
import { useUser as useClerkUser, useAuth } from "@clerk/clerk-react";

type User = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
} | null;

type UserContextType = {
  user: User;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const { signOut: clerkSignOut } = useAuth();

  // Transform Clerk user to our User type
  const user: User = clerkUser
    ? {
        id: clerkUser.id,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        photoURL: clerkUser.imageUrl,
      }
    : null;

  const signInWithGoogle = async () => {
    // This is handled by Clerk's SignIn component
    return Promise.resolve();
  };

  const signOut = async () => {
    if (clerkSignOut) {
      await clerkSignOut();
    }
    return Promise.resolve();
  };

  return (
    <UserContext.Provider value={{ user, loading: !isLoaded, signInWithGoogle, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
