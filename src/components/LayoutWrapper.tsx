

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Image from "next/image";


import Sidebar from "./SideBar";
import Header from "./Header";
import Navigation from "./Navigation";

import {  useUser } from "@/context/UserContext";
import PageTracker from "./PageTracker";
import { LevelProvider } from "@/context/LevelContext";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
 // const pathname = usePathname();
  // const router = useRouter();
  const { userPublicKey, isOnboarded, isLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  // Added this useEffect at the top level to handle redirects immediately
  useEffect(() => {
    if (isLoading) return;

    const isOnboardingPage = pathname === "/onboard";

    // If not onboarded and not on onboarding page, redirect
    if (!userPublicKey && !isOnboardingPage) {
      router.replace("/onboard"); // Changed from push to replace
      return;
    }

    // If onboarded and on onboarding page, redirect home
    if (userPublicKey && isOnboarded && isOnboardingPage) {
      router.replace("/");
    }
  }, [pathname, isOnboarded, isLoading, userPublicKey]);

  // Added loading state
  if (isLoading) {

       return (
      <div className="flex items-center justify-center h-screen bg-[#0B091A] text-white">
        <div className="relative">
          <div className="w-46 h-46 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-end">
              <Image
                src="/assets/play1.png"
                alt="logo"
                width={48}
                height={48}
                className="object-cover"
              />
          
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Added early return during redirects
  if (
    (!isOnboarded && pathname !== "/onboard") ||
    (isOnboarded && pathname === "/onboard")
  ) {
    return null;
  }



  const isAuth = pathname === "/onboard";

  return (
    <div
      className={`min-h-screen flex font-[var(--font-orbitron)] overflow-x-hidden overflow-y-auto text-white bg-[#0B091A]`}>
      
        
          {isAuth ? (
            // Auth-only layout
            <main className="flex-grow w-full min-h-screen">
              <Toaster position="top-right" />
              {children}
            </main>
          ) : (
            <LevelProvider>
              <PageTracker />
              <div className="flex items-center justify-center w-full min-h-scree">
                <div className="lg:block w-[240px] hidden">
                  <Sidebar />
                </div>

                <div className="flex flex-col flex-grow h-screen overflow-hidden">
                  <div className="flex justify-center py-8 items-center w-full">
                    <Header />
                  </div>
                  <main className="flex-grow overflow-y-auto md:px-4 pb-10">
                    <Toaster position="top-right" />
                   {/* <ProtectedContent /> */}
                    {children}
                  </main>
                  {<Navigation />}
                </div>
              </div>
            </LevelProvider>
          )}
      
      
    </div>
  );
}
