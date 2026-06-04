"use client";
import { useState } from "react";
import Image from "next/image";
import { useLevel } from "@/context/LevelContext";
import { useRouter } from "next/navigation";
import { useProfiles } from "@/hooks/useProfile";
import { useMissionActions, missionData } from "@/hooks/useMissionActions";
import toast from "react-hot-toast";
import { usePurchasedNFTs } from "@/hooks/usePurchasedNFTs";
import { levelConfigs } from "@/types/level";
import { NFT_DATA } from "@/utils/nfts";
import { useUser } from "@/context/UserContext";
import banner from "/assets/baner2.png";

export default function MissionPage() {
  const [activeTab, setActiveTab] = useState("mission");
  const { userProfile } = useProfiles();
  const { setSelectedLevel } = useLevel();
  const router = useRouter();
  const { startLevel, fetchCharacterAddress } = useMissionActions();
  const { purchasedNFTs } = usePurchasedNFTs();
  const { isOnboarded } = useUser();

  type MissionLevel = keyof typeof levelConfigs;

  const missions: {
    id: number;
    title: string;
    description: string;
    image: string;
    requiredXP: number;
    level: MissionLevel;
  }[] = [
    {
      id: 1,
      title: "Novice",
      description: "Hunt mechanical geared fish for 150secs and gain 500XP to unlock the next level.",
      image: "/assets/Badge5.png",
      requiredXP: 0,
      level: "level1",
    },
    {
      id: 2,
      title: "Seeker",
      description: "Hunt mechanical geared fish for 200secs and gain 1000XP to unlock the next level.",
      image: "/assets/Badge4.png",
      requiredXP: 1000,
      level: "level2",
    },
    {
      id: 3,
      title: "Voyager",
      description: "Play for 300secs and gain 1500XP to unlock the next level.",
      image: "/assets/Badge3.png",
      requiredXP: 10000,
      level: "level3",
    },
    {
      id: 4,
      title: "Expert",
      description: "Play for 350secs and gain 2500XP to unlock the next level.",
      image: "/assets/Badge2.png",
      requiredXP: 25000,
      level: "level4",
    },
    {
      id: 5,
      title: "Master",
      description: "Play for 400secs and gain 5000XP to reclaim the Chrome Depths for your clan.",
      image: "/assets/Badge1.png",
      requiredXP: 40000,
      level: "level5",
    },
  ];

  const purchasedNFTsOnly = NFT_DATA.filter((nft) => purchasedNFTs.includes(nft.id));

  const isLevelUnlocked = (mission: (typeof missions)[0], _index: number) => {
    if (mission.id === 1) return true;
    const hasEnoughXP = (userProfile?.xp ?? 0) >= mission.requiredXP;
    const prevMissionCompleted = userProfile
      ? parseInt(userProfile.level.replace("level", "")) >= mission.id - 1
      : false;
    return hasEnoughXP && prevMissionCompleted;
  };

  const handleClick = async (level: MissionLevel) => {
    const loadingToast = toast.loading("Starting mission...");
    try {
      const characterAddress = await fetchCharacterAddress();
      if (!characterAddress) throw new Error("No character");

      const result = await startLevel(level);
      setSelectedLevel({
        level,
        missionAddress: result.missionAddress,
        characterAddress,
      });
      router.push("/quest");
    } catch (_error) {
      toast.error("Failed to initialize mission");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-black text-white px-4 py-8 mb-16 lg:px-10 gap-16">
      <div className="flex flex-col shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] rounded-3xl p-0  gap-6 lg:flex-row lg:gap-3">
        <div className="w-full  flex h-36 lg:h-80 relative rounded-3xl overflow-hidden">
          <Image src="/assets/baner2.png" alt="Banner" fill className="object-cover  rounded-3xl" />
        </div>
        <div className="items-center lg:w-1/3 w-full bg-gray-950 gap-8 rounded-3xl p-6 flex flex-col justify-between">
          <h2 className="text-xl font-bold">🎯 Player Stats</h2>
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-sm text-gray-400">XP</p>
              <p className="text-2xl font-bold">{userProfile?.xp ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Level</p>
              <p className="text-2xl font-bold">{userProfile?.level ?? "level1"}</p>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-sm text-gray-400">Gold</p>
              <p className="text-2xl font-bold">{userProfile?.gold ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Gems</p>
              <p className="text-2xl font-bold">{userProfile?.gems ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex gap-4 shadow-[2px_2px_2px_#040f4c] mb-6">
          {["mission", "nft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 text-sm font-medium uppercase ${
                activeTab === tab
                  ? "border-b-2 border-yellow-400 text-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}>
              {tab === "mission" ? "Mission" : "NFT "}
            </button>
          ))}
        </div>
        <div className="min-h-[600px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "mission"
            ? missions.map((mission, index) => {
                const isUnlocked = isLevelUnlocked(mission, index);
                const isCurrent = userProfile?.level === mission.level;
                const progress = mission.requiredXP
                  ? Math.min(((userProfile?.xp ?? 0) / mission.requiredXP) * 100, 100)
                  : 100;
                return (
                  <div
                    key={mission.id}
                    className={`relative bg-gray-950 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] p-4 rounded-xl transition ${
                      !isUnlocked ? "opacity-50" : "hover:shadow-lg"
                    }`}>
                    <Image
                      src={mission.image}
                      alt={mission.title}
                      width={300}
                      height={300}
                      className="w-full object-cover rounded-md mb-3"
                    />
                    <h3 className="text-lg font-bold mb-1">{mission.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{mission.description}</p>
                    <p className="text-sm text-gray-400 mb-3">{mission.requiredXP} XP</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    {isUnlocked ? (
                      <button
                        onClick={() => handleClick(mission.level)}
                        className="bg-yellow-400 text-[#040f4c] font-bold cursor-pointer px-4 py-1 rounded my-3 hover:bg-yellow-500 text-sm">
                        {isCurrent ? "Continue" : "Play"}
                      </button>
                    ) : (
                      <button
                        className="bg-gray-600 text-white px-4 py-1 rounded text-sm cursor-not-allowed"
                        disabled>
                        Locked
                      </button>
                    )}
                  </div>
                );
              })
            : activeTab === "nft" && (
                <div className="col-span-full text-gray-400 flex items-center justify-center">Unlock NFTs by completing missions.</div>
              )}
        </div>
      </div>
    </div>
  );
}
