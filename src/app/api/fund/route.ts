
import { NextResponse } from "next/server";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Keypair,
  clusterApiUrl,
} from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import bs58 from "bs58";

// Initialize Solana connection
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const admin = Keypair.fromSecretKey(bs58.decode(process.env.ADMIN_SECRET_KEY!));
const USDC_MINT = new PublicKey(process.env.USDC_MINT_ADDRESS!);

export async function POST(request: Request) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const userPubkey = new PublicKey(walletAddress);

    // 1. Airdrop SOL
    const sig = await connection.requestAirdrop(userPubkey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(sig, "confirmed");

    // 2. Fund USDC
    const userATA = await getOrCreateAssociatedTokenAccount(
      connection,
      admin,
      USDC_MINT,
      userPubkey
    );

    await mintTo(
      connection,
      admin,
      USDC_MINT,
      userATA.address,
      admin,
      100_000_000 // 100 USDC
    );

    return NextResponse.json({
      success: true,
      message: "Wallet funded successfully",
    });
  } catch (error) {
    console.error("Funding error:", error);
    return NextResponse.json(
      { error: "Failed to fund wallet" },
      { status: 500 }
    );
  }
}