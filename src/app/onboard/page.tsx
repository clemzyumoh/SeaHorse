
// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { useUser} from "@/context/UserContext";
// import { useWallet } from "@solana/wallet-adapter-react";
// import toast from "react-hot-toast";

// import {  useRouter } from "next/navigation";





// const story = ` The Chrome Depths
// In the Neon Ocean, a cybernetic abyss of glowing currents, mechanical fish geared anglerbots, whale hives, and elusive luck fish threatens the last seahorse clans. Forged by a rogue AI, these machines corrupt the ocean’s balance. As a seahorse sharpshooter, you hunt these constructs, earning XP to evolve traits and restore the depths. Slay whale hives to summon drone fish allies, harness luck fish ammo boosts, and reclaim the Chrome Depths for your clan.`;

// export default function OnboardPage() {
//   const {
//     username,
//     setUsername,
//     userPublicKey,
//     setuserPublicKey,
//     onboardUser,
//     setConnected,
//     isLoading,
//     setIsLoading,
//     isOnboarded,
//   } = useUser();
//   const [typedText, setTypedText] = useState("");
//   const [index, setIndex] = useState(0);
//   const { connect, select, wallets, wallet, publicKey, connected } =
//     useWallet();
//   const [triggerConnect, setTriggerConnect] = useState(false);
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//  const [isConnecting, setIsConnecting] = useState(false);
//     useEffect(() => {
//       const handleOnboarding = async () => {
//         if (
//           isLoading ||
//           isOnboarded ||
//           !connected ||
//           !userPublicKey ||
//           !username
//         )
//           return;
//         setLoading(true);
//         const success = await onboardUser();
//         if (success) {
//           toast.success("Profile created successfully!");
//           router.push("/");
//         } else {
//           toast.error("Failed to create profile. Please try again.");
//         }
//         setLoading(false);
//       };
//       handleOnboarding();
//     }, [
//       connected,
//       userPublicKey,
//       username,
//       isOnboarded,
//       isLoading,
//       onboardUser,
//       router,
//     ]);

//     const handleConnect = async () => {
//       try {
//         setLoading(true);

//         // Validate username
//         if (!username || username.trim().length < 4) {
//           throw new Error("Username must be at least 4 characters");
//         }

//         // Pick and connect wallet
//         if (!wallets.length) throw new Error("No wallets available");
//         if (!wallet) {
//           await select(wallets[0].adapter.name);
//           await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for wallet selection
//         }

//         if (!connected) {
//           await connect();
//         }

//         const pubkeyStr = publicKey?.toBase58();
//         if (!pubkeyStr) throw new Error("No public key from wallet");

//         setuserPublicKey(pubkeyStr);
//         setConnected(true);
//       } catch (err) {
//         console.error("Connection error:", err);
//         toast.error(`${err}` || "Connection failed");
//         setLoading(false);
//       }
//     };
  

//   const shortenAddress = (address: string) =>
//     `${address.slice(0, 6)}...${address.slice(-4)}`;

//   const shortenAddressMob = (address: string) =>
//     `${address.slice(0, 3)}...${address.slice(-3)}`;
//   // Typing effect

//   useEffect(() => {
//     if (index < story.length) {
//       const timeout = setTimeout(() => {
//         setTypedText((prev) => prev + story[index]);
//         setIndex(index + 1);
//       }, 15);
//       return () => clearTimeout(timeout);
//     }
//   }, [index]);

//   return (
//     <div className="min-h-screen flex relative ">
//       {/* Left Section */}
//       <div className="w-1/2 hidden lg:block relative bg-gradient-to-br from-gray-950 via-gray-950  to-gray-950">
//         <Image
//           src="/assets/onboard.png" // update with your asset
//           alt="Seahorse"
//           fill
//           className="object-cover  opacity-90"
//         />
//         <div className="absolute inset bg-gradient-to-r from-yellow-400 to-transparent z-10" />
//       </div>
//       {/* <div className="absolute  bg-yellow-400  blur-xl z-10 w-96 h-96 rounded-full" /> */}
//       {/* Right Section */}
//       <div className="lg:w-1/2 w-full   bg-gray-950 text-white flex flex-col justify-center px-10 py-16 z-20">
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
//           className="bg-[#1a1a1a border border-y-amber-300 px-4 py-2 rounded-md text-white mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//         />

//         {/* Wallet Connect */}
//         <div className="flex justify-center  w-full items-center gap-4 ">
//           <div className="flex justify-center items-center w-ful"></div>
      
