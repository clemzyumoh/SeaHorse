

export const NFT_DATA = [
  {
    id: "1",
    name: "Seahorse NFT",
    image: "/assets/play4.png",
    description: "Rare digital seahorse",
    price: 1,
    currency: "SOL",
    requiredLevel: 1, // Add this
    xpReward: 500,
    url: "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754278702/play_kzhprt.png",
  },
  {
    id: "2",
    name: "Golden Turtle",
    image: "/assets/play1.png",
    description: "Symbol of endurance",
    price: 100,
    currency: "USDC",
    requiredLevel: 2, // Add this
    xpReward: 1000,
    url: "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754876135/play1_u8yrz2.png",
  },

  {
    id: "4",
    name: "Seahorse NFT",
    image: "/assets/play4.png",

    description: "Rare digital seahorse",
    price: 10,
    currency: "SOL",
    requiredLevel: 3, // Add this
    xpReward: 3000,
    url: "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754278702/play_kzhprt.png",
  },
  {
    id: "5",
    name: "Golden Turtle",
    image: "/assets/play1.png",
    xpReward: 5000,
    description: "Symbol of endurance",
    price: 1000,
    currency: "USDC",
    requiredLevel: 4, // Add this
    url: "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754876135/play1_u8yrz2.png",
  },
  {
    id: "6",
    name: "Seahorse NFT",
    image: "/assets/play4.png",
    description: "Rare digital seahorse",
    price: 30,
    currency: "SOL",
    requiredLevel: 5, // Add this
    xpReward: 7000,
    url: "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754278702/play_kzhprt.png",
  },
  {
    id: "7",
    name: "Golden Turtle",
    image: "/assets/play1.png",
    description: "Symbol of endurance",
    price: 2000,
    currency: "USDC",
    requiredLevel: 5, // Add this
    xpReward: 10000,
    url: "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754876135/play1_u8yrz2.png",
  },
  // ✅ makes 'currency' a literal type instead of string

  // Add more NFTs...
] as const; 
