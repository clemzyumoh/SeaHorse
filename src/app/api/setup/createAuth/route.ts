
import { NextRequest, NextResponse } from "next/server";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import Token from "../../../lib/model/Token"; // adjust the import

// save to MongoDB


import mongoose from "mongoose";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: "SeaHorse",
    });
    console.log("MongoDB connected");
  }
}
import cron from "node-cron";


//cron.schedule("0 0 * * *",); // runs every day at midnight


export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const adminKeypair = Keypair.fromSecretKey(
      bs58.decode(process.env.ADMIN_PRIVATE_KEY || "")
    );

    const client = createEdgeClient(
      "https://edge.test.honeycombprotocol.com",
      true
    );

   

    // ✅ Step 1: Auth request
    const {
      authRequest: { message: authMessage },
    } = await client.authRequest({
      wallet: adminKeypair.publicKey.toString(),
    });

    console.log("Auth message:", authMessage);

    // ✅ Step 2: Sign message (commented out)
    
    const signMessage = (message: string, keypair: Keypair) => {
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = nacl.sign.detached(messageBytes, keypair.secretKey);
      return bs58.encode(signatureBytes);
    };

    const signature = signMessage(
      authMessage,
      adminKeypair
    );
    console.log("Signature:", signature);
    


    const { authConfirm } = await client.authConfirm({
      wallet: adminKeypair.publicKey.toString(),
      signature,
    });

    console.log("Access Token:", authConfirm.accessToken);
    console.log("User Info:", authConfirm.user);
    
await Token.create({ value: authConfirm.accessToken });

    return NextResponse.json({
      
      authMessage,
       accessToken: authConfirm.accessToken, // will be available after uncommenting
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "User creation failed",
      },
      { status: 500 }
    );
  }
}





import { scheduleTokenRefresh } from "../../../lib/tokenManager";

// Run on server start
if (process.env.NODE_ENV === "production") {
  scheduleTokenRefresh();
}


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
    // Store new token with exact creation time
    await Token.create({
      value: authConfirm.accessToken,
      createdAt: new Date(), // Precise timestamp
    });

  //  await Token.create({ value: authConfirm.accessToken });
    console.log("Token refreshed:", authConfirm.accessToken);
  } catch (error) {
    console.error("Token refresh error:", error);
    // Retry after 30 seconds on failure
    setTimeout(refreshToken, 30000);
  }
}

// Helper
function signMessage(message: string, keypair: Keypair) {
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = nacl.sign.detached(messageBytes, keypair.secretKey);
  return bs58.encode(signatureBytes);
}




