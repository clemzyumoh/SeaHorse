"use client";
import { useState } from "react";
import Image from "next/image";
import { useProfiles } from "@/hooks/useProfile";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const badges = ["Novice", "Seeker", "Voyager", "Expert", "Master"];
const badgeImages: { [key: string]: string } = {
  Novice: "/assets/Badge5.png",
  Seeker: "/assets/Badge4.png",
  Voyager: "/assets/Badge3.png",
  Expert: "/assets/Badge2.png",
  Master: "/assets/Badge1.png",
};

const getBadgeLevel = (level?: string): string => {
  if (!level) return "Novice";
  if (level === "level5") return "Master";
  if (level === "level4") return "Expert";
  if (level === "level3") return "Voyager";
  if (level === "level2") return "Seeker";
  return "Novice";
};

const getBadgeImage = (level?: string): string => {
  return badgeImages[getBadgeLevel(level)] || "/assets/badge1.png";
};

const getLevelName = (level?: string): string => {
  const levelMap: Record<string, string> = {
    level1: "Novice",
    level2: "Seeker",
    level3: "Voyager",
    level4: "Expert",
    level5: "Master",
  };
  return levelMap[level || "level1"] || "Unranked";
};

export default function LeaderboardPage() {
  const router = useRouter();
  const { profiles, userProfile, loading, error } = useProfiles();
  const { username, setUsername, setIsOnboarded } = useUser();
  const [visibleProfiles, setVisibleProfiles] = useState(5);

  const handleViewAll = () => {
    setVisibleProfiles((prev) => (prev >= profiles.length ? 5 : profiles.length));
  };

  const handleLogout = () => {
    setIsOnboarded(false);
    setUsername("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("seahorse_username");
    }
    router.push("/onboard");
    toast.success("Logged out successfully!");
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-black text-white mb-16 py-4 md:px-16 gap-16">
      <div className="flex lg:flex-row flex-col items-center justify-center w-full gap-8 p-4">
        <div className="flex flex-col gap-4 w-full">
          <div className="bg-gray-950 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] rounded-2xl p-4">
            <h2 className="text-2xl font-bold mb-4">Your Badge</h2>
            <div className="flex justify-between items-center">
              {badges.map((badge) => (
                <div
                  key={badge}
                  className={`flex flex-col items-center ${
                    badge === getBadgeLevel(userProfile?.level)
                      ? "opacity-100"
                      : "opacity-30"
                  }`}>
                  <Image
                    src={badgeImages[badge]}
                    alt={badge}
                    width={300}
                    height={300}
                    className="md:w-20 md:h-20 w-10 h-10 object-contain"
                  />
                  <span className="text-xs font-bold mt-1">{badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-950 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] rounded-2xl p-4">
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            {loading ? (
              <div>Loading leaderboard...</div>
            ) : error ? (
              <div className="text-red-500">Error: {error}</div>
            ) : profiles.length === 0 ? (
              <div>No profiles available</div>
            ) : (
              <div className="flex flex-col gap-6">
                {profiles.slice(0, visibleProfiles).map((user, index) => (
                  <div
                    key={user.username}
                    className="grid md:grid-cols-4 grid-cols-3 md:gap-6 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] rounded-xl px-3 py-2 items-center text-xs md:text-lg">
                    <span className="font-bold hidden md:block text-center">#{index + 1}</span>
                    <div className="flex items-center gap-2">
                      <Image
                        src={getBadgeImage(user.level)}
                        alt={user.username}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span>{user.username}</span>
                    </div>
                    <span className="text-center">{user.xp} XP</span>
                    <span className="text-end md:text-start px-2 py-1">
                      {getLevelName(user.level)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleViewAll}
              className="mt-3 w-full bg-yellow-400 font-bold my-8 text-white py-2 rounded-xl text-sm hover:bg-yellow-500">
              {visibleProfiles >= profiles.length ? "Showing All" : "View All"}
            </button>
          </div>
        </div>

        <div className="flex w-full lg:w-1/2 bg-gray-950 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] rounded-2xl p-6 flex-col items-center">
          <Image
            src={
              userProfile && userProfile.badges?.length > 0
                ? userProfile.badges[userProfile.badges.length - 1]
                : getBadgeImage(userProfile?.level)
            }
            alt="Profile"
            width={80}
            height={80}
            className="w-full h-full shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] rounded-full mb-4"
          />
          <p className="text-sm mb-1">
            Welcome to the Leaderboard, <strong>{username}</strong>
          </p>
          <p className="text-sm my-4">
            You are on level <strong>{getLevelName(userProfile?.level || "level1")}</strong>
          </p>
          <p className="text-sm my-4">
            XP <strong>{userProfile?.xp || "0"}</strong>
          </p>
          <p className="text-sm">
            Ranked: <strong>#{profiles.findIndex((p) => p.username === userProfile?.username) + 1 || "N/A"}</strong>
          </p>
          <div className="my-5 font-bold space-y-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 py-4 px-8 rounded shadow-[2px_2px_2px_#040f4c] text-yellow-400 dark:text-gray-100 hover:border hover:border-yellow-400 border-yellow-400 cursor-pointer hover:scale-100 ">
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
