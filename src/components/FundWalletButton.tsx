

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";

interface FundWalletButtonProps {
  className?: string;
}

export const FundWalletButton: React.FC<FundWalletButtonProps> = ({
  className,
}) => {
  const { publicKey } = useWallet();
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

  // Check localStorage for existing cooldown
  useEffect(() => {
    const lastFunded = localStorage.getItem("lastFundedTimestamp");
    if (lastFunded) {
      const remaining = calculateRemainingCooldown(parseInt(lastFunded));
      if (remaining > 0) {
        setCooldownSeconds(remaining);
        startCooldownTimer(remaining);
      }
    }
  }, []);

  const calculateRemainingCooldown = (lastFundedTimestamp: number) => {
    const now = Date.now();
    const elapsed = now - lastFundedTimestamp;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return Math.floor((twentyFourHours - elapsed) / 1000);
  };

  const startCooldownTimer = (initialSeconds: number) => {
    let seconds = initialSeconds;
    const timer = setInterval(() => {
      seconds -= 1;
      setCooldownSeconds(seconds);
      if (seconds <= 0) {
        clearInterval(timer);
        localStorage.removeItem("lastFundedTimestamp");
      }
    }, 1000);
  };

  const handleFund = async () => {
    if (!publicKey) {
      return toast.error("Wallet not connected");
    }

    // Check if still in cooldown (double-check)
    const lastFunded = localStorage.getItem("lastFundedTimestamp");
    if (lastFunded && calculateRemainingCooldown(parseInt(lastFunded)) > 0) {
      return toast.error("You can only fund once every 24 hours");
    }

    setLoading(true);

    try {
      await axios.post("/api/fund", {
        walletAddress: publicKey.toBase58(),
      });

      // Set cooldown in localStorage
      const now = Date.now();
      localStorage.setItem("lastFundedTimestamp", now.toString());
      setCooldownSeconds(24 * 60 * 60); // 24 hours in seconds
      startCooldownTimer(24 * 60 * 60);

      toast.success("Wallet funded with SOL + USDC");
    } catch (err) {
      toast.error("Failed to fund wallet. Try again later.");
      console.log("err", err)
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <button
      onClick={handleFund}
      disabled={cooldownSeconds > 0 || loading}
      className={`px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
        cooldownSeconds
          ? "shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c]  cursor-not-allowed"
          : "bg-transparent text-yellow-400 border-yellow-400 border-2 shadow-md animate-pulse"
      } ${loading ? "opacity-75" : ""} ${className || ""}`}>
      {cooldownSeconds > 0
        ? `Try again in ${formatTime(cooldownSeconds)}`
        : loading
        ? "⏳ Claiming..."
        : "Claim Reward"}
    </button>
  );
};