// utils/honeycombTokenManager.ts
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import Token from "../lib/model/Token";
import mongoose from "mongoose";

let refreshTimeout: NodeJS.Timeout;
let isRefreshing = false;

// MongoDB connection helper
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: "SeaHorse",
    });
    console.log("[HoneycombTokenManager] MongoDB connected");
  }
}

// Message signing
function signMessage(message: string, keypair: Keypair) {
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = nacl.sign.detached(messageBytes, keypair.secretKey);
  return bs58.encode(signatureBytes);
}

// Refresh token from Honeycomb
export async function refreshToken() {
  await connectDB();
  try {
    const adminKeypair = Keypair.fromSecretKey(
      bs58.decode(process.env.ADMIN_PRIVATE_KEY || "")
    );
    const client = createEdgeClient(
      "https://edge.test.honeycombprotocol.com",
      true
    );

    const {
      authRequest: { message: authMessage },
    } = await client.authRequest({
      wallet: adminKeypair.publicKey.toString(),
    });

    const signature = signMessage(authMessage, adminKeypair);

    const { authConfirm } = await client.authConfirm({
      wallet: adminKeypair.publicKey.toString(),
      signature,
    });

    // Save token with timestamp
    await Token.create({
      value: authConfirm.accessToken,
      createdAt: new Date(),
    });

    console.log(
      "[HoneycombTokenManager] Token refreshed:",
      authConfirm.accessToken
    );
  } catch (err) {
    console.error("[HoneycombTokenManager] Token refresh failed:", err);
    // Retry after 30s on failure
    setTimeout(refreshToken, 30_000);
  }
}

// Schedule automatic refresh
export async function scheduleTokenRefresh() {
  await connectDB();
  if (isRefreshing) return;

  try {
    isRefreshing = true;
    if (refreshTimeout) clearTimeout(refreshTimeout);

    const latestToken = await Token.findOne().sort({ createdAt: -1 });

    if (!latestToken) {
      console.log("[HoneycombTokenManager] No token found, refreshing now...");
      await refreshToken();
      return scheduleTokenRefresh(); // schedule next
    }

    const expiryTime =
      new Date(latestToken.createdAt).getTime() + 24 * 60 * 60 * 1000; // 24h
    const now = Date.now();
    const delay = Math.max(0, expiryTime - now + 3_000); // 3s buffer

    console.log(
      `[HoneycombTokenManager] Next refresh in ${(delay / 1000).toFixed(0)}s`
    );

    refreshTimeout = setTimeout(async () => {
      await refreshToken();
      scheduleTokenRefresh(); // reschedule
    }, delay);
  } finally {
    isRefreshing = false;
  }
}

// Run automatically on server start
if (process.env.NODE_ENV === "production") {
  scheduleTokenRefresh().catch(console.error);
}
