

// "use client"
// import { createContext, useContext, useEffect, useState } from "react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import toast from "react-hot-toast";

// interface UserContextType {
//   username: string;
//   setUsername: (username: string) => void;
//   userPublicKey: string | null;
//   setuserPublicKey: (key: string | null) => void;
//   isOnboarded: boolean;
//   setIsOnboarded: (value: boolean) => void;
//   isLoading: boolean;
//   setIsLoading: (value: boolean) => void;
//   onboardUser: () => Promise<boolean>;
//   connected: boolean;
//   setConnected: (value: boolean) => void;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export function UserProvider({ children }: { children: React.ReactNode }) {
//   const { publicKey, connected } = useWallet();
//   const [username, setUsername] = useState("");
//   const [userPublicKey, setuserPublicKey] = useState<string | null>(null);
//   const [isOnboarded, setIsOnboarded] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [connectedState, setConnected] = useState(false);

//   useEffect(() => {
//     const checkProfile = async () => {
//       if (!publicKey || !connected) {
//         setIsLoading(false);
//         return
//       }
        

//       try {
//        // setIsLoading(true);
//         const res = await fetch(
//           `/api/setup/checkProfile?publicKey=${publicKey.toBase58()}`
//         );
//         if (!res.ok) {
//           const text = await res.text();
//           console.error("Check profile response:", text);
//           throw new Error(
//             `Failed to check profile: ${res.status} ${res.statusText}`
//           );
//         }

//         const data = await res.json();
//         if (data.isOnboarded) {
//           setUsername(data.username || "");
//           setuserPublicKey(publicKey.toBase58());
//           setIsOnboarded(true);
//           setConnected(true);
//         }
//       } catch (error) {
//         console.error("Check profile error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkProfile();
//   }, [publicKey, connected]);

//   const onboardUser = async (): Promise<boolean> => {
//     if (!username || !userPublicKey) {
//       toast.error("Missing username or public key");
//       return false;
//     }

//     try {
//       setIsLoading(true);
//       const res = await fetch("/api/setup/createProfile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, userPublicKey }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         console.error("Create profile error:", data);
//         throw new Error(data.error || "Failed to create profile");
//       }

//       setIsOnboarded(true);
//       setConnected(true);
//       toast.success("Profile created successfully");
//       return true;
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error:any) {
//       console.error("Onboarding error:", error);
//       toast.error(error.message || "Failed to create profile");
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <UserContext.Provider
//       value={{
//         username,
//         setUsername,
//         userPublicKey,
//         setuserPublicKey,
//         isOnboarded,
//         setIsOnboarded,
//         isLoading,
//         setIsLoading,
//         onboardUser,
//         connected: connectedState,
//         setConnected,
//       }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// }
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

interface UserContextType {
  username: string;
  setUsername: (username: string) => void;
  userPublicKey: string | null;
  setuserPublicKey: (key: string | null) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  onboardUser: () => Promise<boolean>;
  connected: boolean;
  setConnected: (value: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected } = useWallet();
  const [username, setUsername] = useState("");
  const [userPublicKey, setuserPublicKey] = useState<string | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedState, setConnected] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!publicKey || !connected) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/setup/checkProfile?publicKey=${publicKey.toBase58()}`
        );
        if (!res.ok) {
          throw new Error(`Failed to check profile: ${res.statusText}`);
        }

        const data = await res.json();
        if (data.isOnboarded) {
          setUsername(data.username || "");
          setuserPublicKey(publicKey.toBase58());
          setIsOnboarded(true);
          setConnected(true);
        }
      } catch (error) {
        console.error("Check profile error:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [publicKey, connected]);

  const onboardUser = async (): Promise<boolean> => {
    if (!username || !userPublicKey) {
     // toast.error("Missing username or public key");
      return false;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/setup/createProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, userPublicKey }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create profile");
      }

      setIsOnboarded(true);
      setConnected(true);
      return true;
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error.message || "Failed to create profile");
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
        userPublicKey,
        setuserPublicKey,
        isOnboarded,
        setIsOnboarded,
        isLoading,
        setIsLoading,
        onboardUser,
        connected: connectedState,
        setConnected,
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