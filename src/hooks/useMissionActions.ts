


import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import createEdgeClient from "@honeycomb-protocol/edge-client";
import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";

import { levelConfigs } from "@/components/Game/Novice/types/level";

import toast from "react-hot-toast";
import { useProfiles } from "./useProfile";


 export const missionData = {
  level1: {
    missionAddress: "GzYz2Krd5K2pCys5vn1pzpqcz8yohXkfLjnQj8AKpojv",
    badgeUrl:
      "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754436206/Badge5_hul4qy.png",
    xpGoal: 500,
  },
  level2: {
    missionAddress: "6cLmhLDxugABe6sAeMDa82ikbAqUdhq8zBvdhrHm2xgP",
    badgeUrl:
      "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754436206/Badge4_ohay3j.png",
    xpGoal: 1000,
  },
  level3: {
    missionAddress: "46GUGZLAx5keA6ogQuSVgm1DDkdPCqKjoFBryjb6Jfmy",
    badgeUrl:
      "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754436206/Badge3_i9kcag.png",
    xpGoal: 1500,
  },
  level4: {
    missionAddress: "HT3FZfJaXW3YW87RfsY8pmBQkvskKEGSYMnw5QA9g8oh",
    badgeUrl:
      "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754436208/Badge2_sougmr.png",
    xpGoal: 2500,
  },
  level5: {
    missionAddress: "sxKhHo1krjLPdmoGb3mjqsFnUXckPkfPDWbq97BjtBf",
    badgeUrl:
      "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754436207/Badge1_ks5poo.png",
    xpGoal: 5000,
  },
};

export const useMissionActions = () => {
  const { publicKey, signTransaction} = useWallet();
  const { userProfile } = useProfiles();

  const client = useMemo(
    () => createEdgeClient("https://edge.test.honeycombprotocol.com", true),
    []
  );



  const fetchCharacterAddress = async (): Promise<string | null> => {
    try {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }
      const response = await fetch("/api/setup/createCharacter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPublicKey: publicKey.toBase58() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch/create character");
      }
      console.log("charactr", data.characterAddress);

      return data.characterAddress || null;
    } catch (error) {
      console.error("Error fetching/creating character:", error);
      return null;
    }
  };



  const startLevel = async (level: keyof typeof levelConfigs) => {
    if (!publicKey) {
      throw new Error("Wallet not connected or signer not available");
    }

    const mission = missionData[level];
    if (!mission) {
      throw new Error(`No mission data for level: ${level}`);
    }

    const characterAddress = await fetchCharacterAddress();
    if (!characterAddress) {
      throw new Error("Failed to fetch/create character");
    }

    try {
      // Get the transaction from Honeycomb
      const { createSendCharactersOnMissionTransaction } =
        await client.createSendCharactersOnMissionTransaction({
          data: {
            mission: mission.missionAddress.toString(),
            characterAddresses: [characterAddress.toString()],
             authority: publicKey.toString(),
            //authority: "FGPPnvaSeL71MwfhcjANFd2URQdVeBpgNyoqaNv7GPhL".toString(),
           // payer: "FGPPnvaSeL71MwfhcjANFd2URQdVeBpgNyoqaNv7GPhL".toString(),
             payer: publicKey.toString(),
            // Removed hardcoded payer - defaults to authority
            // Removed userId as it's not a standard parameter
            userId: userProfile?.userId,
          },
        });

      // Send transaction using Honeycomb's helper
      const signature = await sendTransactions(
        client,
        {
          transactions: createSendCharactersOnMissionTransaction.transactions,
          blockhash: createSendCharactersOnMissionTransaction.blockhash,
          lastValidBlockHeight:
            createSendCharactersOnMissionTransaction.lastValidBlockHeight,
        },
        [] // No additional signers needed
      );

      console.log("Mission started successfully:", {
        signature,
        mission: mission.missionAddress,
        character: characterAddress,
      });

      return {
        signature,
        missionAddress: mission.missionAddress,
        characterAddress,
      };
    } catch (error) {
      console.error("Failed to start mission:", error);
      throw new Error(
        `Failed to start mission: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

 

  const completeLevel = async (
    level: keyof typeof levelConfigs,
    xpEarned: number,
    score: number,
    missionAddress: string,
    characterAddress: string
  ) => {
    if (!publicKey || !signTransaction) {
      //throw new Error("Wallet not connected or signer not available");
      return
    }

    const mission = missionData[level];
    if (!mission) {
      // throw new Error(`No mission data for level: ${level}`);
      return
    }

    if (xpEarned < mission.xpGoal) {
      console.warn(`XP goal not met: ${xpEarned}/${mission.xpGoal}`);
      
      throw new Error(`XP goal not met: ${xpEarned}/${mission.xpGoal}`);
    }

    let recallSignature: string | null = null;

    try {
      // 1. Recall characters from mission (on-chain)
      const { createRecallCharactersTransaction } =
        await client.createRecallCharactersTransaction({
          data: {
            mission: missionAddress,
            characterAddresses: [characterAddress],
            authority:
              "FGPPnvaSeL71MwfhcjANFd2URQdVeBpgNyoqaNv7GPhL".toString(),
            payer: "FGPPnvaSeL71MwfhcjANFd2URQdVeBpgNyoqaNv7GPhL".toString(),
            userId: userProfile?.userId,
          },
        });

      const [signature] = await sendTransactions(
        client,
        {
          transactions: createRecallCharactersTransaction.transactions,
          blockhash: createRecallCharactersTransaction.blockhash,
          lastValidBlockHeight:
            createRecallCharactersTransaction.lastValidBlockHeight,
        },
        []
      );

      recallSignature = signature as any;
      console.log("Mission recalled successfully:", signature);
    } catch (error) {
      console.warn("Mission recall failed, continuing anyway:", error);
    }

    try {
    

      // 3. Update player profile
      const response = await fetch("/api/setup/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPublicKey: publicKey.toBase58(),
          xp: xpEarned,
          level,
          badgeUrl: mission.badgeUrl,
          missionId: mission.missionAddress,
          
               nftAddress:userProfile?.nfts
        }),
      });

      if (!response.ok) {
        //throw new Error("Failed to update profile");
        return
      }

      toast.success("Mission completed successfully!");
      return {
        recallSignature,
        xpEarned,
        badge: mission.badgeUrl,
      };
    } catch (error) {
      console.error("Failed to complete mission/update profile:", error);
      toast.error("Mission completion/update failed");
      throw error;
    }
  };

  return { startLevel, completeLevel , fetchCharacterAddress};
};