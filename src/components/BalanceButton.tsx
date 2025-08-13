

"use client";
import React, { useState, useCallback } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface BalanceButtonProps {
  balance: number;
  decimals?: number; 
  currencySymbol?: string; 
  className?: string; 
}



const BalanceButtonComponent: React.FC<BalanceButtonProps> = ({
  balance,
  decimals = 2,
  currencySymbol = "",
  className,
}) => {
  const [showBalance, setShowBalance] = useState(false);

  const toggleShow = useCallback(() => {
    setShowBalance((prev) => !prev);
  }, []);

  const formattedBalance = balance.toFixed(decimals);

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <span
        aria-label={showBalance ? "Hide balance" : "Show balance"}
        className="font-semibold md:text-lg text-xs select-none">
        {showBalance ? `${currencySymbol}${formattedBalance}` : "••••"}
      </span>
      <button
        onClick={toggleShow}
        aria-pressed={showBalance}
        aria-label={showBalance ? "Hide balance" : "Show balance"}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
        type="button">
        {showBalance ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
  );
};

const BalanceButton = React.memo(BalanceButtonComponent);
export default BalanceButton;

