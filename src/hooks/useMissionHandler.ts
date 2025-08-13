
import { useUser } from "@/context/UserContext";
import { useProfiles } from "@/hooks/useProfile";
import toast from "react-hot-toast";

export function useMissionHandler() {
  const { userPublicKey, username } = useUser();
  const { userProfile, refetch } = useProfiles();

  const calculateLevel = (xp: number): string => {
    return (Math.floor(xp / 1000) + 1).toString();
  };

    const completeMission = async (
      missionId: string,
      xpReward: number,
      badgeUrl?: string
    ) => {
      try {
        if (!userPublicKey || !username) {
          throw new Error("User not authenticated");
        }

        const newXp = (userProfile?.xp || 0) + xpReward;
        const newLevel = calculateLevel(newXp);

        const response = await fetch("/api/setup/updatePlatformData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userPublicKey,
            xp: xpReward.toString(),
            level: newLevel,
            badgeUrl:
              badgeUrl && !userProfile?.completedMissions.includes(missionId)
                ? badgeUrl
                : undefined,
            missionId: badgeUrl ? missionId : undefined,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to update profile");
        }

        toast.success(`Mission completed! +${xpReward} XP`);
        await refetch();
        return data;
      } catch (error: any) {
        console.error("Mission completion error:", error);
        toast.error(error.message || "Failed to complete mission");
        return null;
      }
    };

  const claimDailyReward = async (xpReward: number) => {
    try {
      if (!userPublicKey || !username) {
        throw new Error("User not authenticated");
      }

      const newXp = (userProfile?.xp || 0) + xpReward;
      const newLevel = calculateLevel(newXp);

      const response = await fetch("/api/setup/updatePlatformData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPublicKey,
          xp: xpReward.toString(),
          level: newLevel,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success(`Daily reward claimed! +${xpReward} XP`);
      await refetch(); // Refresh profiles
      return data;
    } catch (error:any) {
      console.error("Daily claim error:", error);
      toast.error(error.message || "Failed to claim daily reward");
      return null;
    }
  };

  return { completeMission, claimDailyReward };
}