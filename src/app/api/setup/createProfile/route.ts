


import { Keypair } from "@solana/web3.js";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";
import bs58 from "bs58";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Token from "../../../lib/model/Token";
 import { createCharacterIfNotExists } from "../createCharacter/route";


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
    const { userPublicKey, username } = await req.json();

    if (!userPublicKey || !username) {
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
    const projectAddress = process.env.HONEYCOMB_PROJECT_ADDRESS!;

    const client = createEdgeClient(
      "https://edge.test.honeycombprotocol.com",
      true
    );
    //     // After login or profile creation
      createCharacterIfNotExists({
    userPublicKey,
    }); // Fire-and-forget (no await)
    // Check for existing profile
    const profilesArray = await client
      .findProfiles({
        identities: [userPublicKey],
        includeProof: true,
      })
      .then(({ profile }) => profile);

    const existingProfile = profilesArray.find(
      (p) =>
        p.identity === userPublicKey.toString() ||
        p.info?.name === username.toString()
    );

    let profileAddress = existingProfile?.address;
    console.log("Existing profile address:", profileAddress);

    if (!existingProfile) {
      console.log("Creating new profile for user:", userPublicKey);
      const { createNewUserWithProfileTransaction } =
        await client.createNewUserWithProfileTransaction(
          {
            project: projectAddress,
            payer: adminKeypair.publicKey.toString(),
            wallet: userPublicKey,
            profileIdentity: userPublicKey,
            userInfo: {
              bio: `player name is ${username}`,
              name: ` ${username}`,
              pfp: "https://res.cloudinary.com/dwm4ss8cg/image/upload/v1754224402/play_lddo3a.png",
            },
          },
          {
            fetchOptions: {
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            },
          }
        );

      const createResponse = await sendTransactions(
        client,
        {
          transactions: [createNewUserWithProfileTransaction.transaction],
          blockhash: createNewUserWithProfileTransaction.blockhash,
          lastValidBlockHeight:
            createNewUserWithProfileTransaction.lastValidBlockHeight,
        },
        [adminKeypair]
      );

      profileAddress = createNewUserWithProfileTransaction.transaction;
      console.log("Profile created:", createResponse);

      // Initialize platformData
      // const initResponse = await fetch("/api/setup/initPlatformData", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ userPublicKey }),
      // });
const initResponse = await fetch(
  new URL("/api/setup/initPlatformData", req.url).toString(),
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userPublicKey }),
  }
);
      if (!initResponse.ok) {
        const errorData = await initResponse.json();
        throw new Error(
          `Failed to initialize platform data: ${errorData.error}`
        );
      }

      return NextResponse.json({
        message: "Profile created and platform data initialized",
        profileAddress,
        createSignature: createResponse,
      });
    } else {
      return NextResponse.json({
        message: "Profile already exists",
        profileAddress,
      });
    }
  } catch (error) {
    console.error("Error handling profile:", error);
    return NextResponse.json(
      {
        error: "Failed to handle profile",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}