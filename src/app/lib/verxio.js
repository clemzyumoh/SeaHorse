

// lib/verxio.js
import { VerxioClient } from "@verxio/sdk";

const client = new VerxioClient({
  cluster: "devnet",
  rpc: "https://api.devnet.solana.com",
});

export async function getClaimStatus(wallet) {
  const result = await client.rewards.getStatus(wallet);
  return result;
}
