import { Keypair } from "@solana/web3.js";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";
import bs58 from "bs58";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { projectAddress, characterModelAddress } = await req.json();

    if (!projectAddress || !characterModelAddress) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY || "";
    const adminKeypair = Keypair.fromSecretKey(bs58.decode(adminPrivateKey));

    const client = createEdgeClient(
      "https://edge.test.honeycombprotocol.com",
      true
    );

    const {
      createCreateMissionPoolTransaction: {
        missionPoolAddress,
        tx: txResponse,
      },
    } = await client.createCreateMissionPoolTransaction({
      data: {
        name: "SeaHorse Saga Mission Pool",
        project: projectAddress,
        payer: adminKeypair.publicKey.toString(),
        authority: adminKeypair.publicKey.toString(),
        characterModel: characterModelAddress,
      },
    });

    const response = await sendTransactions(
      client,
      {
        transactions: [txResponse.transaction],
        blockhash: txResponse.blockhash,
        lastValidBlockHeight: txResponse.lastValidBlockHeight,
      },
      [adminKeypair]
    );

    return NextResponse.json({
      missionPoolAddress,
      signature: response,
    });
  } catch (error) {
    console.error("Mission Pool Error:", error);
    return NextResponse.json(
      { error: "Failed to create mission pool", details: error },
      { status: 500 }
    );
  }
}

