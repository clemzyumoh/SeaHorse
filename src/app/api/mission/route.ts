import {
  RewardKind,
 
} from "@honeycomb-protocol/edge-client";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { NextRequest, NextResponse } from "next/server";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";

export async function POST(req: NextRequest) {
  try {
    const {
      projectAddress,
      missionPoolAddress,
      resourceAddress,
      level,
      xpGoal,
      duration,
      badge,
    } = await req.json();

    if (
      !projectAddress ||
      !missionPoolAddress ||
      !resourceAddress ||
      !level ||
      !xpGoal ||
      !duration ||
      !badge
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Load admin keypair
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY || "";
    const adminKeypair = Keypair.fromSecretKey(bs58.decode(adminPrivateKey));

    // Initialize Honeycomb client
    const client = createEdgeClient(
      "https://edge.test.honeycombprotocol.com",
      true
    );

    // Create the mission transaction
    const {
      createCreateMissionTransaction: { tx, missionAddress },
    } = await client.createCreateMissionTransaction({
      data: {
        name: `Level ${level} - ${badge}`,
        project: projectAddress,
        cost: {
          address: resourceAddress,
          amount: "0",
        },
        duration: duration.toString(),
        minXp: "0",
        rewards: [
          {
            kind: RewardKind.Xp,
            min: xpGoal.toString(),
            max: xpGoal.toString(),
          },
        ],
        missionPool: missionPoolAddress,
        authority: adminKeypair.publicKey.toString(),
        payer: adminKeypair.publicKey.toString(),
      },
    });

    // Send transaction
    const response = await sendTransactions(
      client,
      {
        transactions: [tx.transaction],
        blockhash: tx.blockhash,
        lastValidBlockHeight: tx.lastValidBlockHeight,
      },
      [adminKeypair]
    );

    return NextResponse.json({
      missionAddress,
      signature: response,
      message: `Mission for Level ${level} created successfully!`,
    });
  } catch (error) {
    console.error("Error creating mission:", error);
    return NextResponse.json(
      {
        error: "Failed to create mission",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
