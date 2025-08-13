
import { Keypair } from "@solana/web3.js";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";
import bs58 from "bs58";
export const  updateCustomProfileData = async ({
  userPublicKey,
  username,
  
}: {
  userPublicKey: string;
  username: string;
 
}) => {
    try {
      const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY || "";
      const adminKeypair = Keypair.fromSecretKey(bs58.decode(adminPrivateKey));
      const accessToken = process.env.HONEYCOMB_ACCESS_TOKEN || "";
      const client = createEdgeClient(
        "https://edge.test.honeycombprotocol.com",
        true
      );

      const profiles = await client
        .findProfiles({
          identities: [userPublicKey],
          includeProof: true,
        })
        .then(({ profile }) => profile);

      const profileAddress = profiles[0]?.address;

      if (!profileAddress) throw new Error("Profile not found");

      console.log("Updating new user profile at:", profileAddress);

      const { createUpdateProfileTransaction: profileTx } =
        await client.createUpdateProfileTransaction(
          {
            profile: profileAddress.toString(),
            payer: adminKeypair.publicKey.toString(),
            customData: {
              add: {
                wallet: [userPublicKey],
                username: [username],
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

      const updateResponse = await sendTransactions(
        client,
        {
          transactions: [profileTx.transaction],
          blockhash: profileTx.blockhash,
          lastValidBlockHeight: profileTx.lastValidBlockHeight,
        },
        [adminKeypair]
      );

      return {
        success: true,
        profileAddress,
        signature: updateResponse,
      };
    } catch (err) {
    console.error("Custom profile update failed:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
};
