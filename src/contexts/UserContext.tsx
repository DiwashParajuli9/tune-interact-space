
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  isAdmin?: boolean;
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
      // For demo purposes, we'll create two user types:
      // 1. An admin user with email admin@example.com
      // 2. A regular user with any other email
      
      const email = prompt("Enter your email (use admin@example.com for admin access)") || "";
      const isAdmin = email.toLowerCase() === "admin@example.com";
      
      const mockUser = {
        id: isAdmin ? "admin-user-123" : "google-user-123",
        name: isAdmin ? "Admin User" : "Regular User",
        email: email,
        photoURL: "https://via.placeholder.com/150",
        isAdmin: isAdmin
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
