import NFTMarketplace from '@/components/NFTMarketplace'
import React from 'react'

const NFT = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-black text-white px-4 py-8 mb-16 sm:px-20 gap-16">
      <NFTMarketplace />
    </div>
  );
}

export default NFT


