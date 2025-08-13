
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
    const { userPublicKey, xp, level, badgeUrl,  nftAddress } = await req.json();

    if (!userPublicKey || !xp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tokenDoc = await Token.findOne();
    const token = tokenDoc?.value;
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY || "";
    const adminKeypair = Keypair.fromSecretKey(bs58.decode(adminPrivateKey));
    const accessToken = token;

    const client = createEdgeClient("https://edge.test.honeycombprotocol.com", true);

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
    const currentBadges = currentCustomData.badges?.[0]?.split(",").filter(Boolean) || [];
    //const completedMissions = currentCustomData.completedMissions?.[0]?.split(",").filter(Boolean) || [];
    const updatedNfts = [...(currentCustomData.nfts?.[0]?.split("|").filter(Boolean) || [])];

    const customAdd: [string, string][] = [];

    // Always update XP
    const newXP = (parseInt(currentCustomData.XP?.[0] || "0") + parseInt(xp)).toString();
    customAdd.push(["XP", newXP]);

    // Update level only if provided
   if (level !== undefined) {
     customAdd.push(["level", level]);
   }


    // Update badges and completed missions only if missionId & badgeUrl are provided and not already recorded
 
    if (badgeUrl && !currentBadges.includes(badgeUrl)) {
      customAdd.push(["badges", [...currentBadges, badgeUrl].join(",")]);
    }


    // Update NFTs only if provided and not already stored
    if (nftAddress && !updatedNfts.includes(nftAddress)) {
      updatedNfts.push(nftAddress);
      customAdd.push(["nfts", updatedNfts.join("|")]);
    }

    // Create transaction
    const { createUpdatePlatformDataTransaction: profileTx } = await client.createUpdatePlatformDataTransaction(
      {
        profile: profileAddress,
        authority: adminKeypair.publicKey.toString(),
        platformData: {
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
      }${badgeUrl && !currentBadges.includes(badgeUrl) ? `, Badge added` : ""}`,
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
