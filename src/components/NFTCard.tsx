
import Image from "next/image";

type NFT = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  currency: "SOL" | "USDC";
  requiredLevel?: number;
  xpReward: number;
  purchased: boolean; // Add this new prop
};

const getLevelBadge = (level?: number) => {
  if (!level) return "/asset/badge5.png";

  const badgeImages: { [key: string]: string } = {
    level1: "/assets/badge5.png", // Novice
    level2: "/assets/badge4.png", // Seeker
    level3: "/assets/badge3.png", // Voyager
    level4: "/assets/badge2.png", // Expert
    level5: "/assets/badge1.png", // Master
  };

  const badgeLevel = `level${Math.min(level, 5)}`; // Cap at level 5
  return badgeImages[badgeLevel] || "/assets/badge5.png";
};

export default function NFTCard({
  nft,
  onBuyClick,
  disabled,
  purchased,
}: {
  nft: NFT;
  onBuyClick: (nft: NFT) => void;
  disabled: boolean; // Changed from string to boolean
  purchased: boolean
}) {
  return (
    <div className="bg-gray-950 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] p-6 rounded-xl hover:shadow-lg transition">
      <Image
        src={nft.image}
        alt={nft.name}
        width={300}
        height={300}
        className="rounded mb-4 object-cover"
      />
      <h3 className="text-lg font-bold">{nft.name}</h3>
      <p className="text-sm text-gray-400 mb-2">{nft.description}</p>
      <div className="flex justify-between items-center">
        <p className="font-semibold">
          {nft.price} {nft.currency}
        </p>
      
        {nft.requiredLevel && (
          <div className="flex items-center gap-1">
            <img
              src={getLevelBadge(nft.requiredLevel)}
              alt={`Level ${nft.requiredLevel}`}
              className="w-5 h-5"
            />
            <span className="text-xs text-gray-400">
              Level {nft.requiredLevel}+{nft.xpReward}XP
            </span>
          </div>
        )}
      </div>
      <button
        className={`mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded ${
          disabled || purchased ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => onBuyClick(nft)}
        disabled={disabled || purchased}>

        {purchased
          ? "Owned"
          : disabled
          ? `Unlocks at Lvl ${nft.requiredLevel}`
          : "Buy Now"}
      </button>
    </div>
  );
}
