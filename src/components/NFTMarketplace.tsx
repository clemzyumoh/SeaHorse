"use client";
import { useEffect, useState } from "react";
import NFTCard from "./NFTCard";
import NFTBuyModal from "./NFTBuyModal";
import toast from "react-hot-toast";
import { NFT } from "@/types/nft";
import { useProfiles } from "@/hooks/useProfile";
import { usePurchasedNFTs } from "@/hooks/usePurchasedNFTs";
import { NFT_DATA } from "@/utils/nfts";

const nftList = NFT_DATA;

const parseProfileLevel = (level: string): number => {
  return parseInt(level.replace("level", "")) || 1;
};

export default function NFTMarketplace() {
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const { userProfile } = useProfiles();
  const { purchasedNFTs, setPurchasedNFTs } = usePurchasedNFTs();

  useEffect(() => {
    localStorage.setItem("purchasedNFTs", JSON.stringify(purchasedNFTs));
  }, [purchasedNFTs]);

  const handleBuyClick = (nft: NFT) => {
    if (nft.requiredLevel && userProfile) {
      const userLevel = parseProfileLevel(userProfile.level);
      if (userLevel < nft.requiredLevel) {
        return toast.error(`Requires level ${nft.requiredLevel} to purchase`);
      }
    }
    setSelectedNFT(nft);
    setShowModal(true);
  };

  const handlePayment = async () => {
    if (!selectedNFT) {
      return;
    }

    if (purchasedNFTs.includes(selectedNFT.id)) {
      return toast.error("Already purchased this item!");
    }

    if (!userProfile) {
      return toast.error("Please login to purchase");
    }

    const loadingToast = toast.loading("Processing purchase...");
    try {
      const response = await fetch("/api/setup/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userProfile.username,
          xp: selectedNFT.xpReward || 0,
          nftAddress: selectedNFT.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Purchase failed");
      }

      setPurchasedNFTs([...purchasedNFTs, selectedNFT.id]);
      toast.success("Item purchased successfully!");
    } catch (err: any) {
      toast.error(err.message || "Purchase failed");
    } finally {
      toast.dismiss(loadingToast);
      setShowModal(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {nftList.map((nft) => {
        const isPurchased = purchasedNFTs.includes(nft.id);
        const isDisabled = nft.requiredLevel
          ? userProfile
            ? parseProfileLevel(userProfile.level) < nft.requiredLevel
            : true
          : false;

        return (
          <NFTCard
            key={nft.id}
            nft={{ ...nft, purchased: isPurchased }}
            onBuyClick={handleBuyClick}
            disabled={isDisabled}
            purchased={isPurchased}
          />
        );
      })}
      {showModal && selectedNFT && (
        <NFTBuyModal
          nft={selectedNFT}
          onClose={() => setShowModal(false)}
          onConfirm={handlePayment}
        />
      )}
    </div>
  );
}
