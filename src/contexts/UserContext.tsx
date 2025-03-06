
import React, { createContext, useContext, useState, useEffect } from "react";

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
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Mock Google sign-in for now
      // In a real implementation, this would use Google's OAuth flow
      const mockUser = {
        id: "google-user-123",
        name: "Google User",
        email: "user@example.com",
        photoURL: "https://via.placeholder.com/150",
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return Promise.resolve();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return Promise.reject(error);
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("user");
    return Promise.resolve();
  };

  return (
    <UserContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
