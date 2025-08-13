

import Image from "next/image";
import { SOLAPAY_NFT_RECEIVING_WALLET } from "@/utils/constants";

type NFT = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  currency: "SOL" | "USDC";
};

export default function NFTBuyModal({
  nft,
  onClose,
  onConfirm,
}: {
  nft: NFT;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full bg-black/60">
      <div className="bg-gray-950 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] p-6 flex flex-col items-center rounded-xl w-full max-w-md text-white">
        <h2 className="text-xl  w-full  text-center font-bold mb-4">
          Confirm Purchase
        </h2>
        <Image
          src={nft.image}
          alt={nft.name}
          width={150}
          height={150}
          className="rounded  shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c]  mb-4"
        />
        <p className="font-bold text-lg">{nft.name}</p>
        <p className="text-gray-400 text-sm">{nft.description}</p>
        <p className="my-3">
          Price: {nft.price} {nft.currency}
        </p>
        <p className="text-sm">
          Send payment to:{" "}
          <span className="text-yellow-400 break-words">
            {SOLAPAY_NFT_RECEIVING_WALLET}
          </span>
        </p>
        <div className="flex items-center w-full gap-4 mt-6">
          <button
            onClick={onConfirm}
            className="bg-yellow-400 cursor-pointer text-black font-bold px-4 py-2 rounded w-full">
            Send Now
          </button>
          <button
            onClick={onClose}
            className="shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] cursor-pointer text-white px-4 py-2 rounded w-full">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
