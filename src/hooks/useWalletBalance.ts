// hooks/useWalletBalance.ts
"use client"
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";

// Correct USDC mints for each network
const USDC_MINTS: Record<string, string> = {
  mainnet: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  devnet: "EGcvNycAx1dkZUjm5GBgK5bj2sMNEK3cUhVwKLAXnyU9",//"Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr", 
  testnet: "Es9vMFrzaCERaZm2B8fCCGriTzTVE6q84PXzqWpSyMyg", 
};
  

const COINGECKO_IDS = {
  solana: "solana",
  usdc: "usd-coin",
};

export const useWalletBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [solBalance, setSolBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [totalUsd, setTotalUsd] = useState(0);
  const [prices, setPrices] = useState({ sol: 0, usdc: 1 });

  

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin&vs_currencies=usd`
        );
        setPrices({
          // sol: res.data[COINGECKO_IDS.solana].usd,
          // usdc: res.data[COINGECKO_IDS.usdc].usd,
          sol: Number(res.data[COINGECKO_IDS.solana].usd.toFixed(2)),
          usdc: Number(res.data[COINGECKO_IDS.usdc].usd.toFixed(2)),
        });
      } catch (e) {
        console.error("Failed to fetch prices", e);
      }
    };

    fetchPrices();
  }, []);

 
  
  useEffect(() => {
    if (!publicKey) return;

    const fetchBalances = async () => {
      try {
        const endpoint = connection.rpcEndpoint;
        const network = endpoint.includes("devnet")
          ? "devnet"
          : endpoint.includes("testnet")
          ? "testnet"
          : "mainnet";

        const sol = await connection.getBalance(publicKey);
        setSolBalance(Number((sol / LAMPORTS_PER_SOL).toFixed(3)));

        const usdcMint = new PublicKey(USDC_MINTS[network]);
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { mint: usdcMint }
        );

        if (tokenAccounts.value.length > 0) {
          const amount =
            tokenAccounts.value[0].account.data.parsed.info.tokenAmount
              .uiAmount || 0;
          setUsdcBalance(Number(amount.toFixed(2)));
        } else {
          setUsdcBalance(0);
        }
      } catch (e) {
        console.error("Error fetching balances:", e);
      }
    };

    fetchBalances();
  }, [publicKey, connection]);
  
  useEffect(() => {
    setTotalUsd(solBalance * prices.sol + usdcBalance * prices.usdc);
  }, [solBalance, usdcBalance, prices]);

  return {
    solBalance,
    usdcBalance,
    totalUsd,
    prices,
  };
};
