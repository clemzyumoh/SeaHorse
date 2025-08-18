

"use client";
import { useState, useEffect } from "react";
import NFTCard from "./NFTCard";
import NFTBuyModal from "./NFTBuyModal";
import { sendDirectPayment } from "@/utils/sendDirectPayment";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";

import toast from "react-hot-toast";
import { NFT } from "@/types/nft";
import { useProfiles } from "@/hooks/useProfile";
import { usePurchasedNFTs } from "@/hooks/usePurchasedNFTs";
import { NFT_DATA } from "@/utils/nfts";
import { useWalletBalance } from "@/hooks/useWalletBalance";

const nftList = NFT_DATA;


const parseProfileLevel = (level: string): number => {
  return parseInt(level.replace("level", "")) || 1;
};

export default function NFTMarketplace() {
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const wallet = useWallet();
  // const publicKey = useWallet();
const { solBalance, usdcBalance } = useWalletBalance();
  const { connection } = useConnection();
  const { userProfile } = useProfiles();

  const { purchasedNFTs, setPurchasedNFTs } = usePurchasedNFTs();

  // Add this useEffect with other effects
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

const checkFunds = (selectedNFT: { price: number; currency: string }) => {
  if (selectedNFT.currency === "SOL") {
    if (solBalance < selectedNFT.price) {
      throw new Error("Insufficient SOL balance");
    }
  } else if (selectedNFT.currency === "USDC") {
    if (usdcBalance < selectedNFT.price) {
      throw new Error("Insufficient USDC balance");
    }
  }
};
  const handlePayment = async () => {
    if (purchasedNFTs.includes(selectedNFT.id)) {
      return toast.error("Already purchased this NFT!");
    }
    if (!wallet.publicKey || !selectedNFT) {
      return toast.error("Wallet not connected");
    }
    const loadingToast = toast.loading("Processing transaction...");
    try {
      setShowModal(false);

   

    await checkFunds(selectedNFT);

      // 2. Process payment and verify confirmation
      const recipient = process.env.NEXT_PUBLIC_NFT_RECEIVING_WALLET!;

      const { signature } = await sendDirectPayment({
        connection,
        wallet,
        recipient,
        amount: selectedNFT.price,
        token: selectedNFT.currency,
      });

      const paymentStatus = await connection.confirmTransaction(
        signature,
        "confirmed"
      );
      if (paymentStatus.value.err) {
        throw new Error("Payment failed to confirm on-chain");
      }

      // 3. Only proceed if payment succeeded
      const mintResponse = await fetch("/api/mint-nft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerWallet: wallet.publicKey.toString(),
          nftName: selectedNFT.name,
          nftMetadataUri: selectedNFT.url,
          paymentSignature: signature,
        }),
      });

      const { nftAddress } = await mintResponse.json();
      if (!nftAddress) throw new Error("NFT minting failed");

      // 4. Update profile
      const updateResponse = await fetch("/api/setup/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPublicKey: wallet.publicKey.toString(),
          xp: selectedNFT.xpReward,
          nftAddress,
          level: userProfile?.level,
          badgeUrl: userProfile?.badges,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(
          "Profile update failed - NFT was minted but not assigned"
        );
      }

      // 5. Finalize only if all steps succeeded
      setPurchasedNFTs([...purchasedNFTs, selectedNFT.id]);
      toast.dismiss(loadingToast);
      toast.success("NFT purchased successfully!");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(
        `Transaction failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      console.error(err);
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