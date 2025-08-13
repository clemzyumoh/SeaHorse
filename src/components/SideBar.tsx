"use client";




import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FaSignOutAlt } from "react-icons/fa";
import { ImCoinDollar } from "react-icons/im";
import toast from "react-hot-toast";

import { GiTargetShot } from "react-icons/gi";
import { FaAward } from "react-icons/fa6";
import { GiConvergenceTarget } from "react-icons/gi";
import { motion } from "framer-motion";
import { BiCollapseHorizontal } from "react-icons/bi";
import { useUser } from "@/context/UserContext";

const Sidebar = () => {
  const pathname = usePathname();
    const [isCollapsed,setIsCollaspsed] = useState(false)
  
  const router = useRouter();
  const { disconnect } = useWallet();
  const { setIsOnboarded, setConnected,setuserPublicKey } = useUser();

const handleLogout = async () => {
  try {
    // 1. First force reset all auth states
    setIsOnboarded(false);
    setConnected(false);
    setuserPublicKey(null);

    // 2. Then disconnect wallet
    await disconnect();

    // 3. Add slight delay for state propagation
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 4. Now redirect
    router.push("/onboard");
    toast.success("Disconnected successfully!");
  } catch (err) {
    toast.error("Disconnection failed!");
    console.error(err);
  }
};
  return (
    <motion.div
      // animate={{ width: isCollapsed ? 80 : 250 }}
      animate={{ x: isCollapsed ? "-90%" : "0%" }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 h-screen w-[240px] mt-8 flex flex-col bg-gray-950 text-white z-30 px-4">
      {/* Logo */}
     
      <div className="absolute top-10  -right-3 z-50">
        <button onClick={() => setIsCollaspsed((prev) => !prev)}>
          <BiCollapseHorizontal className="text-3xl" />
        </button>
      </div>

      <div className="flex items-start justify- ml-6 w-full">
     
        <h1 className="font-bold text-2xl bg-gradient-to-tl from-[#9945ff]  via-yellow-500 to-yellow-400 text-transparent bg-clip-text ">
          SEAHORSE
        </h1>
      </div>

     
      <nav className="flex flex-col mt-16 gap-6 font-bold w-full">
        {[
          {
            href: "/",
            label: "Mission-Hub",
            icon: <GiConvergenceTarget className="text-2xl" />,
            disabled: false,
          },
          {
            href: "/quest",
            label: "Quest",
            icon: <GiTargetShot className="text-2xl" />,
            disabled: false,
          },
          {
            href: "/nft",
            label: "NFT",
            icon: <ImCoinDollar className="text-2xl" />,
            disabled: false,
          },
          {
            href: `/ranking`,
            label: "Ranking",
            icon: <FaAward className="text-2xl" />,
            disabled: false,
          },
        ].map((item) => (
          <div key={item.label} className="relative group w-full">
            <Link
              href={item.href}
              onClick={(e) => {
                if (item.disabled) e.preventDefault();
              }}
              className={`flex items-center gap-6 py-4 px-4 rounded transition w-full
          ${
            item.disabled
              ? "text-neutral-300 cursor-not-allowed"
              : pathname === item.href
              ? "text-yellow-400 bg-transparent border-r-4"
              : "text-gray-400 hover:scale-105 shadow-[2px_2px_2px_#040f4c]"
          }
        `}>
              {item.icon}
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>

            {/* Tooltip when collapsed */}
            {isCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-12 left-6 font-bold space-y-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 py-4 px-8 rounded shadow-[2px_2px_2px_#040f4c] text-gray-100 hover:border hover:border-yellow-400 border-yellow-400 cursor-pointer hover:scale-100 ">
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
