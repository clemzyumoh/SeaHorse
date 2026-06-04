"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useProfiles } from "@/hooks/useProfile";

const routeLabels: Record<string, string> = {
  "/": "Mission-Hub",
  "/quest": "Quest",
  "/nft": "NFT",
  "/ranking": "Ranking",
};

const badgeImages: Record<string, string> = {
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

const getBadgeImage = (level?: string) => badgeImages[getBadgeLevel(level)] || "/assets/badge1.png";

export default function Header() {
  const pathname = usePathname();
  const { username } = useUser();
  const { userProfile } = useProfiles();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentLabel = routeLabels[pathname] || "SEAHORSE";

  return (
    <motion.div className="fixed top-0 lg:left-60 bg-blac right-0 lg:w-[80vw] w-full overflow-hidden shadow-[0_2px_2px_#040f4c] border-b-#040f4c  bg-transparent flex justify-between items-center p-4 z-40 text-white">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">{currentLabel}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="font-bold text-sm">{username || "Guest"}</span>
          <span className="text-xs text-gray-300">
            {userProfile ? `XP ${userProfile.xp}` : "No profile"}
          </span>
        </div>
        <div className="rounded-full w-12 h-12 border-2 border-yellow-400 overflow-hidden">
          <Image
            src={getBadgeImage(userProfile?.level)}
            alt="Badge"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}
