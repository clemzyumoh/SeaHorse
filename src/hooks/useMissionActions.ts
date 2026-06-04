"use client";

import { useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { useProfiles } from "@/hooks/useProfile";
import toast from "react-hot-toast";

export const missionData = {
  level1: {
    missionAddress: "mission-1",
    badgeUrl: "/assets/Badge5.png",
    xpGoal: 500,
  },
  level2: {
    missionAddress: "mission-2",
    badgeUrl: "/assets/Badge4.png",
    xpGoal: 1000,
  },
  level3: {
    missionAddress: "mission-3",
    badgeUrl: "/assets/Badge3.png",
    xpGoal: 1500,
  },
  level4: {
    missionAddress: "mission-4",
    badgeUrl: "/assets/Badge2.png",
    xpGoal: 2500,
  },
  level5: {
    missionAddress: "mission-5",
    badgeUrl: "/assets/Badge1.png",
    xpGoal: 5000,
  },
};

export const useMissionActions = () => {
  const { username } = useUser();
  const { userProfile } = useProfiles();

  const fetchCharacterAddress = async () => {
    return username || "guest-character";
  };

  const startLevel = async (level: keyof typeof missionData) => {
    const mission = missionData[level];
    if (!mission) {
      throw new Error(`No mission data for level: ${level}`);
    }

    const characterAddress = await fetchCharacterAddress();
    return {
      missionAddress: mission.missionAddress,
      characterAddress,
    };
  };

  const completeLevel = async (
    level: keyof typeof missionData,
    xpEarned: number,
    score: number,
    missionAddress: string,
    characterAddress: string
  ) => {
    const mission = missionData[level];
    if (!mission) {
      return;
    }

    if (!username) {
      toast.error("You must be logged in to complete the mission");
      return;
    }

    if (xpEarned < mission.xpGoal) {
      throw new Error(`XP goal not met: ${xpEarned}/${mission.xpGoal}`);
    }

    try {
      const response = await fetch("/api/setup/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          xp: xpEarned,
          level,
          badgeUrl: mission.badgeUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Mission completed successfully!");
    } catch (error) {
      console.error("Failed to complete mission/update profile:", error);
      toast.error("Mission completion/update failed");
      throw error;
    }
  };

  return { startLevel, completeLevel, fetchCharacterAddress };
};
