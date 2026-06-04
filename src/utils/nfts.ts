

export const NFT_DATA = [
  {
    id: "1",
    name: "Seahorse NFT",
    image: "/assets/play4.png",
    description: "Rare digital seahorse",
    price: 1,
    currency: "CREDITS",
    requiredLevel: 1,
    xpReward: 500,
    url: "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754278702/play_kzhprt.png",
  },
  {
    id: "2",
    name: "Golden Turtle",
    image: "/assets/play1.png",
    description: "Symbol of endurance",
    price: 100,
    currency: "CREDITS",
    requiredLevel: 2,
    xpReward: 1000,
    url: "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754876135/play1_u8yrz2.png",
  },

  {
    id: "4",
    name: "Seahorse NFT",
    image: "/assets/play4.png",

    description: "Rare digital seahorse",
    price: 10,
    currency: "CREDITS",
    requiredLevel: 3,
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
    currency: "CREDITS",
    requiredLevel: 4,
    url: "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754876135/play1_u8yrz2.png",
  },
  {
    id: "6",
    name: "Seahorse NFT",
    image: "/assets/play4.png",
    description: "Rare digital seahorse",
    price: 30,
    currency: "CREDITS",
    requiredLevel: 5,
    xpReward: 7000,
    url: "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754278702/play_kzhprt.png",
  },
  {
    id: "7",
    name: "Golden Turtle",
    image: "/assets/play1.png",
    description: "Symbol of endurance",
    price: 2000,
    currency: "CREDITS",
    requiredLevel: 5,
    xpReward: 10000,
    url: "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754876135/play1_u8yrz2.png",
  },
  // ✅ makes 'currency' a literal type instead of string

  // Add more NFTs...
] as const; 
