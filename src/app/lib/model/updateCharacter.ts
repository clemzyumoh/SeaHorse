
// src/lib/honeycomb.ts
import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";
import { Keypair } from "@solana/web3.js";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import bs58 from "bs58";

export async function createCharacterIfNotExists({
  userPublicKey,
}: {
  userPublicKey: string;
}) {
  try {
    const rpcUrl = "https://edge.test.honeycombprotocol.com";
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY || "";
    const adminKeypair = Keypair.fromSecretKey(bs58.decode(adminPrivateKey));

    const client = createEdgeClient(rpcUrl, true);

    const characterSearch = await client.findCharacters({
      wallets: [userPublicKey],
      includeProof: true,
    });

    const existingCharacter = characterSearch?.character[0]?.address;
    if (existingCharacter) {
      console.log("Character already exists:", existingCharacter);
      return { characterAddress: existingCharacter };
    }

    const { createAssembleCharacterTransaction } =
      await client.createAssembleCharacterTransaction({
        project: process.env.HONEYCOMB_PROJECT_ADDRESS!,
        assemblerConfig: process.env.HONEYCOMB_ASSEMBLER_CONFIG!,
        characterModel: process.env.HONEYCOMB_CHARACTER_MODEL!,
        owner: userPublicKey,
        authority: adminKeypair.publicKey.toString(),
        attributes: [
          ["Level", "1"],
          ["XP", "500"],
        ],
      });

    const characterAddress =
      createAssembleCharacterTransaction.transaction.toString();

    const characterResponse = await sendTransactions(
      client,
      {
        transactions: [createAssembleCharacterTransaction.transaction],
        blockhash: createAssembleCharacterTransaction.blockhash,
        lastValidBlockHeight:
          createAssembleCharacterTransaction.lastValidBlockHeight,
      },
      [adminKeypair]
    );

    console.log("Character created:", characterAddress, characterResponse);
    return { characterAddress };
  } catch (err) {
    console.error("Error checking or creating character:", err);
    throw err; // ✅ throw the caught error
  }
}
