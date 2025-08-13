import "./globals.css";

import LayoutWrapper from "@/components/LayoutWrapper";
import { UserProvider } from "@/context/UserContext";
import SolanaProvider from "../components/SolanaProvider";

import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700"], // or any weight you need
});



export const metadata = {
  title: "SeaHorse",
  description: "SAGA.",
  icons: {
    icon: "/icon.png",
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} antialiased`}>
      <body className="flex flex-col text-black dark:text-white bg-[#0B091A] overflow-x-hidden ">
        <SolanaProvider>
          <UserProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </UserProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
