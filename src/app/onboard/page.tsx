

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { useUser } from "@/context/UserContext";
// import { useWallet } from "@solana/wallet-adapter-react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// const story = `The Chrome Depths
// In the Neon Ocean, a cybernetic abyss of glowing currents, mechanical fish geared anglerbots, whale hives, and elusive luck fish threatens the last seahorse clans. Forged by a rogue AI, these machines corrupt the ocean's balance. As a seahorse sharpshooter, you hunt these constructs, earning XP to evolve traits and restore the depths. Slay whale hives to summon drone fish allies, harness luck fish ammo boosts, and reclaim the Chrome Depths for your clan.`;

// export default function OnboardPage() {
//   const {
//     username,
//     setUsername,
//     userPublicKey,
//     setuserPublicKey,
//     onboardUser,
//     setConnected,
//     isLoading,
//     isOnboarded,
//   } = useUser();

//   const [typedText, setTypedText] = useState("");
//   const [index, setIndex] = useState(0);
//   const { connect, select, wallets, wallet, publicKey, connected } =
//     useWallet();
//   const router = useRouter();
//   const [isConnecting, setIsConnecting] = useState(false);

//   // const handleConnect = async () => {
//   //   try {
//   //     setIsConnecting(true);

//   //     // Validate username first
//   //     if (!username || username.trim().length < 4) {
//   //       throw new Error("Username must be at least 4 characters");
//   //     }

//   //     // Check wallet availability
//   //     if (!wallets.length) throw new Error("No wallets available");

//   //     // Select wallet if needed
//   //     const selectedWallet = wallet || wallets[0];
//   //     if (!wallet) {
//   //       await select(selectedWallet.adapter.name);
//   //     }

//   //     // Connect and properly wait for response
//   //     if (!connected) {
//   //       // Listen for connection events
//   //       await new Promise<void>(async (resolve, reject) => {
//   //         // Timeout after 30 seconds
//   //         // const timeout = setTimeout(() => {
//   //         //   reject(new Error("Connection timed out"));
//   //         // }, 30000);

//   //         try {
//   //           await connect();

//   //           // Check periodically for publicKey
//   //           const checkInterval = setInterval(() => {
//   //             if (publicKey) {
//   //              // clearTimeout(timeout);
//   //               clearInterval(checkInterval);
//   //               resolve();
//   //             }
//   //           }, 100);
//   //         } catch (err) {
//   //           //clearTimeout(timeout);
//   //           reject(err);
//   //         }
//   //       });
//   //     }

//   //     if (!publicKey) throw new Error("Wallet connection failed");

//   //     const pubkeyStr = publicKey.toBase58();
//   //     setuserPublicKey(pubkeyStr);
//   //     setConnected(true);
//   //   } catch (err) {
//   //     console.error("Connection error:", err);
//   //     toast.error(`${err instanceof Error ? err.message : "Connection failed"}`);
//   //   } finally {
//   //     setIsConnecting(false);
//   //   }
//   // };

//   //   const handleCreateProfile = async () => {
//   //     try {
//   //       if (!username || !userPublicKey) {
//   //         throw new Error("Missing required information");
//   //       }

//   //       const success = await onboardUser();
//   //       if (success) {
//   //         toast.success("Profile created successfully!");
//   //         router.push("/");
//   //       }
//   //     } catch (error) {
//   //       toast.error("Failed to create profile. Please try again.");
//   //       console.log("err", error)
//   //     }
//   //   };

//   //   // Typing effect for story
//   //   useEffect(() => {
//   //     if (index < story.length) {
//   //       const timeout = setTimeout(() => {
//   //         setTypedText((prev) => prev + story[index]);
//   //         setIndex(index + 1);
//   //       }, 15);
//   //       return () => clearTimeout(timeout);
//   //     }
//   //   }, [index]);

//   // 1️⃣ Handle only the click to initiate connection
//   const handleConnectClick = async () => {
//     if (!username || username.trim().length < 4) {
//       toast.error("Username must be at least 4 characters");
//       return;
//     }