//           <div className="flex items-center justify-center w-full my-5">
//             {!connected || !userPublicKey ? (
//               <button
//                 onClick={handleConnect}
//                 disabled={username.trim().length < 4 || loading}
//                 className={`cursor-pointer px-3 py-2 rounded-xl border-2 ${
//                   username.trim().length < 4 || loading
//                     ? "border-none text-gray-600 cursor-not-allowed shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c]"
//                     : "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
//                 }`}>
//                 {loading ? "Connecting..." : "Connect Wallet"}
//               </button>
//             ) : !isOnboarded ? (
//               <button
//                 onClick={() => onboardUser()}
//                 disabled={loading || !username || !userPublicKey}
//                 className={`cursor-pointer px-3 py-2 rounded-xl border-2 ${
//                   loading || !username || !userPublicKey
//                     ? "border-none text-gray-600 cursor-not-allowed shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c]"
//                     : "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
//                 }`}>
//                 {loading ? "Creating Profile..." : "Create Profile"}
//               </button>
//             ) : (
//               <button
//                 onClick={() => router.push("/")}
//                 className="px-3 py-2 w-1/2 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300">
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

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const story = `The Chrome Depths
In the Neon Ocean, a cybernetic abyss of glowing currents, mechanical fish geared anglerbots, whale hives, and elusive luck fish threatens the last seahorse clans. Forged by a rogue AI, these machines corrupt the ocean's balance. As a seahorse sharpshooter, you hunt these constructs, earning XP to evolve traits and restore the depths. Slay whale hives to summon drone fish allies, harness luck fish ammo boosts, and reclaim the Chrome Depths for your clan.`;

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

  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);
  const { connect, select, wallets, wallet, publicKey, connected } =
    useWallet();
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

const handleConnect = async () => {
  try {
    setIsConnecting(true);

    // Validate username first
    if (!username || username.trim().length < 4) {
      throw new Error("Username must be at least 4 characters");
    }

    // Check wallet availability
    if (!wallets.length) throw new Error("No wallets available");

    // Select wallet if needed
    const selectedWallet = wallet || wallets[0];
    if (!wallet) {
      await select(selectedWallet.adapter.name);
    }

    // Connect and properly wait for response
    if (!connected) {
      // Listen for connection events
      await new Promise<void>(async (resolve, reject) => {
        // Timeout after 30 seconds
        const timeout = setTimeout(() => {
          reject(new Error("Connection timed out"));
        }, 30000);

        try {
          await connect();

          // Check periodically for publicKey
          const checkInterval = setInterval(() => {
            if (publicKey) {
              clearTimeout(timeout);
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
        } catch (err) {
          clearTimeout(timeout);
          reject(err);
        }
      });
    }

    if (!publicKey) throw new Error("Wallet connection failed");

    const pubkeyStr = publicKey.toBase58();
    setuserPublicKey(pubkeyStr);
    setConnected(true);
  } catch (err) {
    console.error("Connection error:", err);
    toast.error(`${err instanceof Error ? err.message : "Connection failed"}`);
  } finally {
    setIsConnecting(false);
  }
};

  const handleCreateProfile = async () => {
    try {
      if (!username || !userPublicKey) {
        throw new Error("Missing required information");
      }

      const success = await onboardUser();
      if (success) {
        toast.success("Profile created successfully!");
        router.push("/");
      }
    } catch (error) {
      toast.error("Failed to create profile. Please try again.");
    }
  };

  // Typing effect for story
  useEffect(() => {
    if (index < story.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + story[index]);
        setIndex(index + 1);
      }, 15);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <div className="min-h-screen flex relative">
      {/* Left Section */}
      <div className="w-1/2 hidden lg:block relative bg-gradient-to-br from-gray-950 via-gray-950 to-gray-950">
        <Image
          src="/assets/onboard.png"
          alt="Seahorse"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset bg-gradient-to-r from-yellow-400 to-transparent z-10" />
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full bg-gray-950 text-white flex flex-col justify-center px-10 py-16 z-20">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-6 text-yellow-400">
          SEAHORSE SAGA
        </motion.h1>

        {/* Story Typing */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="whitespace-pre-line rounded-2xl shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] p-6 leading-relaxed mb-8 text-md text-gray-300 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-transparent">
          {typedText}
        </motion.p>

        {/* Username Input */}
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-[#1a1a1a] border border-y-amber-300 px-4 py-2 rounded-md text-white mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* Wallet Connect */}
        <div className="flex justify-center w-full items-center gap-4">
          <div className="flex items-center justify-center w-full my-5">
            {!connected || !userPublicKey ? (
              <button
                onClick={handleConnect}
                disabled={username.trim().length < 4 || isConnecting}
                className={`cursor-pointer px-3 py-2 rounded-xl border-2 ${
                  username.trim().length < 4 || isConnecting
                    ? "border-none text-gray-600 cursor-not-allowed shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c]"
                    : "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                }`}>
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : !isOnboarded ? (
              <button
                onClick={handleCreateProfile}
                disabled={isLoading || !username || !userPublicKey}
                className={`cursor-pointer px-3 py-2 rounded-xl border-2 ${
                  isLoading || !username || !userPublicKey
                    ? "border-none text-gray-600 cursor-not-allowed shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c]"
                    : "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                }`}>
                {isLoading ? "Login....." : "Login Game"}
              </button>
            ) : (
              <button
                onClick={() => router.push("/")}
                className="px-3 py-2 w-1/2 rounded-xl bg-yellow-400 cursor-pointer text-black hover:bg-yellow-300">
                Enter Game
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
