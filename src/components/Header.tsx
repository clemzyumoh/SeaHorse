"use client";
import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";


import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import toast from "react-hot-toast";
import { RxAvatar } from "react-icons/rx";
import { useUser } from "@/context/UserContext";
import { useProfiles } from "@/hooks/useProfile";

const routeLabels: Record<string, string> = {
  "/": "Mission-Hub",
  "/quest": "Quest",
  "/nft": "NFT",
  "/ranking": "Ranking",
};
const Header = () => {
  const { userProfile } = useProfiles();

  
const badgeImages: { [key: string]: string } = {
  Novice: "/assets/badge5.png",
  Seeker: "/assets/badge4.png",
  Voyager: "/assets/badge3.png",
  Expert: "/assets/badge2.png",
  Master: "/assets/badge1.png",
};

const getBadgeLevel = (level?: string): string => {
  if (!level) return "Novice"; // Default if undefined
  if (level === "level5") return "Master";
  if (level === "level4") return "Expert";
  if (level === "level3") return "Voyager";
  if (level === "level2") return "Seeker";
  return "Novice";
};

const getBadgeImage = (level?: string): string => {
  return badgeImages[getBadgeLevel(level)] || "/assets/badge1.png";
};


  const pathname = usePathname();

  const {  isOnboarded, setuserPublicKey, setConnected } = useUser();

  const currentLabel: string = routeLabels[pathname] || "SEAHORSE";
  const { connect, connected, select, wallets, wallet, publicKey } =
    useWallet();

  const [triggerConnect, setTriggerConnect] = useState(false);

 
  
  const handleConnect = async () => {
    if (!wallet && wallets.length > 0) {
      await select(wallets[0].adapter.name);
      setTriggerConnect(true);
      return;
    }

    if (wallet && !connected) {
      try {
        await connect();
        toast.success("Wallet Connected!");
        setuserPublicKey(publicKey?.toBase58() || null);
        setConnected(true); 
      } catch (error) {
        toast.error("Connection failed");
      }
    }
  };
  
  useEffect(() => {
    const doConnect = async () => {
      if (triggerConnect && wallet && !connected) {
        try {
          await connect();
          toast.success("Wallet Connected!");
        } catch (error) {
          console.error("Connection error:", error);
          toast.error("Connection failed");
        } finally {
          setTriggerConnect(false); // clear flag
        }
      }
    };

    doConnect();
  }, [wallet, triggerConnect, connect, connected]);

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const shortenAddressMob = (address: string) =>
    `${address.slice(0, 3)}...${address.slice(-3)}`;

  return (
    <motion.div className="fixed  top-0 lg:left-60  gap-28  right-0 lg:w-[80vw] w-full   overflow-hidden lg:border-none shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] lg:shadow-none  lg:bg-transparent   flex justify-between items-center p-4 z-40 text-white   bg-gray-950">
      {/* 🔹 Laptop Layout */}
      <div className="hidden lg:flex items-center overflow-hidden  justify-center w-[80vw] ">
        <div className="flex justify-center items-center w-[80vw] ">
          {/* Logo / Title */}
          <div className="flex  justify-center w-full   items-center">
            <h1 className="text-3xl font-bold">{currentLabel}</h1>
          </div>

          {/* Right Side: Dark Mode Toggle & User Icon */}
          <div className="flex items-center justify-center w-full  space-x-4">
            {/* Search Bar */}
            <div className="flex items-center border-2 border-[#EBF2FD] shadow p-2 max-w-[30vw]   rounded-2xl  ">
              <div className="text-neutral-400 text-xl mr-16">
                <FaSearch className="" />
              </div>
              <input
                type="text"
                placeholder="Search ..."
                className="bg-transparent focus:outline-none w-[80vw] text-neutral-500"
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center justify-center gap-4"></div>
            </div>
          </div>
          <div className="flex justify-center  w-full items-center gap-4 ">
            <div className="flex justify-center items-center w-ful">
              {isOnboarded && userProfile ? (
                <div className="flex justify-center items-center gap-3 w-full">
                  <span className="text-2xl  bg-gray-950 px-1 rounded">
                    {userProfile.xp || 0} XP
                  </span>
                  <div className="rounded-full w-10 h-10 border-2 border-yellow-400 flex justify-center items-center">
                    <Image
                      src={
                        userProfile.badges?.length > 0
                          ? userProfile.badges[userProfile.badges.length - 1]
                          : getBadgeImage(userProfile.level)
                      }
                      alt="Badge"
                      width={40}
                      height={40}
                      className="w-full h-full rounded-full object-cover"
                      
                    />
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]">
                  <RxAvatar className="w-full h-full" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-center w-">
              {!connected || !publicKey ? (
                <button
                  onClick={handleConnect}
                  className="cursor-pointer px-3 py-2  rounded-xl from-transparent to-transparent border-2 border-yellow-400 text-yellow-400  ">
                  Connect
                </button>
              ) : (
                <div className="flex justify-center gap-3 items-center w-full">
                  <span>{shortenAddress(publicKey.toBase58())}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Mobile Layout */}
      <div className="lg:hidden flex  w-full justify-between  items-center">
        {/* Left: Settings Button */}

        <div className="flex  justify-center items-center">
          <div className="flex items-end-safe justify-items-end-safe">
            <h1 className="font-bold text-2xl bg-gradient-to-br from-[#9945ff] via-yellow-400 to-yellow-400 text-transparent bg-clip-text ">
              SeaHorse
            </h1>
          </div>
        </div>

        {/* Right: Menu Toggle & Search Icon */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex justify-center items-center ">
            {isOnboarded && userProfile ? (
              <div className="flex justify-center items-center w-full">
                

                <div className="rounded-full w-10 h-10 ml-2 border-2 border-yellow-400 flex justify-center items-center">
                  <Image
                    src={
                      userProfile.badges?.length > 0
                        ? userProfile.badges[userProfile.badges.length - 1]
                        : getBadgeImage(userProfile.level)
                    }
                    alt="Badge"
                    width={40}
                    height={40}
                    className="w-full h-full rounded-full object-cover"
                  
                  />
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center dark:bg-gray-950 bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]">
                <RxAvatar className="w-full h-full" />
              </div>
            )}
          </div>
        
          {!connected || !publicKey ? (
            <button
              onClick={handleConnect}
              className="cursor-pointer px-3 py-2 rounded-xl bg-transparent border-2 border-yellow-400 text-yellow-400 ">
              Connect
            </button>
          ) : (
            <div className="flex justify-center gap-3 items-center w-full">
              <span>{shortenAddressMob(publicKey.toBase58())}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
