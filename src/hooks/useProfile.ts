"use client"


import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface Profile {
  identity: string;
  username: string;
  xp: number;
  pfp?: string;
  bio?: string;
  level: string;
  badges: string[];
  completedMissions: string[];
  userId: number; // Add userId
  nfts: string[]; // Add this line
}

export function useProfiles() {
  const { publicKey, connected } = useWallet();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

      const fetchProfiles = async () => {
        try {
          setLoading(true);
          setError(null);

          const res = await fetch("/api/leaderboard");
          if (!res.ok) {
            const text = await res.text();
            console.error("Leaderboard response:", text);
            throw new Error(
              `Failed to fetch profiles: ${res.status} ${res.statusText}`
            );
          }

          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error("Non-JSON response:", text);
            throw new Error("Received non-JSON response from server");
          }

          const data = await res.json();

          const allProfiles: Profile[] = (data?.profilearry || []).map(
            (profile: any) => ({
              identity: profile.identity,
              username: profile.info.name,
              xp: parseInt(profile.platformData.xp, 10) || 0,
              pfp: profile.info.pfp,
              bio: profile.info.bio,
              level:
                profile.platformData.custom?.add
                  ?.find((s: string) => s.startsWith("level,"))
                  ?.split(",")[1] || "1",
              badges:
                profile.platformData.custom?.add
                  ?.filter((s: string) => s.startsWith("badge,"))
                  ?.map((s: string) => s.split(",")[1]) || [],
              completedMissions:
                profile.platformData.custom?.add
                  ?.filter((s: string) => s.startsWith("completedMissions,"))
                  ?.map((s: string) => s.split(",")[1])
                  ?.filter(Boolean) || [],
              userId: profile.userId, // Add userId
              nfts:
                profile.platformData.custom?.add
                  ?.find((s: string) => s.startsWith("nfts,"))
                  ?.split(",")[1]
                  ?.split("|")
                  .filter(Boolean) || [], // Add this
            })
          );

          const sortedProfiles = allProfiles.sort((a, b) => b.xp - a.xp);
          setProfiles(sortedProfiles);

      const user = sortedProfiles.find(
        (p) => p.identity === publicKey?.toBase58()
      );
      setUserProfile(user || null);
          setUserProfile(user || null);
        } catch (err: any) {
          console.error("Error fetching profiles:", err);
          setError(err.message || "Failed to fetch profiles");
        } finally {
          setLoading(false);
        }
      };
  useEffect(() => {
    if (!publicKey || !connected) {
      setProfiles([]);
      setUserProfile(null);
      setLoading(false);
      return;
    }

  

    fetchProfiles();
  }, [publicKey, connected]);

  return { profiles, userProfile, loading, error, refetch: fetchProfiles };
}