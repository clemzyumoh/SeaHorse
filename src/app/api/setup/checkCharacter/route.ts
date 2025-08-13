
import { NextResponse } from "next/server";
import createEdgeClient from "@honeycomb-protocol/edge-client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicKey = searchParams.get("publicKey");
    if (!publicKey) {
      return NextResponse.json(
        { error: "Public key is required" },
        { status: 400 }
      );
    }

    const client = createEdgeClient(
      "https://edge.test.honeycombprotocol.com",
      true
    );
    const characterSearch = await client.findCharacters({
      wallets: [publicKey],
      includeProof: true,
    });

    const characterAddress = characterSearch?.character[0]?.address;
    if (characterAddress) {
      return NextResponse.json({ characterAddress });
    } else {
      return NextResponse.json({ characterAddress: null });
    }
  } catch (error) {
    console.error("Error checking character:", error);
    return NextResponse.json(
      { error: "Failed to check character" },
      { status: 500 }
    );
  }
}