


import { Connection, PublicKey } from "@solana/web3.js";
import { createEdgeClient } from "@honeycomb-protocol/edge-client"; // Adjust import based on your setup
import { NextRequest, NextResponse } from "next/server";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";


export async function GET(req:NextRequest) {
  try {
    const rpcUrl = "https://edge.test.honeycombprotocol.com";
  
    const client = createEdgeClient(rpcUrl, true);

    const projectAddress = process.env.HONEYCOMB_PROJECT_ADDRESS!;
    

    
    const profilesArray = await client
      .findProfiles({
    
        projects: [projectAddress],
      

        includeProof: true, 
      })
      .then(({ profile }) => profile); 

    const profilearry = profilesArray;

   
    

    return NextResponse.json({
      profilearry,
    });
  } catch (error) {
    console.error("Error fetching configurations:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch configurations",
        details: error,
      },
      { status: 500 }
    );
  }
}

