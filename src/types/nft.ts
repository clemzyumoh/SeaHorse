
export type NFT = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  currency: string;
  requiredLevel?: number;
  xpReward: number;
  purchased: boolean;
};