//     if (!wallets.length) {
//       toast.error("No wallets available");
//       return;
//     }

//     const selectedWallet = wallet || wallets[0];
//     if (!wallet) await select(selectedWallet.adapter.name);

//     if (!connected) {
//       setIsConnecting(true);
//       await connect(); // opens wallet popup
//     }
//   };

//   // 2️⃣ Automatically onboard after wallet connection
// useEffect(() => {
//   const setupUser = async () => {
//     if (!publicKey) return;

//     try {
//       const pubkeyStr = publicKey.toBase58();
//       setuserPublicKey(pubkeyStr);
//       setConnected(true);

//       if (!isOnboarded) {
//         const success = await onboardUser();
//         if (success) toast.success("Profile ready!");
//         router.push("/");
//       }
//     } catch (err) {
//       console.error("Error during setupUser:", err);
//       toast.error("Failed to setup user");
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   setupUser();
// }, [publicKey]);




//  if (isLoading || isConnecting) {
//    return (
//      <div className="min-h-screen flex items-center justify-center text-white">
//        {isConnecting ? "Connecting wallet..." : "Loading..."}
//      </div>
//    );
//  }

//   return (
//     <div className="min-h-screen flex relative">
//       {/* Left Section */}
//       <div className="w-1/2 hidden lg:block relative bg-gradient-to-br from-gray-950 via-gray-950 to-gray-950">
//         <Image
//           src="/assets/onboard.png"
//           alt="Seahorse"
//           fill
//           className="object-cover opacity-90"
//         />
//         <div className="absolute inset bg-gradient-to-r from-yellow-400 to-transparent z-10" />
//       </div>

//       {/* Right Section */}
//       <div className="lg:w-1/2 w-full bg-gray-950 text-white flex flex-col justify-center px-10 py-16 z-20">
//         {/* Title */}
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-3xl font-bold mb-6 text-yellow-400">
//           SEAHORSE SAGA
//         </motion.h1>

//         {/* Story Typing */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="whitespace-pre-line rounded-2xl shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] p-6 leading-relaxed mb-8 text-md text-gray-300 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-transparent">
//           {typedText}
//         </motion.p>

//         {/* Username Input */}
//         <input
//           type="text"
//           placeholder="Enter your username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="bg-[#1a1a1a] border border-y-amber-300 px-4 py-2 rounded-md text-white mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//         />

//         {/* Wallet Connect */}
//         <div className="flex justify-center w-full items-center gap-4">
//           <div className="flex items-center justify-center w-full my-5">
//             {!connected || !userPublicKey ? (
//               <button
//                 onClick={handleConnectClick} // <- single combined function
//                 disabled={username.trim().length < 4 || isConnecting}
//                 className={`cursor-pointer px-3 py-2 rounded-xl border-2 ${
//                   username.trim().length < 4 || isConnecting
//                     ? "border-none text-gray-600 cursor-not-allowed shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c]"
//                     : "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
//                 }`}>
//                 {isConnecting ? "Connecting..." : "Connect & Login"}
//               </button>
//             ) : (
//               <button
//                 onClick={() => router.push("/")}
//                 className="px-3 py-2 w-1/2 rounded-xl bg-yellow-400 cursor-pointer text-black hover:bg-yellow-300">
//                 Enter Game
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const story = `The Chrome Depths
In the Neon Ocean, a cybernetic abyss of glowing currents, mechanical fish geared anglerbots, whale hives, and elusive luck fish threaten the last seahorse clans. Forged by a rogue AI, these machines corrupt the ocean's balance. As a seahorse sharpshooter, you hunt these constructs, earning XP to evolve traits and restore the depths. Slay whale hives to summon drone fish allies, harness luck fish ammo boosts, and reclaim the Chrome Depths for your clan.`;

