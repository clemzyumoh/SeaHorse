
import { Keypair } from "@solana/web3.js";
import createEdgeClient
from "@honeycomb-protocol/edge-client";
import bs58 from "bs58";
import type { NextRequest } from "next/server";
import   { sendTransactions }  from "@honeycomb-protocol/edge-client/client/helpers";

export async function POST(req: NextRequest) {
  try {
 
   
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY || "";
    const adminKeypair = Keypair.fromSecretKey(bs58.decode(adminPrivateKey));


  const client = createEdgeClient(
    "https://edge.test.honeycombprotocol.com", 
    true
  );
 

      const {
        createCreateProjectTransaction: {
          tx: txResponse,
          project: projectAddress, // 
        },
      } = await client.createCreateProjectTransaction({
        name: "SeaHorse Saga",
        authority: adminKeypair.publicKey.toString(),
        payer: adminKeypair.publicKey.toString(),
        profileDataConfig: {
          achievements: ["Novice", "Seeker", "Voyager", "Expert", "Master"],
          customDataFields: ["Level", "XP"],
        },
      });

    // 5. Send transaction
    const response = await sendTransactions(
      client,
      {
        transactions: [txResponse.transaction],
        blockhash: txResponse.blockhash,
        lastValidBlockHeight: txResponse.lastValidBlockHeight,
      },
      [adminKeypair]
    );

   return Response.json({
     projectAddress: projectAddress, 
     signature: response, 
   });

      
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Creation failed" },
      { status: 500 }
    );
  }
}


