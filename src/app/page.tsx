

// MissionPage.tsx
"use client"
import { useState } from "react";
import Image from "next/image";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import BalanceButton from "@/components/BalanceButton";
import { SiSolana } from "react-icons/si";
import { FundWalletButton } from "../components/FundWalletButton";
import { useLevel } from "@/context/LevelContext";
import { useRouter } from "next/navigation";
import { useProfiles } from "@/hooks/useProfile";
import { BsCoin } from "react-icons/bs";
import { useMissionActions , missionData} from "../hooks/useMissionActions";
import toast from "react-hot-toast";
//import { useWallet } from "@solana/wallet-adapter-react";
import { usePurchasedNFTs } from "@/hooks/usePurchasedNFTs";
import { levelConfigs } from "@/types/level";
import { NFT_DATA } from "@/utils/nfts";
import { useUser } from "@/context/UserContext";
import { IoCopy } from "react-icons/io5";


 // type MissionLevel = keyof typeof levelConfigs;

export default function MissionPage() {
  const [activeTab, setActiveTab] = useState("mission");
  const { solBalance, usdcBalance } = useWalletBalance();
  const {  userProfile } = useProfiles();
  const { setSelectedLevel } = useLevel();
  const router = useRouter();
  const { startLevel, fetchCharacterAddress } = useMissionActions();
  //const { publicKey } = useWallet();
  const { purchasedNFTs } = usePurchasedNFTs();
  const getBadgeImage = (xp: number): string => {
    if (xp >= 5000) return "/assets/badge1.png";
    if (xp >= 4000) return "/assets/badge2.png";
    if (xp >= 3000) return "/assets/badge3.png";
    if (xp >= 2000) return "/assets/badge4.png";
    return "/assets/badge5.png";
  };
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
      description:
        "Hunt mechanical  geared fish and gain XP to unlock the next level.",
      image: "/assets/badge5.png",
      requiredXP: 0,
      level: "level1",
    },
    {
      id: 2,
      title: "Seeker",
      description:
        "Hunt mechanical  geared fish and gain 1000XP to unlock the next level.",
      image: "/assets/badge4.png",
      requiredXP: 1000,
      level: "level2",
    },
    {
      id: 3,
      title: "Voyager",
      description: "Play for 300secs and gain 1500XP to unlock the next level.",
      image: "/assets/badge3.png",
      requiredXP: 10000,
      level: "level3",
    },
    {
      id: 4,
      title: "Expert",
      description: "Play for 350secs and gain 2500XP to unlock the next level.",
      image: "/assets/badge2.png",
      requiredXP: 25000,
      level: "level4",
    },
    {
      id: 5,
      title: "Master",
      description:
        "Play for 400secs and gain 5000XP to reclaim the Chrome Depths for your clan.",
      image: "/assets/badge1.png",
      requiredXP: 40000,
      level: "level5",
    },
  ];

 
  
  const purchasedNFTsOnly = NFT_DATA.filter((nft) =>
    purchasedNFTs.includes(nft.id)
  );
 const shortenAddress = (address: string) =>
   `${address.slice(0, 6)}...${address.slice(-4)}`;
  const isLevelUnlocked = (mission: (typeof missions)[0], index: number) => {
  
    if (mission.id === 1) return true;

    
    const hasEnoughXP = (userProfile?.xp ?? 0) >= mission.requiredXP;

  
    const prevMissionCompleted = userProfile ? parseInt(userProfile.level.replace("level", "")) >= mission.id - 1 : false
     

    return hasEnoughXP && prevMissionCompleted ;
  };

  const handleClick = async (level: MissionLevel) => {
        const loadingToast = toast.loading("Starting mission...");

    try {
    
      const characterAddress = await fetchCharacterAddress();
      if (!characterAddress) throw new Error("No character");

      let missionAddress = "";
      try {
        const result = await startLevel(level);
        missionAddress = result.missionAddress;
      } catch (error) {
        
        missionAddress = missionData[level]?.missionAddress || "";
      }

      setSelectedLevel({
        level,
        missionAddress,
        characterAddress, 
      });
      router.push("/quest");
    } catch (error) {
      toast.error("Failed to initialize mission");
    } finally {
      toast.dismiss(loadingToast); 
    }

  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-black text-white px-4 py-8 mb-16 lg:px-10 gap-16">
      <div className="flex flex-col shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] rounded-3xl p-2 w-full items-center gap-6 lg:flex-row lg:gap-3">
        <div className="w-full hidden md:flex h-64 lg:h-80 relative rounded-3xl overflow-hidden">
          <Image
            src="/assets/baner.png"
            alt="Banner"
            fill
            className="object-cover rounded-3xl"
          />
        </div>
        <div className="w-full md:hidden flex h-36 lg:h-80 relative rounded-3xl overflow-hidden">
          <Image
            src="/assets/baner2.png"
            alt="Banner"
            fill
            className="object-cover rounded-3xl"
          />
        </div>
        <div className="items-center lg:w-1/3 w-full bg-gray-950 gap-8 rounded-3xl p-6 flex flex-col justify-between">
          <h2 className="text-xl font-bold">🎯 Daily Reward</h2>
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center gap-3 w-full">
              <div className="flex justify-center rounded bg-[#a1f8d3] px-3 py-3 items-center">
                <SiSolana className="text-[#14f195] text-2xl" />
              </div>
              <div className="flex flex-col items-start justify-start w-full">
                <h1 className="font-bold text-">SOL</h1>
                <p className="text-sm">Solana</p>
              </div>
            </div>
            <div className="flex justify-end w-full  items-center gap-3">
              <BalanceButton
                balance={solBalance}
                decimals={3}
                currencySymbol=""
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center gap-3 w-full">
              <div className="flex justify-center rounded bg-[#d1b1f9] px-3 py-3 items-center">
                <BsCoin className="text-[#9945ff] text-3xl" />
              </div>
              <div className="flex flex-col items-start justify-start w-full">
                <h1 className="font-bold text-">USDC/SOL</h1>
                <p className="text-sm">Solana</p>
              </div>
            </div>
            <div className="flex justify-end w-full items-center gap-3">
              <BalanceButton
                balance={usdcBalance}
                decimals={2}
                currencySymbol="$"
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <div className="flex justify-center items-center w-full ">
              {isOnboarded && userProfile ? (
                <div className="flex justify-center text-2xl items-center w-full">
                  XP: <strong> {userProfile.xp} </strong>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-950 shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]">
                  XP: 0
                </div>
              )}
            </div>
          </div>
          <FundWalletButton />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "mission"
            ? missions.map((mission, index) => {
              const isUnlocked = isLevelUnlocked(mission, index);
              const isCurrent = userProfile?.level === mission.level;
              const progress = mission.requiredXP
                ? Math.min(
                  ((userProfile?.xp ?? 0) / mission.requiredXP) * 100,
                  100
                )
                : 100;
              return (
                <div
                  key={mission.id}
                  className={`relative bg-gray-950 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] p-4 rounded-xl transition ${!isUnlocked ? "opacity-50" : "hover:shadow-lg"
                    }`}>
                  <img
                    src={mission.image}
                    alt={mission.title}
                    className="w-full object-cover rounded-md mb-3"
                  />
                  <h3 className="text-lg font-bold mb-1">{mission.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {mission.description}
                  </p>
                  <p className="text-sm text-gray-400 mb-3">
                    {mission.requiredXP} XP
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
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
              
              <>
                {purchasedNFTsOnly.length > 0 ? (
                  purchasedNFTsOnly.map((nft) => (
                    <div
                      key={nft.id}
                      className="bg-gray-950 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] rounded-xl p-4 flex flex-col"
                    >
                      <div className="w-full flex items-center justify-center aspect-square overflow-hidden rounded-md mb-3">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-[70%] h-[100%]  object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-bold">{nft.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] text-xs px-3 py-2 rounded-md">
                          OWNED
                        </div>
                        <div>
                          {nft.currency} <strong>{nft.price}</strong>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        {userProfile?.nfts?.map((nftAddress) => (
                          <div key={nftAddress} className="flex items-center gap-1">
                            NFT: {shortenAddress(nftAddress)}
                            <IoCopy
                              className="cursor-pointer hover:text-gray-400"
                              onClick={() => navigator.clipboard.writeText(nftAddress)}
                              
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p>You haven't purchased any NFTs yet</p>
                    <button
                      onClick={() => setActiveTab("mission")}
                      className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
                    >
                      Complete missions to unlock NFTs
                    </button>
                  </div>
                )}
              </>
            )}
              
        </div>
      </div>
    </div>
  );
}