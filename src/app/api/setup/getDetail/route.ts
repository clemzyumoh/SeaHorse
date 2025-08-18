


import { createEdgeClient } from "@honeycomb-protocol/edge-client"; // Adjust import based on your setup
import { NextRequest, NextResponse } from "next/server";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";


export async function GET(_req:NextRequest) {
  try {
    const rpcUrl = "https://edge.test.honeycombprotocol.com";
    const client = createEdgeClient(rpcUrl, true);

   
  
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY || "";
    const adminKeypair = Keypair.fromSecretKey(bs58.decode(adminPrivateKey));
   
    const assemblerConfigAddress =
      "4zEZPFgmAfZcbpAtnTKLJL1RvajXtsD8Tgv3ztVjnVt7"; //order
    const characterModelAddress =
      "9PKRZNqo8HYxibKUn5QJkS3jgw2brfLGLRw43fbMfh7Q";
    const assemblerConfigs = await client.findAssemblerConfig({
      addresses: [assemblerConfigAddress],
    });

    const characterModels = await client.findCharacterModels({
      addresses: [characterModelAddress],
    });
    
    const projectAddress = "FFifh2cHzPHXtqvVdQKvmm2PNtLHSP4FhWQHWujBDotg";

    const profilesArray = await client
      .findProfiles({
      
        projects: [projectAddress],
      

        includeProof: true,
      })
      .then(({ profile }) => profile); 

    const usersArray = await client
      .findUsers({
       
        wallets: [adminKeypair.publicKey.toString()], 

        includeProof: true, 
      })
      .then(({ user }) => user); // This will be an array of users
    
   const character= await client.findCharacters({

      includeProof: true,
    
      wallets: [adminKeypair.publicKey.toString()], 
      attributeHashes: [], 
    });

    const assemblerConfig = assemblerConfigs.assemblerConfig?.[0];
    if (!assemblerConfig) {
      throw new Error("Assembler config not found");
    }

    const characterModel = characterModels.characterModel[0];
    const profilearry = profilesArray;
    const userarry = usersArray;
    const characterArray = character?.character[0]?.address   

    console.log("Assembler Config:", {
      address: assemblerConfigAddress,
      order: assemblerConfig?.order,
      // traits: assemblerConfig.order,
      project: assemblerConfig?.project,
      profilearry,
      // tickler: assemblerConfig.ticker,
      // tree: assemblerConfig.merkle_trees,
      character,
      characterArray
    });

    console.log("Character Model:", {
      address: characterModelAddress,
      attributes: characterModel.attributes,
    });

    return NextResponse.json({
      assemblerConfig: {
        order: assemblerConfig?.order,
        traits: assemblerConfig?.ticker,
      },
      characterModel: {
        attributes: characterModel.attributes,
      },
      profilearry,
      userarry,
      character,
      characterArray,
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

