

import { NextResponse } from 'next/server'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { keypairIdentity, generateSigner } from '@metaplex-foundation/umi'
import { createV1 } from '@metaplex-foundation/mpl-core'
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters'
import { Keypair } from '@solana/web3.js'




const umi = createUmi(process.env.RPC_URL!)
    .use(mplTokenMetadata())
    .use(keypairIdentity(
        fromWeb3JsKeypair(
            Keypair.fromSecretKey(
                new Uint8Array(JSON.parse(process.env.WALLET_SECRET_KEY!))
            )
    )));

export async function POST(req: Request) {
  try {
    const { playerWallet, nftName, nftMetadataUri } = await req.json();

    
    const metadata = {
      name: nftName,
      image: nftMetadataUri,
      attributes: [{ trait_type: "Level", value: "5" }],
    };


      const nftSigner = generateSigner(umi);
     // const options = { commitment: "confirmed", timeout: 60000 }; 
    await createV1(umi, {
      asset: nftSigner,
       uri: JSON.stringify(metadata), 
      name: nftName,
      owner: playerWallet,
    }).sendAndConfirm(umi);

    // 2. Return success
    return NextResponse.json({
      success: true,
      nftAddress: nftSigner.publicKey,
      explorerLink: `https://solscan.io/address/${nftSigner.publicKey}?cluster=devnet`,
    });
  } catch (error) {
    console.error("Minting failed:", error)
    return NextResponse.json(
      { error: "NFT minting failed" },
      { status: 500 }
    )
  }
}