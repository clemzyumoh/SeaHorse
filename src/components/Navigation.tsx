"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ImCoinDollar } from "react-icons/im";
import { GiTargetShot } from "react-icons/gi";
import { FaAward } from "react-icons/fa6";
import { motion } from "framer-motion";


import { GiConvergenceTarget } from "react-icons/gi";

const Navigation = () => {
  const pathname = usePathname();
  const [showNav,setShowNav] = useState(true)

  const Menus = [
    {
      href: "/",
      label: "Mission-Hub",
      icon: <GiConvergenceTarget />,
      disabled: false,
    },
    {
      href: "/quest",
      label: "Quest",
      icon: <GiTargetShot />,
      disabled: false,
    },
    {
      href: "/nft",
      label: "NFT",
      icon: <ImCoinDollar />,
      disabled: false,
    },
    {
      href: "/ranking",
      label: "Ranking",
      icon: <FaAward />,
      disabled: false,
    },
    
  ];

  const activeIndex = Menus.findIndex((menu) => menu.href === pathname);

 
  const [spanLeft, setSpanLeft] = useState("");

  useEffect(() => {
    if (activeIndex !== -1) {
    
      setSpanLeft(
        `calc(${(activeIndex + 0.5) * (100 / Menus.length)}% - 2rem)`
      );
    } else {
      setSpanLeft("unset");
    }
  }, [activeIndex, Menus.length]);

  return (
    <>
      {!showNav && (
        <div
          className="fixed top-0 left-0 w-full h-5 z-50"
          onTouchStart={(e) => {
            const touchStart = e.touches[0].clientY;
            const onTouchEnd = (ev: TouchEvent) => {
              const touchEnd = ev.changedTouches[0].clientY;
              if (touchEnd < touchStart - 30) {
                setShowNav(true); // swipe up
              }
              window.removeEventListener("touchend", onTouchEnd);
            };
            window.addEventListener("touchend", onTouchEnd);
          }}
        />
      )}
      {showNav && (
        <motion.div
          drag="y"
          dragConstraints={{ top: -100, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.point.y > 50) setShowNav(false); // swipe down to hide
            if (info.point.y < -50) setShowNav(true); // swipe up to show
          }}
          className="bg-gray-950 shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c]   px-6 pb-1 rounded-t-3xl z-50 flex justify-between items-center text-black dark:text-white lg:hidden bottom-0 mt-10 w-full fixed">
          <motion.ul className="grid grid-cols-4 relative w-full">
            <span
              className="bg-gray-950  duration-500  w-16 h-9 absolute -top-5 rounded-t-full"
              style={{
                left: spanLeft,
                opacity: activeIndex === -1 ? 0 : 1,
              }}></span>

            {Menus.map((menu, index) => (
              <li
                key={menu.label}
                className="flex flex-col items-center pt-6 relative w-full cursor-pointer"
              
              >
                <Link
                  href={menu.disabled ? "#" : menu.href}
                  onClick={(e) => {
                    if (menu.disabled) {
                      e.preventDefault();
                      alert("No document to view yet.");
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`text-xl z-10 duration-300 ${
                    index === activeIndex
                      ? "-mt-9  text-yellow-400 border-2 border-yellow-400  p-2 rounded-full shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] "
                      : menu.disabled
                      ? "text-gray-300"
                      : "text-gray-400"
                  }`}>
                  {menu.icon}
                </Link>

                <span
                  className={`text-xs font-semibold mt-1 transition-all duration-300 ${
                    index === activeIndex
                      ? "opacity-100 translate-y-2 text-4xl text-yellow-500"
                      : "opacity-0 translate-y-4"
                  }`}>
                  {menu.label}
                </span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      )}
      {!showNav && (
        <div
          className="fixed lg:hidden bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 text-center bg-gray-950 rounded-t-md z-50"
          onClick={() => setShowNav(true)} 
          onTouchStart={(e) => {
            const startY = e.touches[0].clientY;
            const onTouchEnd = (ev: TouchEvent) => {
              const endY = ev.changedTouches[0].clientY;
              if (endY < startY - 30) setShowNav(true); 
              window.removeEventListener("touchend", onTouchEnd);
            };
            window.addEventListener("touchend", onTouchEnd);
          }}>
          click
        </div>
      )}
    </>
  );
};

export default Navigation;
