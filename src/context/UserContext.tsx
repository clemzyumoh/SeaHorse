"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  username: string;
  setUsername: (username: string) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  onboardUser: () => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState("");
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUsername = typeof window !== "undefined" ? localStorage.getItem("seahorse_username") : null;
    if (savedUsername) {
      setUsername(savedUsername);
      checkProfile(savedUsername);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkProfile = async (savedUsername: string) => {
    try {
      const res = await fetch(`/api/setup/checkProfile?username=${encodeURIComponent(savedUsername)}`);
      if (!res.ok) {
        throw new Error("Failed to check profile");
      }
      const data = await res.json();
      const onboarded = data.isOnboarded ?? false;
      setIsOnboarded(onboarded);
      if (!onboarded) {
        setUsername("");
        localStorage.removeItem("seahorse_username");
      }
    } catch (error) {
      console.error("Check profile error:", error);
      setUsername("");
      localStorage.removeItem("seahorse_username");
    } finally {
      setIsLoading(false);
    }
  };

  const onboardUser = async (): Promise<boolean> => {
    if (!username || username.trim().length < 4) {
      return false;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/setup/createProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Onboard error:", data);
        return false;
      }

      localStorage.setItem("seahorse_username", username);
      setIsOnboarded(true);
      return true;
    } catch (error) {
      console.error("Onboarding error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        isOnboarded,
        setIsOnboarded,
        isLoading,
        setIsLoading,
        onboardUser,
      }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
