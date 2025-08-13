
export type NFT = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  currency: "SOL" | "USDC";
  requiredLevel?: number; // Make it optional
  xpReward: number; // Add this
purchased:boolean

};