export default function OnboardPage() {
  const {
    username,
    setUsername,
    userPublicKey,
    setuserPublicKey,
    onboardUser,
    setConnected,
    isLoading,
    isOnboarded,
  } = useUser();
  const { connect, select, wallets, wallet, publicKey, connected } =
    useWallet();
  const router = useRouter();
  const [typedText, setTypedText] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized typing effect with batch updates
  useEffect(() => {
    let index = 0;
    const batchSize = 5; // Update 5 characters at a time
    const typeBatch = () => {
      if (index < story.length) {
        setTypedText(story.slice(0, index + batchSize));
        index += batchSize;
        typingRef.current = setTimeout(typeBatch, 50); // Slower for readability
      }
    };
    typeBatch();
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, []);

  // Real-time username validation
  useEffect(() => {
    if (username && username.trim().length < 4) {
      setUsernameError("Username must be at least 4 characters");
    } else {
      setUsernameError(null);
    }
  }, [username]);

  // Handle wallet connection and onboarding
  const handleConnectClick = async () => {
    if (usernameError || !username) {
      toast.error("Please enter a valid username");
      return;
    }
    if (!wallets.length) {
      toast.error("No wallets available");
      return;
    }

    try {
      setIsConnecting(true);
      const selectedWallet = wallet || wallets[0];
      if (!wallet) await select(selectedWallet.adapter.name);
      if (!connected) await connect();
    } catch (err) {
      console.error("Connection error:", err);
      toast.error("Failed to connect wallet");
      setIsConnecting(false);
    }
  };

  // Auto-onboard after wallet connection
  useEffect(() => {
    const setupUser = async () => {
      if (!publicKey || isOnboarded) return;
      try {
        const pubkeyStr = publicKey.toBase58();
        setuserPublicKey(pubkeyStr);
        setConnected(true);
        const success = await onboardUser();
        if (success) {
          toast.success("Profile ready!");
          router.push("/");
        }
      } catch (err) {
        console.error("Setup error:", err);
        toast.error("Failed to setup user");
      } finally {
        setIsConnecting(false);
      }
    };
    setupUser();
  }, [
    publicKey,
    isOnboarded,
    onboardUser,
    router,
    setConnected,
    setuserPublicKey,
  ]);

  // Loading state with animated spinner
  if (isLoading || isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-8 h-8 border-4 border-t-yellow-400 border-gray-50 rounded-full"
        />
        <span className="ml-4">
          {isConnecting ? "Connecting wallet..." : "Loading..."}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative bg-gray-950">
      {/* Left Section - Optimized for mobile */}
      <div className="lg:w-1/2 w-full h-64 lg:h-auto relative hidden lg:block  bg-gray-950">
        <Image
          src="/assets/onboard.png"
          alt="Seahorse"
          fill
          className="object-cover opacity-80"
          priority
        />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-transparent" /> */}
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full bg-gray-950 text-white flex flex-col justify-center px-6 sm:px-10 py-8 lg:py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold mb-6 text-yellow-400">
          SEAHORSE SAGA
        </motion.h1>

        {/* Story Typing */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="whitespace-pre-line rounded-2xl bg-gray-900/50 p-6 leading-relaxed shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] mb-8 text-sm sm:text-md text-gray-300 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800">
          {typedText}
        </motion.p>

        {/* Username Input with Validation Feedback */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full bg-[#1a1a1a] border px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 ${
              usernameError
                ? "border-red-500 focus:ring-red-500"
                : "border-yellow-400 focus:ring-yellow-400"
            }`}
          />
          <AnimatePresence>
            {usernameError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-1">
                {usernameError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        

        {/* Wallet Connect */}
        <div className="flex justify-center w-full">
          <motion.button
            onClick={
              connected && userPublicKey
                ? () => router.push("/")
                : handleConnectClick
            }
            disabled={!!usernameError || isConnecting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full sm:w-1/2 px-4 py-2 rounded-xl border-2 text-center font-medium transition-colors ${
              usernameError || isConnecting
                ? "shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] text-gray-600 cursor-not-allowed"
                : "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            }`}>
            {isConnecting
              ? "Connecting..."
              : connected && userPublicKey
              ? "Enter Game"
              : "Connect & Login"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}