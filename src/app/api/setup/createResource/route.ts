
import { Keypair } from "@solana/web3.js";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import { ResourceStorageEnum } from "@honeycomb-protocol/edge-client"; // Import the enum
import bs58 from "bs58";
import type { NextRequest } from "next/server";
import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";


export async function POST(req: NextRequest) {
  try {
    
    const adminKeypair = Keypair.fromSecretKey(
      bs58.decode(process.env.ADMIN_PRIVATE_KEY || "")
    );

    const client = createEdgeClient(
      "https://edge.test.honeycombprotocol.com", // Must match project creation
      true
    );

    const { projectAddress } = await req.json();
    console.log("Project Address:", projectAddress); // Debug log

    if (!projectAddress) {
      return Response.json(
        { error: "Missing project address" },
        { status: 400 }
      );
    }

const { createCreateNewResourceTransaction } =
  await client.createCreateNewResourceTransaction({
    project: projectAddress,
    authority: adminKeypair.publicKey.toString(),
    payer: adminKeypair.publicKey.toString(),
    params: {
      name: "XP Token",
      decimals: 0,
      symbol: "XP",
      uri: "https://placehold.co/400x400/png?text=XP+Token",
      storage: ResourceStorageEnum.LedgerState,
      tags: ["Progression"],
    },
  });

const resourceAddress = createCreateNewResourceTransaction.resource.toString(); 

const response = await sendTransactions(
  client,
  {
    transactions: [createCreateNewResourceTransaction.tx.transaction],
    blockhash: createCreateNewResourceTransaction.tx.blockhash,
    lastValidBlockHeight:
      createCreateNewResourceTransaction.tx.lastValidBlockHeight,
  },
  [adminKeypair]
);

return Response.json({
  resourceAddress, 
  signature: response,
});

  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Resource creation failed",
      },
      { status: 500 }
    );
  }
}