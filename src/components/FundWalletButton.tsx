"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "@/context/UserContext";

interface FundWalletButtonProps {
  className?: string;
}

export const FundWalletButton: React.FC<FundWalletButtonProps> = ({
  className,
}) => {
  const { username } = useUser();
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lastFunded = localStorage.getItem("lastFundedTimestamp");
    if (lastFunded) {
      const remaining = calculateRemainingCooldown(parseInt(lastFunded, 10));
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
    return () => clearInterval(timer);
  };

  const handleFund = async () => {
    if (!username) {
      return toast.error("Please login first");
    }

    const lastFunded = localStorage.getItem("lastFundedTimestamp");
    if (lastFunded && calculateRemainingCooldown(parseInt(lastFunded, 10)) > 0) {
      return toast.error("You can only claim once every 24 hours");
    }

    setLoading(true);

    try {
      await axios.post("/api/fund", {
        username,
      });

      const now = Date.now();
      localStorage.setItem("lastFundedTimestamp", now.toString());
      setCooldownSeconds(24 * 60 * 60);
      startCooldownTimer(24 * 60 * 60);
      toast.success("Daily reward claimed");
    } catch (err: any) {
      toast.error("Failed to claim reward. Try again later.");
      console.error(err);
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
      disabled={cooldownSeconds > 0 || loading || !username}
      className={`px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
        cooldownSeconds
          ? "shadow-[2px_2px_2px_#040f4c,-2px_-2px_2px_#040f4c] cursor-not-allowed"
          : "bg-transparent text-yellow-400 border-yellow-400 border-2 shadow-md"
      } ${loading ? "opacity-75" : ""} ${className || ""}`}>
      {cooldownSeconds > 0
        ? `Try again in ${formatTime(cooldownSeconds)}`
        : loading
        ? "⏳ Claiming..."
        : "Claim Reward"}
    </button>
  );
};
