import { Keypair } from "@solana/web3.js";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";
import bs58 from "bs58";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userPublicKey, level, xp } = await req.json();

    if (!userPublicKey || level == null || xp == null) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY || "";
    const adminKeypair = Keypair.fromSecretKey(bs58.decode(adminPrivateKey));
    const accessToken = process.env.HONEYCOMB_ACCESS_TOKEN || "";

    const client = createEdgeClient(
      "https://edge.test.honeycombprotocol.com",
      true
    );

    const projectAddress = process.env.HONEYCOMB_PROJECT_ADDRESS!;
    const assemblerConfigAddress = process.env.HONEYCOMB_ASSEMBLER_CONFIG!;
    const characterModelAddress = process.env.HONEYCOMB_CHARACTER_MODEL!;

    const characterResult = await client.findCharacters({
      wallets: [userPublicKey],
      includeProof: true,
    });

    const characterAddress = characterResult.character[0]?.address;
    const sourceParams = characterResult.character[0]?.source.params;

    let currentXP = 0;

    if ("attributes" in sourceParams!) {
      currentXP = Number(sourceParams.attributes?.XP || 0);
    }

    const updatedXP = currentXP + xp;

    if (!characterAddress) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    const { createUpdateCharacterTraitsTransaction: traitTx } =
      await client.createUpdateCharacterTraitsTransaction(
        {
          project: projectAddress,
          authority: adminKeypair.publicKey.toString(),
          assemblerConfig: assemblerConfigAddress,
          characterAddress: characterAddress,
              characterModel: characterModelAddress,
          
          attributes: [
            ["Level", `${level}`] as any,
            ["XP", `${updatedXP}`] as any,
          ],
        }
        // {
        //   fetchOptions: {
        //     headers: {
        //       authorization: `Bearer ${accessToken}`,
        //     },
        //   },
        // }
      );

    const signature = await sendTransactions(
      client,
      {
        transactions: [traitTx.transaction],
        blockhash: traitTx.blockhash,
        lastValidBlockHeight: traitTx.lastValidBlockHeight,
      },
      [adminKeypair]
    );

    return NextResponse.json({
      message: "Character traits updated",
      signature,
    });
  } catch (error) {
    console.error("Error updating traits:", error);
    return NextResponse.json(
      {
        error: "Failed to update character traits",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
