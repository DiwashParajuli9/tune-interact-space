
import { useState, useEffect, createContext, useContext } from "react";

export type UserProfile = {
  name: string;
  avatarUrl: string | null;
};

const defaultProfile: UserProfile = {
  name: "User",
  avatarUrl: null,
};

const UserProfileContext = createContext<{
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
}>({
  profile: defaultProfile,
  updateProfile: () => {},
});

export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error("Error parsing saved profile:", error);
      }
    }
  }, []);

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...newProfile };
      
      // Save to localStorage
      localStorage.setItem("userProfile", JSON.stringify(updated));
      
      return updated;
    });
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
