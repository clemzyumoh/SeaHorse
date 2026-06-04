"use client";

import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

interface ProfileType {
  username: string;
  xp: number;
  level: string;
  badges: string[];
  completedMissions: string[];
  nfts: string[];
  gold: number;
  gems: number;
}

export function useProfiles() {
  const { username } = useUser();
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [userProfile, setUserProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/leaderboard");
      if (!res.ok) {
        const text = await res.text();
        console.error("Leaderboard response:", text);
        throw new Error(`Failed to fetch profiles: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const allProfiles: ProfileType[] = (data?.profiles || []).map((profile: any) => ({
        username: profile.username,
        xp: profile.xp || 0,
        level: profile.level || "level1",
        badges: profile.badges || [],
        completedMissions: profile.completedMissions || [],
        nfts: profile.nfts || [],
        gold: profile.gold || 0,
        gems: profile.gems || 0,
      }));

      const sortedProfiles = allProfiles.sort((a, b) => b.xp - a.xp);
      setProfiles(sortedProfiles);
    } catch (err: any) {
      console.error("Error fetching profiles:", err);
      setError(err.message || "Failed to fetch profiles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    if (!username) {
      setUserProfile(null);
      return;
    }
    setUserProfile(profiles.find((p) => p.username === username) ?? null);
  }, [profiles, username]);

  return { profiles, userProfile, loading, error, refetch: fetchProfiles };
}
