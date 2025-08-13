
import { useState, useEffect } from "react";

export function usePurchasedNFTs() {
  const [purchasedNFTs, setPurchasedNFTs] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("purchasedNFTs") || "[]");
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("purchasedNFTs", JSON.stringify(purchasedNFTs));
  }, [purchasedNFTs]);

    return { purchasedNFTs, setPurchasedNFTs };
    

 const NFT_DATA = [
  {
    id: "1",
    name: "Seahorse NFT",
    image: "/assets/play1.png",
    description: "Rare digital seahorse",
    price: 0.25,
    currency: "SOL",
    requiredLevel: 1, // Add this
    xpReward: 500,
  },
  {
    id: "2",
    name: "Golden Turtle",
    image: "/assets/play4.png",
    description: "Symbol of endurance",
    price: 100,
    currency: "USDC",
    requiredLevel: 2, // Add this
    xpReward: 1000,
  },

  {
    id: "4",
    name: "Seahorse NFT",
    image: "/assets/play1.png",

    description: "Rare digital seahorse",
    price: 5,
    currency: "SOL",
    requiredLevel: 3, // Add this
    xpReward: 3000,
  },
  {
    id: "5",
    name: "Golden Turtle",
    image: "/assets/play4.png",
    xpReward: 5000,
    description: "Symbol of endurance",
    price: 300,
    currency: "USDC",
    requiredLevel: 4, // Add this
  },
  {
    id: "6",
    name: "Seahorse NFT",
    image: "/assets/play1.png",
    description: "Rare digital seahorse",
    price: 25,
    currency: "SOL",
    requiredLevel: 5, // Add this
    xpReward: 7000,
  },
  {
    id: "7",
    name: "Golden Turtle",
    image: "/assets/play4.png",
    description: "Symbol of endurance",
    price: 500,
    currency: "USDC",
    requiredLevel: 5, // Add this
    xpReward: 10000,
  },


  // Add more NFTs...
] as const; 

}