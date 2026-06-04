"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { GiTargetShot } from "react-icons/gi";
import { FaAward } from "react-icons/fa6";
import { GiConvergenceTarget } from "react-icons/gi";
import { motion } from "framer-motion";
import { BiCollapseHorizontal } from "react-icons/bi";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";
import { ImCoinDollar } from "react-icons/im";


const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const { setIsOnboarded, setUsername } = useUser();

  const handleLogout = () => {
    setIsOnboarded(false);
    setUsername("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("seahorse_username");
    }
    router.push("/onboard");
    toast.success("Logged out successfully!");
  };

  return (
    <motion.div
      animate={{ x: isCollapsed ? "-90%" : "0%" }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 h-screen w-[240px] py-7 flex flex-col bg-black text-white z-30 px-4">
      <div className="absolute top-24 -right-2 z-50">
        <button onClick={() => setIsCollapsed((prev) => !prev)}>
          <BiCollapseHorizontal />
        </button>
      </div>

      <div className="flex items-start justify-start ml-6 w-full">
        <h1 className="font-bold text-2xl bg-gradient-to-tl from-[#9945ff] via-yellow-500 to-yellow-400 text-transparent bg-clip-text ">
          SEAHORSE
        </h1>
      </div>

      <nav className="flex flex-col mt-16 gap-6 font-bold w-full">
        {[
          { href: "/", label: "Mission-Hub", icon: <GiConvergenceTarget /> },
          { href: "/quest", label: "Quest", icon: <GiTargetShot /> },
          {
            href: "/nft",
            label: "NFT",
            icon: <ImCoinDollar />,
          },
          {
            href: `/ranking`,
            label: "Ranking",
            icon: <FaAward />,
          },
        ].map((item) => (
          <div key={item.label} className="relative group w-full">
            <Link
              href={item.href}
              className={`flex items-center gap-6 py-4 px-4 rounded transition w-full ${
                pathname === item.href
                  ? "text-yellow-400 bg-transparent border-r-4"
                  : "text-gray-400 hover:scale-105 shadow-[2px_2px_2px_#040f4c]"
              }`}>
              <span className="text-2xl">{item.icon}</span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
            {isCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>

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
