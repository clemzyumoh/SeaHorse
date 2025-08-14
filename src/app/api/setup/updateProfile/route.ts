
// api/setup/updateProfile.ts
import { Keypair } from "@solana/web3.js";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";
import bs58 from "bs58";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Token from "../../../lib/model/Token";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: "SeaHorse",
    });
    console.log("MongoDB connected");
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { userPublicKey, xp, level, badgeUrl, nftAddress } = await req.json();

    if (!userPublicKey || !xp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tokenDoc = await Token.findOne();
    const token = tokenDoc?.value;
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY || "";
    const adminKeypair = Keypair.fromSecretKey(bs58.decode(adminPrivateKey));
    const accessToken = token;

    const client = createEdgeClient(
      "https://edge.test.honeycombprotocol.com",
      true
    );

    const currentProfile = await client
      .findProfiles({
        identities: [userPublicKey],
        includeProof: true,
      })
      .then(({ profile }) => profile[0]);

    if (!currentProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileAddress = currentProfile.address;
    const currentCustomData = currentProfile.platformData.custom || {};
    // Retrieve all existing data points from the current profile
    const existingXP = parseInt(currentCustomData.XP?.[0] || "0");
    const existingLevel = currentCustomData.level?.[0]; // Get the existing level
    const existingBadges =
      currentCustomData.badges?.[0]?.split(",").filter(Boolean) || [];
    const existingNfts =
      currentCustomData.nfts?.[0]?.split("|").filter(Boolean) || [];

    const customAdd: [string, string][] = [];

    // 1. Always update XP
    const newXP = (existingXP + parseInt(xp)).toString();
    customAdd.push(["XP", newXP]);

    // 2. Preserve or update the level
    // Use the new level if provided, otherwise, retain the existing one
    const finalLevel = level !== undefined ? level : existingLevel;
    if (finalLevel !== undefined) {
      customAdd.push(["level", finalLevel]);
    }
    // Update badges and completed missions only if missionId & badgeUrl are provided and not already recorded
    // 3. Preserve and potentially add a new badge
    const finalBadges = [...existingBadges];
    if (badgeUrl && !existingBadges.includes(badgeUrl)) {
      finalBadges.push(badgeUrl);
    }
    if (finalBadges.length > 0) {
      customAdd.push(["badges", finalBadges.join(",")]);
    }

    // 4. Preserve and potentially add a new NFT
    const finalNfts = [...existingNfts];
    if (nftAddress && !existingNfts.includes(nftAddress)) {
      finalNfts.push(nftAddress);
    }
    if (finalNfts.length > 0) {
      customAdd.push(["nfts", finalNfts.join("|")]);
    }

    // Create transaction
    const { createUpdatePlatformDataTransaction: profileTx } =
      await client.createUpdatePlatformDataTransaction(
        {
          profile: profileAddress,
          authority: adminKeypair.publicKey.toString(),
          platformData: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any

            addXp: parseInt(xp) as any,
            custom: { add: customAdd },
          },
        },
        {
          fetchOptions: { headers: { authorization: `Bearer ${accessToken}` } },
        }
      );

    // Send transaction
    const response = await sendTransactions(
      client,
      {
        transactions: [profileTx.transaction],
        blockhash: profileTx.blockhash,
        lastValidBlockHeight: profileTx.lastValidBlockHeight,
      },
      [adminKeypair]
    );

    return NextResponse.json({
      message: `Profile updated: XP ${newXP}${
        level !== undefined ? `, Level ${level}` : ""
      }${badgeUrl && !existingBadges.includes(badgeUrl) ? `, Badge added` : ""}`,
      signature: response,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
