
import { Keypair } from "@solana/web3.js";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";
import bs58 from "bs58";
import { NextRequest, NextResponse } from "next/server";

import { getHoneycombToken } from "@/app/lib/getHoneycombToken";


export async function POST(req: NextRequest) {
  

  try {
    const { userPublicKey } = await req.json();

    if (!userPublicKey) {
      return NextResponse.json(
        { error: "Missing userPublicKey" },
        { status: 400 }
      );
    }
// const tokenDoc = await Token.findOne();
//     const token = tokenDoc?.value;
      const token = await getHoneycombToken();
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY || "";
    const adminKeypair = Keypair.fromSecretKey(bs58.decode(adminPrivateKey));
    const accessToken = token;
    
   // const projectAddress = process.env.HONEYCOMB_PROJECT_ADDRESS!;

    const client = createEdgeClient(
      "https://edge.test.honeycombprotocol.com",
      true
    );

    // Fetch current profile
    const currentProfile = await client
      .findProfiles({
        identities: [userPublicKey],
        includeProof: true,
      })
      .then(({ profile }) => profile[0]);

    if (!currentProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileAddress = currentProfile?.address;

    // Initialize platformData
    const { createUpdatePlatformDataTransaction: profileTx } =
      await client.createUpdatePlatformDataTransaction(
        {
          profile: profileAddress,
          authority: adminKeypair.publicKey.toString(),
          platformData: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any

            addXp: 0 as any,
            custom: {
              add: [
                ["level", "1"],
                ["badges", ""],
                ["completedMissions", ""],
              ],
            },
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
      message: `Platform data initialized for profile: ${profileAddress}`,
      signature: response,
    });
  } catch (error) {
    console.error("Error initializing platform data:", error);
    return NextResponse.json(
      {
        error: "Failed to initialize platform data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}